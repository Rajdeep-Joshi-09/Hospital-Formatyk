import { Menu, LogOut, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../utils/api';

const Header = ({ toggleSidebar, menus = [] }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // Map pathnames to page titles dynamically using MenuMaster
  const getPageTitle = () => {
    if (location.pathname === '/admin') return 'Dashboard';
    
    // Find the menu whose listPageRoute or formPageRoute matches the current path
    // We check exact match for listPageRoute, or prefix match for formPageRoute if editing
    const currentMenu = menus.find(menu => {
      if (!menu.listPageRoute) return false;
      return location.pathname === menu.listPageRoute || location.pathname.startsWith(menu.listPageRoute + '/');
    });

    return currentMenu?.pageName || 'Admin Panel';
  };

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout failed on backend:', error);
    } finally {
      // Clear all tokens and user info regardless of backend response
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      navigate('/login', { replace: true });
    }
  };

  return (
    <header className="h-16 bg-surface-container-lowest border-b border-[#E7E7E7] flex items-center justify-between px-lg z-10 sticky top-0 shadow-sm">
      <div className="flex items-center gap-md">
        <button 
          onClick={toggleSidebar}
          className="lg:hidden text-on-surface-variant hover:text-primary transition-colors focus:outline-none"
        >
          <Menu size={24} />
        </button>
        <h1 className="font-headline-sm text-headline-sm text-on-surface m-0 hidden sm:block">
          {getPageTitle()}
        </h1>
      </div>

      <div className="flex items-center gap-lg">
        <div className="flex items-center gap-sm bg-surface-container px-sm py-xs rounded-full">
          <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-on-primary">
            <User size={16} />
          </div>
          <span className="font-label-md text-label-md text-on-surface pr-sm">
            {user?.email?.split('@')[0] || 'Admin'}
          </span>
        </div>

        <button 
          onClick={handleLogout}
          className="flex items-center gap-xs font-label-md text-label-md text-error hover:text-on-error-container hover:bg-error-container px-sm py-xs rounded-lg transition-colors"
        >
          <LogOut size={18} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
