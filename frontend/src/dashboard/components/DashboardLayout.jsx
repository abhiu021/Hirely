import React from 'react';
import DashboardHeader from './DashboardHeader';
import Footer from '@/components/custom/Footer';
import { Toaster } from 'sonner';

const DashboardLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
      <Toaster position="top-center" />
    </div>
  );
};

export default DashboardLayout; 