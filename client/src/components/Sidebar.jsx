import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Settings, Activity } from 'lucide-react';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} /> },
    { name: 'Users', path: '/admin/users', icon: <Users size={20} /> },
    { name: 'Analytics', path: '/admin/analytics', icon: <Activity size={20} /> },
    { name: 'Settings', path: '/admin/settings', icon: <Settings size={20} /> },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-on-surface/50 z-20 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
      
      {/* Sidebar Content */}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-surface-container-lowest border-r border-[#E7E7E7] z-30 transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} lg:static lg:w-64`}>
        
        {/* Logo */}
        <div className="h-16 flex items-center px-lg border-b border-[#E7E7E7]">
          <span className="font-headline-sm text-headline-sm font-bold text-primary">LuxCare</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-md py-lg overflow-y-auto space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (location.pathname.startsWith(item.path) && item.path !== '/admin');
            return (
              <Link 
                key={item.name} 
                to={item.path}
                className={`flex items-center gap-sm px-md py-sm rounded-lg font-label-md text-label-md transition-colors ${isActive ? 'bg-primary-container text-on-primary' : 'text-on-surface-variant hover:bg-surface-container hover:text-primary'}`}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            )
          })}
        </nav>

        {/* Footer info in sidebar */}
        <div className="p-lg border-t border-[#E7E7E7]">
          <p className="text-caption text-outline-variant">LuxCare Admin Panel</p>
          <p className="text-caption text-outline-variant">v1.0.0</p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
