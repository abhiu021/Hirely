import React, { useContext, useState } from 'react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from '@/components/ui/button'
import { LayoutGrid } from 'lucide-react'
import { ResumeInfoContext } from '@/context/ResumeInfoContext'
import GlobalApi from './../../../../service/GlobalApi'
import { useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { useAuth } from '@clerk/clerk-react';
import axios from 'axios'; // Import Axios

function ThemeColor() {
  const colors = [
    "#FF5733", "#33FF57", "#3357FF", "#FF33A1", "#A133FF",
    "#33FFA1", "#FF7133", "#71FF33", "#7133FF", "#FF3371",
    "#33FF71", "#3371FF", "#A1FF33", "#33A1FF", "#FF5733",
    "#5733FF", "#33FF5A", "#5A33FF", "#FF335A", "#335AFF"
  ]
  const params = useParams();
  const { getToken } = useAuth();
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const [selectedColor, setSelectedColor] = useState();

  const onColorSelect = async(color) => {
    setSelectedColor(color)
    setResumeInfo({
      ...resumeInfo,
      themeColor: color
    });
    const data = {
      data: {
        themeColor: color
      }
    }
    try {
      const id = params?.resumeId;
      const token = await getToken();
      const response = await axios.put(`https://hirely-78iq.onrender.com/api/dashboard/resume/${id}/edit`, data, {
          headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
          },
      });
      console.log(response);
      // enabledNext(true);
      toast("Details updated");
  } catch (error) {
      console.error('Error updating resume:', error);
      toast.error("Failed to update details");
  } finally {
      setLoading(false);
  }

    
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm"
          className="flex gap-2" > <LayoutGrid /> Theme</Button>
      </PopoverTrigger>
      <PopoverContent>
        <h2 className='mb-2 text-sm font-bold'>Select Theme Color</h2>
        <div className='grid grid-cols-5 gap-3'>
          {colors.map((item, index) => (
            <div
              onClick={() => onColorSelect(item)}
              className={`h-5 w-5 rounded-full cursor-pointer
             hover:border-black border
             ${selectedColor == item && 'border border-black'}
             `}
              style={{
                background: item
              }}>

            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default ThemeColor