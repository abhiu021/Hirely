import React from 'react';

const MinimalATSTemplate = ({ resumeInfo }) => {
  return (
    <div className="p-8 max-w-[850px] mx-auto bg-white font-sans leading-relaxed">
      {/* Header */}
      <header className="mb-6 border-b-2 pb-4" style={{ borderColor: resumeInfo?.themeColor }}>
        <h1 className="text-2xl font-bold mb-1" style={{ color: resumeInfo?.themeColor }}>
          {resumeInfo?.firstName} {resumeInfo?.lastName}
        </h1>
        <p className="text-lg mb-2">{resumeInfo?.jobTitle}</p>
        <div className="text-sm space-y-1" style={{ color: resumeInfo?.themeColor }}>
          <p>{resumeInfo?.address}</p>
          <p>{resumeInfo?.phone} • {resumeInfo?.email}</p>
        </div>
      </header>

      {/* Summary */}
      {resumeInfo?.summery && (
        <section className="mb-6">
          <h2 className="text-lg font-bold mb-2 uppercase tracking-wider" 
              style={{ color: resumeInfo?.themeColor }}>
            Summary
          </h2>
          <p className="text-sm leading-relaxed">{resumeInfo.summery}</p>
        </section>
      )}

      {/* Experience */}
      {resumeInfo?.Experience?.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-bold mb-3 uppercase tracking-wider" 
              style={{ color: resumeInfo?.themeColor }}>
            Experience
          </h2>
          {resumeInfo.Experience.map((experience, index) => (
            <div key={index} className="mb-4 pb-4 border-b last:border-b-0">
              <div className="flex justify-between">
                <h3 className="font-bold text-base" style={{ color: resumeInfo?.themeColor }}>
                  {experience.title}
                </h3>
                <span className="text-sm">{experience.startDate} - {experience.currentlyWorking ? 'Present' : experience.endDate}</span>
              </div>
              <p className="text-sm font-semibold">{experience.companyName}, {experience.city}, {experience.state}</p>
              <div className="text-sm mt-1" dangerouslySetInnerHTML={{ __html: experience.workSummery }} />
            </div>
          ))}
        </section>
      )}

      {/* Education */}
      {resumeInfo?.education?.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-bold mb-3 uppercase tracking-wider" 
              style={{ color: resumeInfo?.themeColor }}>
            Education
          </h2>
          {resumeInfo.education.map((edu, index) => (
            <div key={index} className="mb-3">
              <div className="flex justify-between">
                <h3 className="font-bold text-base" style={{ color: resumeInfo?.themeColor }}>
                  {edu.degree} in {edu.major}
                </h3>
                <span className="text-sm">{edu.startDate} - {edu.endDate}</span>
              </div>
              <p className="text-sm font-semibold">{edu.universityName}</p>
            </div>
          ))}
        </section>
      )}

      {/* Skills */}
      {resumeInfo?.skills?.length > 0 && (
        <section>
          <h2 className="text-lg font-bold mb-3 uppercase tracking-wider" 
              style={{ color: resumeInfo?.themeColor }}>
            Skills
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {resumeInfo.skills.map((skill, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm font-medium" style={{ color: resumeInfo?.themeColor }}>
                  {skill.name}
                </span>
                <div className="w-24 bg-gray-200 h-1.5 ml-2">
                  <div className="h-full"
                    style={{
                      width: `${skill.rating * 20}%`,
                      backgroundColor: resumeInfo?.themeColor
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default MinimalATSTemplate;