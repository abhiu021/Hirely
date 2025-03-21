import { SignIn } from '@clerk/clerk-react'
import { useUser } from '@clerk/clerk-react';

import React from 'react'



function SignInPage() {
  const { user } = useUser();

  if (user) {
    console.log('SignInPage - User:', user); // Log the user object
    console.log('SignInPage - User Role:', user.publicMetadata.role); // Log the user's role
  }

  return (
    <div className='flex justify-center my-20 items-center'>
      <SignIn/>
    </div>
  )
}

export default SignInPage