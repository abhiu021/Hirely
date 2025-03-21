import Header from "@/components/custom/Header";
import { Button } from "@/components/ui/button";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import ResumePreview from "@/dashboard/resume/components/ResumePreview";
import PrintableResume from "@/dashboard/resume/components/PrintableResume";
import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { RWebShare } from "react-web-share";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Download, Share2 } from "lucide-react";
import { useReactToPrint } from "react-to-print";
// Import basic print styles
import "./print.css";
import AnimatedSection from "@/components/ui/animated-section";

function ViewResume() {
  const [resumeInfo, setResumeInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTemplate, setActiveTemplate] = useState("modern");
  const params = useParams();
  const { getToken } = useAuth();
  
  // Reference for printing - using React.createRef() for better compatibility with class components
  const printRef = React.createRef();
  
  // Direct implementation of useReactToPrint without a custom hook
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `${resumeInfo?.personalDetails?.firstName || 'Resume'}.pdf`,
  });

  const resumeId = params.resumeId;

  const templates = {
    modern: "Modern Template",
    minimal: "Minimal ATS",
    professional: "Professional",
  };

  const GetResumeInfo = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      const response = await axios.get(
        `https://hirely-78iq.onrender.com/api/dashboard/resume/${resumeId}/edit`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setResumeInfo(response.data.data);
    } catch (error) {
      console.error("Error fetching resume data:", error);
      toast.error("Failed to fetch resume details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    GetResumeInfo();
  }, [resumeId]);

  return (
    <ResumeInfoContext.Provider value={{ resumeInfo, setResumeInfo }}>
      <div className="resume-view-container min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        {/* Header section - will not be printed */}
        <div id="no-print">
          <Header />

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-8">
            <AnimatedSection animation="fade-up" delay={100}>
              <h2 className="text-center text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                Congratulations! Your Resume is Ready
              </h2>
              <p className="text-center text-gray-500 mt-2 max-w-2xl mx-auto">
                Your AI-generated resume is ready for download. You can also share a unique
                resume URL with anyone you like.
              </p>
            </AnimatedSection>
            
            <AnimatedSection animation="fade-up" delay={200} className="mt-8 mb-10">
              <div className="flex flex-col md:flex-row justify-center items-center gap-4 max-w-lg mx-auto">
                <Button
                  onClick={handlePrint}
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full w-full md:w-auto"
                  disabled={!resumeInfo || loading}
                >
                  <Download className="h-4 w-4" />
                  Download PDF
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2 rounded-full border border-gray-200 w-full md:w-auto">
                      {templates[activeTemplate]}
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {Object.entries(templates).map(([key, value]) => (
                      <DropdownMenuItem
                        key={key}
                        onClick={() => setActiveTemplate(key)}
                      >
                        {value}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                <RWebShare
                  data={{
                    text: "Hello Everyone, This is my resume please open the URL to see it",
                    url: `${
                      import.meta.env.VITE_BASE_URL
                    }/my-resume/${resumeId}/view`,
                    title: `${resumeInfo?.personalDetails?.firstName || ''} ${resumeInfo?.personalDetails?.lastName || ''}'s resume`,
                  }}
                  onClick={() => console.log("shared successfully!")}
                >
                  <Button variant="outline" className="flex items-center gap-2 rounded-full border border-gray-200 w-full md:w-auto">
                    <Share2 className="h-4 w-4" />
                    Share Resume
                  </Button>
                </RWebShare>
              </div>
            </AnimatedSection>
          </div>
        </div>
        
        {/* Regular preview for display */}
        <AnimatedSection animation="fade-up" delay={300} className="flex justify-center pb-16 px-4">
          {resumeInfo && (
            <div className="preview-container max-w-4xl w-full">
              <ResumePreview template={activeTemplate} />
            </div>
          )}
        </AnimatedSection>
        
        {/* Hidden printable component - this is what actually gets printed */}
        {resumeInfo && (
          <div style={{ display: 'none' }}>
            <PrintableResume 
              ref={printRef}
              template={activeTemplate}
              resumeInfo={resumeInfo}
            />
          </div>
        )}
      </div>
    </ResumeInfoContext.Provider>
  );
}

export default ViewResume;