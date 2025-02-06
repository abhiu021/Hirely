import React from 'react';

const ProfessionalTemplate = ({ resumeInfo }) => {
  return (
    <div className="p-8 max-w-[850px] mx-auto bg-white font-sans leading-relaxed">
      {/* Header Section */}
      <header className="mb-8 border-b-2 pb-6" style={{ borderColor: resumeInfo?.themeColor }}>
        <h1 className="text-4xl font-bold mb-3" style={{ color: resumeInfo?.themeColor }}>
          {resumeInfo?.firstName} {resumeInfo?.lastName}
        </h1>
        <p className="text-2xl mb-4">{resumeInfo?.jobTitle}</p>
        <div className="text-lg space-y-2" style={{ color: resumeInfo?.themeColor }}>
          <p>{resumeInfo?.phone} | {resumeInfo?.email}</p>
          <p>{resumeInfo?.address}</p>
        </div>
      </header>

      {/* Summary Section */}
      {resumeInfo?.summery && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 uppercase tracking-wider" 
              style={{ color: resumeInfo?.themeColor }}>
            Professional Summary
          </h2>
          <p className="text-lg leading-relaxed">{resumeInfo?.summery}</p>
        </section>
      )}

      {/* Experience Section */}
      {resumeInfo?.Experience?.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 uppercase tracking-wider" 
              style={{ color: resumeInfo?.themeColor }}>
            Professional Experience
          </h2>
          {resumeInfo.Experience.map((experience, index) => (
            <div key={index} className="mb-6 pb-6 border-b last:border-b-0" 
                 style={{ borderColor: resumeInfo?.themeColor }}>
              <div className="flex justify-between items-baseline">
                <h3 className="text-xl font-bold" style={{ color: resumeInfo?.themeColor }}>
                  {experience?.title}
                </h3>
                <span className="text-base">
                  {experience?.startDate} - {experience?.currentlyWorking ? 'Present' : experience.endDate}
                </span>
              </div>
              <p className="text-lg font-semibold mt-1" style={{ color: resumeInfo?.themeColor }}>
                {experience?.companyName}, {experience?.city}, {experience?.state}
              </p>
              <div className="text-base mt-3" 
                   dangerouslySetInnerHTML={{ __html: experience?.workSummery }} />
            </div>
          ))}
        </section>
      )}

      {/* Education Section */}
      {resumeInfo?.education?.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 uppercase tracking-wider" 
              style={{ color: resumeInfo?.themeColor }}>
            Education
          </h2>
          {resumeInfo.education.map((edu, index) => (
            <div key={index} className="mb-6 last:mb-0">
              <div className="flex justify-between items-baseline">
                <h3 className="text-xl font-bold" style={{ color: resumeInfo?.themeColor }}>
                  {edu.degree} {edu.major && `in ${edu.major}`}
                </h3>
                <span className="text-base">{edu.startDate} - {edu.endDate}</span>
              </div>
              <p className="text-lg font-semibold mt-1" style={{ color: resumeInfo?.themeColor }}>
                {edu.universityName}
              </p>
              {edu.description && (
                <p className="text-base mt-2">{edu.description}</p>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Skills Section */}
      {resumeInfo?.skills?.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-4 uppercase tracking-wider" 
              style={{ color: resumeInfo?.themeColor }}>
            Technical Skills
          </h2>
          <div className="grid grid-cols-2 gap-6">
            {resumeInfo.skills.map((skill, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-lg font-medium" style={{ color: resumeInfo?.themeColor }}>
                  {skill.name}
                </span>
                <div className="w-32 bg-gray-200 h-2 rounded">
                  <div className="h-full rounded" 
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

export default ProfessionalTemplate;
