import React from "react";
import { Mail, Phone } from "lucide-react";

function PersonalDetailPreview({ resumeInfo }) {
  return (
    <div>
      <h2
        className="font-bold text-xl text-center"
        style={{
          color: resumeInfo?.themeColor,
        }}
      >
        {resumeInfo?.personalDetails?.firstName}{" "}
        {resumeInfo?.personalDetails?.lastName}
      </h2>
      <h2 className="text-center text-sm font-medium">
        {resumeInfo?.personalDetails?.jobTitle}
      </h2>
      <h2
        className="text-center font-normal text-xs"
        style={{
          color: resumeInfo?.themeColor,
        }}
      >
        {resumeInfo?.personalDetails?.address}
      </h2>

      <div className="flex justify-between">
        {resumeInfo?.personalDetails?.phone && (
          <a
            href={`tel:${resumeInfo?.personalDetails?.phone}`}
            className="font-normal text-xs flex items-center gap-1 hover:underline"
            style={{ color: resumeInfo?.themeColor }}
          >
            <Phone size={12} />
            {resumeInfo?.personalDetails?.phone}
          </a>
        )}

        {resumeInfo?.personalDetails?.email && (
          <a
            href={`mailto:${resumeInfo?.personalDetails?.email}`}
            className="font-normal text-xs hover:underline flex items-center gap-1"
            style={{ color: resumeInfo?.themeColor }}
          >
            <Mail size={12} />
            {resumeInfo?.personalDetails?.email}
          </a>
        )}
      </div>
      <hr
        className="border-[1.5px] my-2"
        style={{
          borderColor: resumeInfo?.themeColor,
        }}
      />
    </div>
  );
}

export default PersonalDetailPreview;
