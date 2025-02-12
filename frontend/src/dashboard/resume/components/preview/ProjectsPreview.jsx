import React from 'react';
import { ExternalLink } from 'lucide-react';

function ProjectsPreview({ resumeInfo }) {
  if (!resumeInfo?.projects?.length) return null;

  return (
    <div className='my-6'>
        <h2 className='text-center font-bold text-sm mb-2'
            style={{
                color: resumeInfo?.themeColor
            }}>
            Projects
        </h2>
        <hr style={{
            borderColor: resumeInfo?.themeColor
        }} />

        {resumeInfo?.projects?.map((project, index) => (
            <div key={index} className='my-5'>
                <div className='flex justify-between items-start'>
                    <h2 className='text-sm font-bold'
                        style={{
                            color: resumeInfo?.themeColor
                        }}>
                        {project?.name}
                    </h2>
                    {project?.link && (
                        <a 
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className='text-xs flex items-center gap-1 text-gray-600 hover:text-gray-900'
                        >
                            <ExternalLink size={12} />
                            View Project
                        </a>
                    )}
                </div>
                
                <h2 className='text-xs text-gray-600'>
                    {project?.technologies}
                </h2>
                
                <div 
                    className='text-xs my-2' 
                    dangerouslySetInnerHTML={{ __html: project?.description }} 
                />
            </div>
        ))}
    </div>
  );
}

export default ProjectsPreview;