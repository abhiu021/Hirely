import React, { useState } from 'react'
import PersonalDetail from './forms/PersonalDetail'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight, Home, LayoutGrid } from 'lucide-react'
import Summery from './forms/Summery';
import Experience from './forms/Experience';
import Education from './forms/Education';
import Skills from './forms/Skills';
import { Link, Navigate, useParams } from 'react-router-dom';
import ThemeColor from './ThemeColor';
import Projects from './forms/Projects';

function FormSection() {
  const [activeFormIndex,setActiveFormIndex]=useState(1);
  const [enableNext,setEnableNext]=useState(true);
  const {resumeId}=useParams();
  return (
    <div className="p-2 sm:p-4">
        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-4 sm:mb-0'>
          <div className='flex gap-2 sm:gap-5 w-full sm:w-auto'>
            <Link to={"/dashboard"}>
              <Button size="sm" className="w-full"><Home className="mr-1 h-4 w-4"/><span className="hidden sm:inline">Dashboard</span></Button>
            </Link>
            <ThemeColor/>
          </div>
          <div className='flex gap-2 w-full sm:w-auto'>
            {activeFormIndex>1
            && <Button size="sm" 
            onClick={()=>setActiveFormIndex(activeFormIndex-1)}
            className="w-full sm:w-auto"
            > <ArrowLeft className="mr-1 h-4 w-4"/> <span className="hidden sm:inline">Previous</span> </Button> }
            <Button 
            disabled={!enableNext}
            className="flex gap-1 w-full sm:w-auto" size="sm"
            onClick={()=>setActiveFormIndex(activeFormIndex + 1)}
            > <span>Next</span> 
            <ArrowRight className="h-4 w-4"/> </Button>
          </div>
        </div>
        {/* Personal Detail  */}
        {activeFormIndex==1?  
        <PersonalDetail enabledNext={(v)=>setEnableNext(v)} />
         :activeFormIndex==2?
              <Summery  enabledNext={(v)=>setEnableNext(v)} />
        :activeFormIndex==3?
          <Experience />  
          :activeFormIndex==4?
          <Education/>
          :activeFormIndex==5?
          <Projects/>
          :activeFormIndex==6?
          <Skills/>
          :activeFormIndex==7?
          <Navigate to={'/my-resume/'+resumeId+"/view"}/>
              
        :null
          } 
    </div>
  )
}

export default FormSection