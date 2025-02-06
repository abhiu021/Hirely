import { ResumeInfoContext } from '@/context/ResumeInfoContext'
import React, { useContext } from 'react'
import PersonalDetailPreview from './preview/PersonalDetailPreview'
import SummeryPreview from './preview/SummeryPreview'
import ExperiencePreview from './preview/ExperiencePreview'
import EducationalPreview from './preview/EducationalPreview'
import SkillsPreview from './preview/SkillsPreview'
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function ResumePreview() {
    const [template , setTemplate] = useState('modern');
    const {resumeInfo,setResumeInfo}=useContext(ResumeInfoContext)

    const templates = {
        modern: 'Modern Template',
        minimal: 'Minimal ATS',
        professional: 'Professional'
    };

  return (
    <div className="relative">
      <div className="absolute top-4 right-4 z-10">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 px-4 py-2 bg-white rounded-md shadow hover:bg-gray-50">
            {templates[template]}
            <ChevronDown className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {Object.entries(templates).map(([key, value]) => (
              <DropdownMenuItem
                key={key}
                onClick={() => setTemplate(key)}
                className="cursor-pointer"
              >
                {value}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div 
        className='shadow-lg h-full p-14 border-t-[20px]'
        style={{
          borderColor: resumeInfo?.themeColor
        }}
      >
        {template === 'modern' ? (
          <>
            <PersonalDetailPreview resumeInfo={resumeInfo} />
            <SummeryPreview resumeInfo={resumeInfo} />
            {resumeInfo?.Experience?.length > 0 && <ExperiencePreview resumeInfo={resumeInfo} />}
            {resumeInfo?.education?.length > 0 && <EducationalPreview resumeInfo={resumeInfo} />}
            {resumeInfo?.skills?.length > 0 && <SkillsPreview resumeInfo={resumeInfo} />}
          </>
        ) : template === 'minimal' ? (
          <MinimalATSTemplate resumeInfo={resumeInfo} />
        ) : (
          <ProfessionalTemplate resumeInfo={resumeInfo} />
        )}
      </div>
    </div>
  )
}

export default ResumePreview