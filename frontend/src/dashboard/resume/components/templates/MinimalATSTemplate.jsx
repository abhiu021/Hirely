import React from 'react';

const ATSTemplate = ({ resumeInfo }) => {
  return (
    <div className="max-w-[850px] mx-auto p-8 font-sans text-gray-800 leading-relaxed bg-white">
      {/* Contact Section */}
      <header className="mb-6">
        <h1 className="text-2xl font-bold mb-1">
          {resumeInfo?.firstName} {resumeInfo?.lastName}
        </h1>
        <p className="text-lg mb-2">{resumeInfo?.jobTitle}</p>
        <div className="text-sm space-y-1">
          <p>{resumeInfo?.address}</p>
          <p>{resumeInfo?.phone}</p>
          <p>{resumeInfo?.email}</p>
        </div>
      </header>

      {/* Professional Summary */}
      {resumeInfo?.summery && (
        <section className="mb-6">
          <h2 className="text-lg font-bold mb-2 uppercase border-b border-gray-300 pb-1">
            Professional Summary
          </h2>
          <p className="text-sm">{resumeInfo?.summery}</p>
        </section>
      )}

      {/* Experience Section */}
      {resumeInfo?.Experience?.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-bold mb-2 uppercase border-b border-gray-300 pb-1">
            Work Experience
          </h2>
          {resumeInfo.Experience.map((exp, index) => (
            <div key={index} className="mb-4">
              <div className="mb-1">
                <h3 className="font-bold">{exp.title}</h3>
                <p className="text-sm">
                  {exp.companyName} | {exp.city}, {exp.state}
                </p>
                <p className="text-sm">
                  {exp.startDate} - {exp.currentlyWorking ? 'Present' : exp.endDate}
                </p>
              </div>
              <div className="text-sm pl-4">
                {exp.workSummery && (
                  <div 
                    className="list-disc"
                    dangerouslySetInnerHTML={{ 
                      __html: exp.workSummery.replace(/<p>/g, '<p class="mb-1">') 
                    }} 
                  />
                )}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Education Section */}
      {resumeInfo?.education?.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-bold mb-2 uppercase border-b border-gray-300 pb-1">
            Education
          </h2>
          {resumeInfo.education.map((edu, index) => (
            <div key={index} className="mb-2">
              <h3 className="font-bold">
                {edu.degree} {edu.major && `in ${edu.major}`}
              </h3>
              <p className="text-sm">{edu.universityName}</p>
              <p className="text-sm">{edu.startDate} - {edu.endDate}</p>
              {edu.description && (
                <p className="text-sm mt-1">{edu.description}</p>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Skills Section */}
      {resumeInfo?.skills?.length > 0 && (
        <section>
          <h2 className="text-lg font-bold mb-2 uppercase border-b border-gray-300 pb-1">
            Technical Skills
          </h2>
          <div className="text-sm">
            {resumeInfo.skills.map((skill, index) => (
              <span key={index} className="inline-block mr-4 mb-2">
                {skill.name}
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ATSTemplate;