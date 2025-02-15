import Header from "@/components/custom/Header";
import { Button } from "@/components/ui/button";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import ResumePreview from "@/dashboard/resume/components/ResumePreview";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios"; // Import Axios
import { RWebShare } from "react-web-share";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Download } from "lucide-react";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

function ViewResume() {
  const [downloading, setDownloading] = useState(false);
  const [resumeInfo, setResumeInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTemplate, setActiveTemplate] = useState("modern");
  const params = useParams();
  const { getToken } = useAuth();

  const resumeId = params.resumeId; // Extract resumeId from params

  const templates = {
    modern: "Modern Template",
    minimal: "Minimal ATS",
    professional: "Professional",
  };

  const GetResumeInfo = async () => {
    setLoading(true);
    try {
      const token = await getToken(); // Get the authorization token
      const response = await axios.get(
        `http://localhost:5000/api/dashboard/resume/${resumeId}/edit`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data.data);
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

  const handleDownloadPDF = async () => {
    try {
      setDownloading(true);
      const element = document.getElementById("print-area");

      // Generate high-resolution canvas
      const canvas = await html2canvas(element, {
        scale: 3, // High resolution for better text clarity
        useCORS: true,
        logging: false,
        allowTaint: false,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgWidth = 210; // A4 width
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

      // ✅ Manually add clickable email & phone links
      const links = element.querySelectorAll('a[href^="mailto:"], a[href^="tel:"]');

      links.forEach((link) => {
        const href = link.getAttribute("href");
        const rect = link.getBoundingClientRect();

        // Convert browser coordinates to PDF coordinates
        const x = (rect.left / window.innerWidth) * imgWidth;
        const y = (rect.top / window.innerHeight) * imgHeight;
        const width = (rect.width / window.innerWidth) * imgWidth;
        const height = (rect.height / window.innerHeight) * imgHeight;

        pdf.link(x, y, width, height, { url: href }); // Add clickable area
      });

      // Use first name for the PDF filename
      const fileName = `${resumeInfo?.personalDetails?.firstName}_Resume.pdf`;
      pdf.save(fileName);
      toast.success("Resume downloaded successfully with clickable links!");
    } catch (error) {
      console.error("PDF download error:", error);
      toast.error("Failed to download resume");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <ResumeInfoContext.Provider value={{ resumeInfo, setResumeInfo }}>
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
              onClick={handleDownloadPDF}
              disabled={downloading}
              className="flex items-center gap-2"
            >
              {downloading ? (
                <span>Downloading...</span>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  Download PDF
                </>
              )}
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
                title: `${resumeInfo?.firstName} ${resumeInfo?.lastName}'s resume`,
              }}
              onClick={() => console.log("shared successfully!")}
            >
              <Button>Share</Button>
            </RWebShare>
          </div>
        </div>
      </div>
      <div className="my-10 mx-10 md:mx-20 lg:mx-36">
        <div id="print-area">
          <ResumePreview template={activeTemplate} />
        </div>
      </div>
    </ResumeInfoContext.Provider>
  );
}

export default ViewResume;