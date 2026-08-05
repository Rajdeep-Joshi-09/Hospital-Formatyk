import { useState, useEffect  } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import api from '../utils/api';

const ProtectedLayout = () => {
  const token = localStorage.getItem('accessToken');
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [menus, setMenus] = useState([]);
  const [loadingMenus, setLoadingMenus] = useState(true);

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const response = await api.get('/menus/my-menus');
        if (response.data?.status) {
          setMenus(response.data.result);
        }
      } catch (error) {
        console.error('Failed to fetch menus for layout:', error);
      } finally {
        setLoadingMenus(false);
      }
    };
    if (token) {
      fetchMenus();
    } else {
      setLoadingMenus(false);
    }
  }, [token]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const isAllowedPath = () => {
    if (loadingMenus) return true; // Wait for menus to load
    const currentPath = location.pathname;
    
    // Always allow the base admin dashboard
    if (currentPath === '/admin' || currentPath === '/admin/') return true;

    // Check if path matches any permitted menu
    return menus.some(menu => {
      if (!menu.listPageRoute) return false;
      if (currentPath === menu.listPageRoute) return true;
      if (currentPath.startsWith(menu.listPageRoute + '/')) return true;
      
      if (menu.formPageRoute) {
        if (currentPath === menu.formPageRoute) return true;
        if (currentPath.startsWith(menu.formPageRoute + '/')) return true;
      }
      return false;
    });
  };

  return (
    <div className="flex h-screen bg-background font-body-md text-on-surface overflow-hidden">
      
      {/* Sidebar Component */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} menus={menus} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Header Component */}
        <Header toggleSidebar={toggleSidebar} menus={menus} />

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-surface p-md lg:p-xl relative">
          
          {/* Subtle Background Elements (matching theme) */}
          <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
            <div className="absolute -top-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-surface-container-high/30 blur-3xl opacity-50 mix-blend-multiply"></div>
          </div>
          
          <div className="relative z-10 w-full h-full max-w-7xl mx-auto">
            {!loadingMenus && !isAllowedPath() ? (
              <div className="flex flex-col items-center justify-center h-full text-center mt-32">
                <div className="w-24 h-24 mb-6 rounded-full bg-error/10 flex items-center justify-center">
                  <span className="text-error text-5xl">🚫</span>
                </div>
                <h2 className="font-headline-lg text-headline-lg text-on-surface mb-2">Unauthorized Access</h2>
                <p className="font-body-lg text-body-lg text-on-surface-variant w-full mt-4">
                  You don't have permission to view this page. <br /> If you believe this is an error, please contact your administrator.
                </p>
              </div>
            ) : (
              <Outlet />
            )}
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
