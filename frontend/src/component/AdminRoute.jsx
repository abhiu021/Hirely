import React from 'react';
import { useUser } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';

function AdminRoute({ children }) {
  const { user } = useUser();

  console.log('User:', user);
  console.log('User Role:', user?.publicMetadata?.role);

  // Check if the user is an admin
  if (!user || user.publicMetadata.role !== 'admin') {
    return <Navigate to="/dashboard" />; // Redirect non-admins to the user dashboard
  }

  return children; // Allow admins to access the protected route
}

export default AdminRoute;