import React from 'react';

const ProfessionalTemplate = ({ resumeInfo }) => {
  return (
    <div className="max-w-[850px] mx-auto bg-white p-8 font-['Arial']">
      {/* Header Section */}
      <header className="mb-8 pb-4 border-b-2" style={{ borderColor: resumeInfo?.themeColor }}>
        <h1 className="text-3xl font-bold mb-2" style={{ color: resumeInfo?.themeColor }}>
          {resumeInfo?.firstName} {resumeInfo?.lastName}
        </h1>
        <h2 className="text-xl mb-4">{resumeInfo?.jobTitle}</h2>
        <div className="text-base space-y-1">
          <p>{resumeInfo?.email} | {resumeInfo?.phone}</p>
          <p>{resumeInfo?.address}</p>
        </div>
      </header>

      {/* Professional Summary */}
      {resumeInfo?.summery && (
        <section className="mb-8 pb-4 border-b" style={{ borderColor: resumeInfo?.themeColor }}>
          <h2 className="text-xl font-bold mb-3 uppercase tracking-wider" style={{ color: resumeInfo?.themeColor }}>
            Professional Summary
          </h2>
          <p className="text-base leading-relaxed">{resumeInfo.summery}</p>
        </section>
      )}

      {/* Work Experience */}
      {resumeInfo?.Experience?.length > 0 && (
        <section className="mb-8 pb-4 border-b" style={{ borderColor: resumeInfo?.themeColor }}>
          <h2 className="text-xl font-bold mb-4 uppercase tracking-wider" style={{ color: resumeInfo?.themeColor }}>
            Professional Experience
          </h2>
          {resumeInfo.Experience.map((exp, index) => (
            <div key={index} className="mb-6 last:mb-0">
              <div className="flex justify-between items-baseline mb-2">
                <h3 className="text-lg font-bold">{exp.title}</h3>
                <span className="text-sm">
                  {exp.startDate} - {exp.currentlyWorking ? 'Present' : exp.endDate}
                </span>
              </div>
              <p className="text-base font-semibold mb-2">
                {exp.companyName}, {exp.city}, {exp.state}
              </p>
              <div className="text-base text-gray-700" 
                dangerouslySetInnerHTML={{ __html: exp.workSummery }} />
            </div>
          ))}
        </section>
      )}

      {/* Skills Section */}
      {resumeInfo?.skills?.length > 0 && (
        <section className="mb-8 pb-4 border-b" style={{ borderColor: resumeInfo?.themeColor }}>
          <h2 className="text-xl font-bold mb-4 uppercase tracking-wider" style={{ color: resumeInfo?.themeColor }}>
            Technical Skills
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {resumeInfo.skills.map((skill, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-base font-medium">{skill.name}</span>
                <div className="w-32 bg-gray-200 h-2 rounded-full">
                  <div className="h-full rounded-full transition-all duration-300"
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

      {/* Education Section */}
      {resumeInfo?.education?.length > 0 && (
        <section className="mb-8 pb-4 border-b" style={{ borderColor: resumeInfo?.themeColor }}>
          <h2 className="text-xl font-bold mb-4 uppercase tracking-wider" style={{ color: resumeInfo?.themeColor }}>
            Education
          </h2>
          {resumeInfo.education.map((edu, index) => (
            <div key={index} className="mb-4 last:mb-0">
              <div className="flex justify-between items-baseline mb-1">
                <h3 className="text-lg font-bold">
                  {edu.degree} {edu.major && `in ${edu.major}`}
                </h3>
                <span className="text-sm">{edu.startDate} - {edu.endDate}</span>
              </div>
              <p className="text-base font-medium">{edu.universityName}</p>
              {edu.description && (
                <p className="text-sm text-gray-700 mt-1">{edu.description}</p>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Projects & Achievements */}
      {(resumeInfo?.projects?.length > 0 || resumeInfo?.achievements?.length > 0) && (
        <section>
          <h2 className="text-xl font-bold mb-4 uppercase tracking-wider" style={{ color: resumeInfo?.themeColor }}>
            Projects & Achievements
          </h2>
          {resumeInfo?.projects?.map((project, index) => (
            <div key={index} className="mb-4">
              <h3 className="text-lg font-bold">{project.name}</h3>
              <p className="text-base mb-1">{project.description}</p>
              {project.link && (
                <a 
                  href={project.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  View Project
                </a>
              )}
            </div>
          ))}
          {resumeInfo?.achievements?.length > 0 && (
            <ul className="list-disc ml-5 text-base space-y-1">
              {resumeInfo.achievements.map((achievement, index) => (
                <li key={index}>{achievement}</li>
              ))}
            </ul>
          )}
        </section>
      )}
    </div>
  );
};

export default ProfessionalTemplate;
