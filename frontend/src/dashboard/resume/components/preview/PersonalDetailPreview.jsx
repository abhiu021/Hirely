import React from 'react'

function PersonalDetailPreview({resumeInfo}) {
  return (
    <div>
        <h2 className='font-bold text-xl text-center'
        style={{
            color:resumeInfo?.themeColor
        }}
        >
            {resumeInfo?.personalDetails?.firstName} {resumeInfo?.personalDetails?.lastName}</h2>
        <h2 className='text-center text-sm font-medium'
       >{resumeInfo?.personalDetails?.jobTitle}</h2>
       <h2 className='text-center font-normal text-xs'
        style={{
            color:resumeInfo?.themeColor
        }}>{resumeInfo?.personalDetails?.address}</h2>

        <div className='flex justify-between'>
            <h2 className='font-normal text-xs'
             style={{
                color:resumeInfo?.themeColor
            }}>{resumeInfo?.personalDetails?.phone}</h2>
            <h2 className='font-normal text-xs'
             style={{
                color:resumeInfo?.themeColor
            }}>{resumeInfo?.personalDetails?.email}</h2>

        </div>
        <hr className='border-[1.5px] my-2'
        style={{
            borderColor:resumeInfo?.themeColor
        }}
        />
    </div>
  )
}

export default PersonalDetailPreview