import React from 'react';
import { Mail, Phone, MapPin, ExternalLink } from 'lucide-react';

const ProfessionalTemplate = ({ resumeInfo }) => {
  return (
    <div className="relative max-w-[800pt] mx-auto p-[20pt] box-border bg-white text-black font-[Georgia,'Times New Roman',serif] leading-[1.4]">
      {/* Personal Details Header */}
      {resumeInfo?.personalDetails && (
        <header className="text-left mb-[10pt] pb-[4pt]">
          {/* Name and Job Title */}
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-[16pt] font-bold my-[2pt] uppercase">
                {resumeInfo.personalDetails.firstName} {resumeInfo.personalDetails.lastName}
              </h1>
              <p className="text-[10pt] my-[1pt]">
                {resumeInfo.personalDetails.jobTitle}
              </p>
            </div>

            {/* Contact Details (Right Corner) */}
            <div className="text-right">
              {/* Address */}
              <div className="my-[1pt] text-[10pt] leading-[1.1]">
                <span className="inline-block w-[14px] align-middle">
                  <MapPin size={10} />
                </span>
                <span className="inline-block align-middle ml-[4px]">
                  {resumeInfo.personalDetails.address}
                </span>
              </div>
              {/* Email */}
              <div className="my-[1pt] text-[10pt] leading-[1.1]">
                <span className="inline-block w-[14px] align-middle">
                  <Mail size={10} />
                </span>
                <span className="inline-block align-middle ml-[4px]">
                  <a href={`mailto:${resumeInfo.personalDetails.email}`} className="no-underline text-black">
                    {resumeInfo.personalDetails.email}
                  </a>
                </span>
              </div>
              {/* Phone */}
              <div className="my-[1pt] text-[10pt] leading-[1.1]">
                <span className="inline-block w-[14px] align-middle">
                  <Phone size={10} />
                </span>
                <span className="inline-block align-middle ml-[4px]">
                  <a href={`tel:${resumeInfo.personalDetails.phone}`} className="no-underline text-black">
                    {resumeInfo.personalDetails.phone}
                  </a>
                </span>
              </div>
            </div>
          </div>
        </header>
      )}

      {/* Professional Summary */}
      {resumeInfo?.summery && (
        <section className="mb-[10pt]">
          <h2 className="text-[12pt] font-bold pb-[4pt] mb-[6pt] text-left [font-variant:small-caps] border-b border-black">
            Professional Summary
          </h2>
          <p className="text-[10pt] text-left">{resumeInfo.summery}</p>
        </section>
      )}

      {/* Professional Experience */}
      {resumeInfo?.Experience && resumeInfo.Experience.length > 0 && (
        <section className="mb-[10pt]">
          <h2 className="text-[12pt] font-bold pb-[4pt] mb-[6pt] text-left [font-variant:small-caps] border-b border-black">
            Professional Experience
          </h2>
          {resumeInfo.Experience.map((exp, index) => (
            <div key={index} className="mb-[6pt]">
              <div className="flex justify-between text-[10pt] mb-[1pt]">
                <span className="font-bold">{exp.companyName}</span>
                <span className="italic">
                  {exp.city}, {exp.state}
                </span>
              </div>
              <div className="flex justify-between text-[10pt] mb-[1pt] italic">
                <span>{exp.title}</span>
                <span>
                  {exp.startDate} - {exp.currentlyWorking ? 'Present' : exp.endDate}
                </span>
              </div>
              <div className="text-[10pt]" dangerouslySetInnerHTML={{ __html: exp.workSummery }} />
            </div>
          ))}
        </section>
      )}

      {/* Projects */}
      {resumeInfo?.projects && resumeInfo.projects.length > 0 && (
        <section className="mb-[10pt]">
          <h2 className="text-[12pt] font-bold pb-[4pt] mb-[6pt] text-left [font-variant:small-caps] border-b border-black">
            Projects
          </h2>
          {resumeInfo.projects.map((proj, index) => (
            <div key={index} className="mb-[6pt]">
              <div className="flex justify-between text-[10pt] mb-[1pt]">
                <span className="font-bold">{proj.name} | {proj.technologies}</span>
                {proj.link && (
                  <a
                    href={proj.link}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center text-[10pt] italic no-underline text-black"
                  >
                    <ExternalLink size={10} className="mr-[4px] align-middle" />
                    view
                  </a>
                )}
              </div>
              <div className="text-[10pt]">{proj.description}</div>
            </div>
          ))}
        </section>
      )}

      {/* Education */}
      {resumeInfo?.education && resumeInfo.education.length > 0 && (
        <section className="mb-[10pt]">
          <h2 className="text-[12pt] font-bold pb-[4pt] mb-[6pt] text-left [font-variant:small-caps] border-b border-black">
            Education
          </h2>
          {resumeInfo.education.map((edu, index) => (
            <div key={index} className="mb-[6pt]">
              <div className="flex justify-between text-[10pt] font-bold mb-[1pt]">
                <span>{edu.universityName}</span>
                <span className="italic">{edu.location || ''}</span>
              </div>
              <div className="flex justify-between text-[10pt] italic mb-[1pt]">
                <span>
                  {edu.degree} in {edu.major} | {edu.description}{edu.cgpa ? `; CGPA: ${edu.cgpa}` : ''}
                </span>
                <span>
                  {edu.startDate} - {edu.endDate}
                </span>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Skills */}
      {resumeInfo?.skills && resumeInfo.skills.length > 0 && (
        <section className="mb-[10pt]">
          <h2 className="text-[12pt] font-bold pb-[4pt] mb-[6pt] text-left [font-variant:small-caps] border-b border-black">
            Skills
          </h2>
          {resumeInfo.skills.map((skill, index) => (
            <div key={index} className="flex items-center mb-[2pt]">
              <span className="text-[10pt] font-bold flex-1">{skill.name}</span>
              <div className="w-[80px] h-[4px] bg-[#ccc] ml-[6pt] rounded-[2px]">
                <div
                  className="h-full bg-black rounded-[2px] transition-all duration-300"
                  style={{ width: `${skill.rating * 20}%` }}
                />
              </div>
            </div>
          ))}
        </section>
      )}
    </div>
  );
};

export default ProfessionalTemplate;