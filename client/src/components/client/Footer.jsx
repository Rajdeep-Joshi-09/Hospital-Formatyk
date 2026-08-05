import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[#3c2d2c] w-full py-12">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand */}
        <div className="space-y-4">
          <div className="font-['Playfair_Display'] text-[24px] font-bold tracking-tight text-[#ffdad7]">
            LuxCare
          </div>
          <p className="text-[#f6dddb]/80 font-['Inter'] text-[16px]">
            Redefining excellence in medical care through technology and compassion.
          </p>
        </div>

        {/* Clinic Links */}
        <div className="space-y-4">
          <h4 className="text-[#ffdad7] font-bold font-['Inter'] text-[16px]">Clinic</h4>
          <ul className="space-y-2">
            <li>
              <Link to="/specialities" className="text-[#f6dddb]/80 hover:text-white transition-colors block py-1 font-['Inter'] text-[16px] hover:translate-x-1 duration-200">
                Specialities
              </Link>
            </li>
            <li>
              <Link to="/experts" className="text-[#f6dddb]/80 hover:text-white transition-colors block py-1 font-['Inter'] text-[16px] hover:translate-x-1 duration-200">
                Expertise
              </Link>
            </li>
            <li>
              <Link to="/about" className="text-[#f6dddb]/80 hover:text-white transition-colors block py-1 font-['Inter'] text-[16px] hover:translate-x-1 duration-200">
                About Us
              </Link>
            </li>
          </ul>
        </div>

        {/* Support Links */}
        <div className="space-y-4">
          <h4 className="text-[#ffdad7] font-bold font-['Inter'] text-[16px]">Support</h4>
          <ul className="space-y-2">
            <li>
              <Link to="/contact" className="text-[#f6dddb]/80 hover:text-white transition-colors block py-1 font-['Inter'] text-[16px] hover:translate-x-1 duration-200">
                Contact Info
              </Link>
            </li>
            <li>
              <a href="#" className="text-[#f6dddb]/80 hover:text-white transition-colors block py-1 font-['Inter'] text-[16px] hover:translate-x-1 duration-200">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="text-[#f6dddb]/80 hover:text-white transition-colors block py-1 font-['Inter'] text-[16px] hover:translate-x-1 duration-200">
                Terms of Service
              </a>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div className="space-y-4">
          <h4 className="text-[#ffdad7] font-bold font-['Inter'] text-[16px]">Newsletter</h4>
          <div className="flex bg-white/5 rounded-xl p-1 border border-white/10 focus-within:border-[#ac2b2e] transition-colors mb-4">
            <input
              className="bg-transparent border-none focus:ring-0 text-white px-4 w-full text-sm font-['Inter']"
              placeholder="Your email"
              type="email"
            />
            <button className="bg-[#ac2b2e] text-white p-2 rounded-lg hover:opacity-90 transition-opacity">
              <span className="material-symbols-outlined text-sm">send</span>
            </button>
          </div>
          <div className="flex items-center gap-2 text-[#f6dddb]/80">
            <span className="material-symbols-outlined text-lg">public</span>
            <span className="text-sm font-['Inter']">Global Location</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-8 pt-6 border-t border-white/10 text-center">
        <p className="text-[#f6dddb]/60 font-['Inter'] text-sm">
          © {new Date().getFullYear()} LuxCare Hospital. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
