import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'Expertise', path: '/experts' },
  { label: 'Specialities', path: '/specialities' },
  { label: 'About', path: '/about' },
  { label: 'Contact', path: '/contact' },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-surface/80 glass-nav border-b border-white/20 shadow-[0px_4px_20px_rgba(0,0,0,0.04)] h-20 transition-all duration-300">
      <nav className="max-w-7xl mx-auto px-6 lg:px-[24px] flex items-center justify-between h-full">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img
            alt="LuxCare Logo"
            className="h-10 w-auto"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBFqLQ7-XXbUE6hv02sun0DO4trHZUl0Esvhx66stNJUjdeQli22BfMny-54io98PG5fPvWesM7e1bSiB_ZjU5jGxZAR3xLKBWGoXxdl8yxw7RHkJ9so3NSiE0RJNx455QYQg4ikEwi9u34IAUekNvCwj5LL1T7Lu1JdQfmoi3me05fNYEH5HLr3C5geQB1o0UHuqmIf3upLQYfTa35FpYO_Ja6XX32FGEZxYoy_H2acWlc09l3DWqjdA"
          />
          <span className="font-['Playfair_Display'] text-[24px] font-semibold text-[#ac2b2e]">
            LuxCare
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`font-['Inter'] text-[14px] font-semibold tracking-[0.05em] transition-colors duration-200 ${
                isActive(link.path)
                  ? 'text-[#ac2b2e] font-bold border-b-2 border-[#ac2b2e] pb-1'
                  : 'text-[#5f5e5e] hover:text-[#ac2b2e]'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* CTA + Mobile Toggle */}
        <div className="flex items-center gap-3">
          <Link
            to="/book-appointment"
            className="hidden sm:block bg-[#ac2b2e] text-white px-6 py-3 rounded-xl font-['Inter'] text-[14px] font-semibold tracking-[0.05em] hover:opacity-80 transition-all active:scale-95"
          >
            Book Appointment
          </Link>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <span
              className={`block w-6 h-0.5 bg-[#251817] transition-all duration-300 ${
                mobileOpen ? 'rotate-45 translate-y-2' : ''
              }`}
            />
            <span
              className={`block w-6 h-0.5 bg-[#251817] transition-all duration-300 ${
                mobileOpen ? 'opacity-0' : ''
              }`}
            />
            <span
              className={`block w-6 h-0.5 bg-[#251817] transition-all duration-300 ${
                mobileOpen ? '-rotate-45 -translate-y-2' : ''
              }`}
            />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      <div
        className={`md:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-xl border-b border-[#e0bfbc] shadow-xl transition-all duration-300 overflow-hidden ${
          mobileOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="flex flex-col px-6 py-4 gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileOpen(false)}
              className={`py-3 px-4 rounded-xl font-['Inter'] text-[16px] font-medium transition-colors ${
                isActive(link.path)
                  ? 'bg-[#fce2e0] text-[#ac2b2e] font-bold'
                  : 'text-[#251817] hover:bg-[#fff0ef]'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/book-appointment"
            onClick={() => setMobileOpen(false)}
            className="mt-2 bg-[#ac2b2e] text-white text-center py-3 rounded-xl font-['Inter'] text-[14px] font-semibold tracking-[0.05em] sm:hidden"
          >
            Book Appointment
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
