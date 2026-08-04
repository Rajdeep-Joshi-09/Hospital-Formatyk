import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/login', {
        email,
        password,
      });

      if (response.data.status && response.data.result.accessToken) {
        localStorage.setItem('accessToken', response.data.result.accessToken);
        localStorage.setItem('user', JSON.stringify(response.data.result.user));
        navigate('/admin');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background min-h-screen flex flex-col font-body-md text-on-surface">
      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center p-md lg:p-xl relative overflow-hidden">
        {/* Subtle Background Elements */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute -top-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-surface-container-high/30 blur-3xl opacity-50 mix-blend-multiply"></div>
          <div className="absolute -bottom-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-surface-container/30 blur-3xl opacity-50 mix-blend-multiply"></div>
        </div>

        <div className="w-full max-w-[480px] z-10">
          <div className="glass-card rounded-[24px] p-[32px] md:p-xxl flex flex-col items-center">
            {/* Branding */}
            <div className="mb-lg">
              <span className="font-headline-sm text-headline-sm font-bold text-primary">LuxCare</span>
            </div>

            {/* Headings */}
            <div className="text-center mb-xl w-full">
              <h1 className="font-headline-md text-headline-md text-on-surface mb-sm">Welcome to LuxCare</h1>
              <p className="font-body-md text-body-md text-on-surface-variant">Secure access to your personal healthcare portal.</p>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="w-full flex flex-col gap-lg">
              {error && (
                <div className="bg-error-container text-on-error-container p-3 rounded-lg text-sm mb-2 text-center">
                  {error}
                </div>
              )}

              {/* Email Field */}
              <div className="relative w-full">
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder=" "
                  required
                  autoComplete="off"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="floating-input peer w-full bg-surface-container-lowest border border-[#E7E7E7] rounded-lg px-md pt-lg pb-sm text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                />
                <label htmlFor="email" className="absolute text-on-surface-variant left-md top-1/2 -translate-y-1/2 transition-all duration-200 pointer-events-none origin-left text-body-md font-body-md">
                  Email Address
                </label>
              </div>

              {/* Password Field */}
              <div className="relative w-full">
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder=" "
                  required
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="floating-input peer w-full bg-surface-container-lowest border border-[#E7E7E7] rounded-lg px-md pt-lg pb-sm text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                />
                <label htmlFor="password" className="absolute text-on-surface-variant left-md top-1/2 -translate-y-1/2 transition-all duration-200 pointer-events-none origin-left text-body-md font-body-md">
                  Password
                </label>
              </div>

              {/* Forgot Password Link */}
              <div className="flex justify-end w-full mt-[-8px]">
                <a href="#" className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors">
                  Forgot Password?
                </a>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#D74A49] text-on-primary font-label-md text-label-md py-md rounded-[12px] mt-sm hover:bg-primary-container transition-colors duration-300 shadow-sm flex justify-center items-center gap-sm group disabled:opacity-50"
              >
                {loading ? 'Signing In...' : 'Sign In'}
                <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </button>
            </form>

            {/* Footer Link */}
            <div className="mt-xl text-center w-full">
              <p className="font-body-md text-body-md text-on-surface-variant">
                Don't have an account? <a href="#" className="text-primary hover:text-primary-container font-semibold transition-colors">Join LuxCare</a>
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-inverse-surface w-full mt-auto">
        <div className="flex flex-col md:flex-row justify-between items-center px-lg py-xl max-w-7xl mx-auto">
          <div className="font-headline-sm text-headline-sm text-surface-bright mb-md md:mb-0">
            LuxCare
          </div>
          <div className="flex flex-wrap justify-center gap-lg mb-md md:mb-0">
            <a href="#" className="font-body-md text-body-md font-caption text-caption text-outline-variant hover:text-surface-bright transition-colors">Privacy Policy</a>
            <a href="#" className="font-body-md text-body-md font-caption text-caption text-outline-variant hover:text-surface-bright transition-colors">Terms of Service</a>
            <a href="#" className="font-body-md text-body-md font-caption text-caption text-outline-variant hover:text-surface-bright transition-colors">Accessibility</a>
            <a href="#" className="font-body-md text-body-md font-caption text-caption text-outline-variant hover:text-surface-bright transition-colors">Cookie Policy</a>
          </div>
          <div className="font-body-md text-body-md font-caption text-caption text-outline-variant">
            © 2024 LuxCare Healthcare. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Login;
