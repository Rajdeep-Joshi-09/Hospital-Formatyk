import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import api from '../utils/api';

const UserForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    userType: 1,
    isStatus: 1
  });
  const [userTypes, setUserTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Fetch user types for dropdown
        const utResponse = await api.get('/user-types');
        if (utResponse.data.status) {
          setUserTypes(utResponse.data.result);
          // Set default user type if not in edit mode
          if (!isEditMode && utResponse.data.result.length > 0) {
             setFormData(prev => ({...prev, userType: utResponse.data.result[0].id}));
          }
        }

        if (isEditMode) {
          const response = await api.get(`/users/${id}`);
          if (response.data.status) {
            const user = response.data.result;
            setFormData({
              name: user.name,
              email: user.email,
              phone: user.phone,
              password: '', // Don't populate password
              userType: user.userType,
              isStatus: user.isStatus
            });
          }
        }
      } catch (err) {
        setError('Failed to load required data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchInitialData();
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'userType' || name === 'isStatus' ? parseInt(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      // If editing and password is empty, remove it from payload
      const payload = { ...formData };
      if (isEditMode && !payload.password) {
        delete payload.password;
      }

      if (isEditMode) {
        await api.put(`/users/${id}`, payload);
      } else {
        await api.post('/users', payload);
      }
      navigate('/admin/users');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-xl text-center font-body-md">Loading...</div>;

  return (
    <div className="w-full max-w-4xl mx-auto pb-xl">
      <div className="flex items-center gap-md mb-lg">
        <Link to="/admin/users" className="p-xs bg-surface-container rounded-full hover:bg-[#e0bfbc] transition-colors text-on-surface">
          <ArrowLeft size={20} />
        </Link>
        <h2 className="font-headline-md text-headline-md text-on-surface">
          {isEditMode ? 'Edit User' : 'Create New User'}
        </h2>
      </div>

      <div className="glass-card p-xl rounded-[24px]">
        {error && (
          <div className="mb-lg p-md bg-error-container text-on-error-container rounded-lg font-body-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
            
            {/* Name */}
            <div className="relative w-full">
              <input
                id="name"
                name="name"
                type="text"
                placeholder=" "
                required
                value={formData.name}
                onChange={handleChange}
                className="floating-input peer w-full bg-surface-container-lowest border border-[#E7E7E7] rounded-lg px-md pt-lg pb-sm text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              />
              <label htmlFor="name" className="absolute text-on-surface-variant left-md top-1/2 -translate-y-1/2 transition-all duration-200 pointer-events-none origin-left text-body-md font-body-md">
                Full Name
              </label>
            </div>

            {/* Email */}
            <div className="relative w-full">
              <input
                id="email"
                name="email"
                type="email"
                placeholder=" "
                required
                value={formData.email}
                onChange={handleChange}
                className="floating-input peer w-full bg-surface-container-lowest border border-[#E7E7E7] rounded-lg px-md pt-lg pb-sm text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              />
              <label htmlFor="email" className="absolute text-on-surface-variant left-md top-1/2 -translate-y-1/2 transition-all duration-200 pointer-events-none origin-left text-body-md font-body-md">
                Email Address
              </label>
            </div>

            {/* Phone */}
            <div className="relative w-full">
              <input
                id="phone"
                name="phone"
                type="text"
                placeholder=" "
                required
                value={formData.phone}
                onChange={handleChange}
                className="floating-input peer w-full bg-surface-container-lowest border border-[#E7E7E7] rounded-lg px-md pt-lg pb-sm text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              />
              <label htmlFor="phone" className="absolute text-on-surface-variant left-md top-1/2 -translate-y-1/2 transition-all duration-200 pointer-events-none origin-left text-body-md font-body-md">
                Phone Number
              </label>
            </div>

            {/* Password */}
            <div className="relative w-full">
              <input
                id="password"
                name="password"
                type="password"
                placeholder=" "
                autoComplete="new-password"
                required={!isEditMode}
                value={formData.password}
                onChange={handleChange}
                className="floating-input peer w-full bg-surface-container-lowest border border-[#E7E7E7] rounded-lg px-md pt-lg pb-sm text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              />
              <label htmlFor="password" className="absolute text-on-surface-variant left-md top-1/2 -translate-y-1/2 transition-all duration-200 pointer-events-none origin-left text-body-md font-body-md">
                {isEditMode ? 'New Password (leave blank to keep current)' : 'Password'}
              </label>
            </div>

            {/* User Type */}
            <div className="relative w-full">
              <select
                id="userType"
                name="userType"
                value={formData.userType}
                onChange={handleChange}
                className="peer w-full bg-surface-container-lowest border border-[#E7E7E7] rounded-lg px-md pt-lg pb-sm text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary appearance-none cursor-pointer h-[58px]"
              >
                {userTypes.map(ut => (
                  <option key={ut.id} value={ut.id}>
                    {ut.userType}
                  </option>
                ))}
              </select>
              <label htmlFor="userType" className="absolute left-md top-[10px] text-label-md text-on-surface-variant scale-85 transition-all duration-200 pointer-events-none origin-left font-body-md peer-focus:text-primary whitespace-nowrap">
                Role
              </label>
              <div className="absolute right-md top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
              </div>
            </div>

            <div className="relative w-full">
              <select
                id="isStatus"
                name="isStatus"
                value={formData.isStatus}
                onChange={handleChange}
                className="peer w-full bg-surface-container-lowest border border-[#E7E7E7] rounded-lg px-md pt-lg pb-sm text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary appearance-none cursor-pointer h-[58px]"
              >
                <option value={1}>Active</option>
                <option value={0}>Inactive</option>
              </select>
              <label htmlFor="isStatus" className="absolute left-md top-[10px] text-label-md text-on-surface-variant scale-85 transition-all duration-200 pointer-events-none origin-left font-body-md peer-focus:text-primary whitespace-nowrap">
                Status
              </label>
              <div className="absolute right-md top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
              </div>
            </div>

          </div>

          <div className="flex justify-end border-t border-[#E7E7E7] pt-lg mt-xl">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center justify-center gap-sm bg-primary text-on-primary hover:bg-primary-container px-xl py-sm rounded-lg font-label-md transition-colors shadow-sm disabled:opacity-50"
            >
              <Save size={18} />
              {saving ? 'Saving...' : 'Save User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserForm;
