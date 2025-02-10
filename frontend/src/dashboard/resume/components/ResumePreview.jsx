import React, { useContext } from 'react';
import { ResumeInfoContext } from '@/context/ResumeInfoContext';
import PersonalDetailPreview from './preview/PersonalDetailPreview';
import SummeryPreview from './preview/SummeryPreview';
import ExperiencePreview from './preview/ExperiencePreview';
import EducationalPreview from './preview/EducationalPreview';
import SkillsPreview from './preview/SkillsPreview';
import MinimalATSTemplate from './templates/MinimalATSTemplate';
import ProfessionalTemplate from './templates/ProfessionalTemplate';

function ResumePreview({ template = 'modern' }) {
    const { resumeInfo } = useContext(ResumeInfoContext);

    const renderTemplate = () => {
        switch(template) {
            case 'modern':
                return (
                    <>
                        <PersonalDetailPreview resumeInfo={resumeInfo} />
                        <SummeryPreview resumeInfo={resumeInfo} />
                        {resumeInfo?.Experience?.length > 0 && <ExperiencePreview resumeInfo={resumeInfo} />}
                        {resumeInfo?.education?.length > 0 && <EducationalPreview resumeInfo={resumeInfo} />}
                        {resumeInfo?.skills?.length > 0 && <SkillsPreview resumeInfo={resumeInfo} />}
                    </>
                );
            case 'minimal':
                return <MinimalATSTemplate resumeInfo={resumeInfo} />;
            case 'professional':
                return <ProfessionalTemplate resumeInfo={resumeInfo} />;
            default:
                return null;
        }
    };

    return (
        <div className='shadow-lg h-full p-14 border-t-[20px]'
            style={{ borderColor: resumeInfo?.themeColor }}
        >
            {renderTemplate()}
        </div>
    );
}

export default ResumePreview;