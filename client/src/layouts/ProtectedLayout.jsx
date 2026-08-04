import { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const ProtectedLayout = () => {
  const token = localStorage.getItem('accessToken');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen bg-background font-body-md text-on-surface overflow-hidden">
      
      {/* Sidebar Component */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Header Component */}
        <Header toggleSidebar={toggleSidebar} />

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-surface p-md lg:p-xl relative">
          
          {/* Subtle Background Elements (matching theme) */}
          <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
            <div className="absolute -top-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-surface-container-high/30 blur-3xl opacity-50 mix-blend-multiply"></div>
          </div>
          
          <div className="relative z-10 w-full h-full max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
        
        {/* Footer */}
        <footer className="bg-inverse-surface w-full flex justify-between items-center px-lg py-md text-surface-bright mt-auto">
           <div className="font-caption text-caption text-outline-variant">
             © 2024 LuxCare Healthcare. All rights reserved.
           </div>
           <div className="flex gap-md font-caption text-caption text-outline-variant">
             <a href="#" className="hover:text-surface-bright transition-colors">Privacy</a>
             <a href="#" className="hover:text-surface-bright transition-colors">Terms</a>
           </div>
        </footer>

      </div>
    </div>
  );
};

export default ProtectedLayout;
