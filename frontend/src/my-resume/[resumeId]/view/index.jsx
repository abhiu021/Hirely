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
import { ChevronDown, Download } from "lucide-react";
import { useReactToPrint } from "react-to-print";
// Import basic print styles
import "./print.css";

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
      <div className="resume-view-container">
        {/* Header section - will not be printed */}
        <div id="no-print">
          <Header />

          <div className="my-10 mx-10 md:mx-20 lg:mx-36">
            <h2 className="text-center text-2xl font-medium">
              Congrats! Your Ultimate AI generates Resume is ready!
            </h2>
            <p className="text-center text-gray-400">
              Now you are ready to download your resume and you can share a unique
              resume URL with your friends and family.
            </p>
            <div className="flex justify-between items-center px-44 my-10">
              <Button
                onClick={handlePrint}
                className="flex items-center gap-2"
                disabled={!resumeInfo || loading}
              >
                <Download className="h-4 w-4" />
                Download PDF
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
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
                <Button>Share</Button>
              </RWebShare>
            </div>
          </div>
        </div>
        
        {/* Regular preview for display */}
        <div className="flex justify-center mt-8 mb-16">
          {resumeInfo && (
            <div className="preview-container">
              <ResumePreview template={activeTemplate} />
            </div>
          )}
        </div>
        
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