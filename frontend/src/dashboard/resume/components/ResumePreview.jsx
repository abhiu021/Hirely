import React, { useContext } from "react";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import PersonalDetailPreview from "./preview/PersonalDetailPreview";
import SummeryPreview from "./preview/SummeryPreview";
import ExperiencePreview from "./preview/ExperiencePreview";
import EducationalPreview from "./preview/EducationalPreview";
import SkillsPreview from "./preview/SkillsPreview";
import MinimalATSTemplate from "./templates/MinimalATSTemplate";
import ProfessionalTemplate from "./templates/ProfessionalTemplate";
import ProjectsPreview from "./preview/ProjectsPreview";

function ResumePreview({ template = "modern" }) {
  const { resumeInfo } = useContext(ResumeInfoContext);

  const renderTemplate = () => {
    switch (template) {
      case "modern":
        return (
          <div className="relative w-full h-full overflow-hidden">
            {" "}
            {/* Container with boundaries */}
            {/* Watermark */}
            {!resumeInfo?.isVerified && (
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  zIndex: 999,
                  background:
                    "repeating-linear-gradient(-45deg, transparent, transparent 100px, rgba(200,200,200,0.1) 100px, rgba(200,200,200,0.1) 200px)",
                  overflow: "hidden",
                }}
              >
                <div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform rotate-[-30deg] whitespace-nowrap"
                  style={{
                    fontSize: "clamp(40px, 10vw, 80px)", // Responsive font size
                    color: "rgba(200,200,200,0.3)",
                    fontWeight: "bold",
                    userSelect: "none",
                    maxWidth: "100%",
                    overflow: "hidden",
                    width: "150%", // Ensure full coverage
                    textAlign: "center",
                  }}
                >
                  UNVERIFIED
                </div>
              </div>
            )}
            {/* Existing modern template content */}
            <PersonalDetailPreview resumeInfo={resumeInfo} />
            <SummeryPreview resumeInfo={resumeInfo} />
            {resumeInfo?.Experience?.length > 0 && (
              <ExperiencePreview resumeInfo={resumeInfo} />
            )}
            {resumeInfo?.education?.length > 0 && (
              <EducationalPreview resumeInfo={resumeInfo} />
            )}
            {resumeInfo?.projects?.length > 0 && (
              <ProjectsPreview resumeInfo={resumeInfo} />
            )}
            {resumeInfo?.skills?.length > 0 && (
              <SkillsPreview resumeInfo={resumeInfo} />
            )}
          </div>
        );
      case "minimal":
        return <MinimalATSTemplate resumeInfo={resumeInfo} />;
      case "professional":
        return <ProfessionalTemplate resumeInfo={resumeInfo} />;
      default:
        return null;
    }
  };

  return (
    <div
      className="shadow-lg h-full p-14 border-t-[20px]"
      style={{ borderColor: resumeInfo?.themeColor }}
    >
      {renderTemplate()}
    </div>
  );
}

export default ResumePreview;
