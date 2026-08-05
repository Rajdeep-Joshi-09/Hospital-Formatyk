import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import api from '../utils/api';

const DoctorForm = () => {
  const { id } = useParams();
  const isEditMode = !!id;
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    image: '',
    experties: '',
    description: '',
    yearOfExp: '',
    education: '',
    languages: '',
    isStatus: 1
  });
  
  const [expertiesList, setExpertiesList] = useState([]);
  const [languagesList, setLanguagesList] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [expRes, langRes] = await Promise.all([
          api.get('/experties'),
          api.get('/languages')
        ]);
        
        if (expRes.data.status) {
          // Only show active experties in dropdown
          setExpertiesList(expRes.data.result.filter(e => e.isStatus === 1));
        }
        if (langRes.data.status) {
          setLanguagesList(langRes.data.result.filter(l => l.isStatus === 1));
        }

        if (isEditMode) {
          const docRes = await api.get(`/doctors/${id}`);
          if (docRes.data.status) {
            const doc = docRes.data.result;
            setFormData({
              name: doc.name || '',
              image: doc.image || '',
              experties: doc.experties || '',
              description: doc.description || '',
              yearOfExp: doc.yearOfExp || '',
              education: doc.education || '',
              languages: doc.languages || '',
              isStatus: doc.isStatus ?? 1
            });
          }
        }
      } catch (err) {
        setError('Failed to load data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'isStatus' || name === 'experties' || name === 'languages' || name === 'yearOfExp') {
      setFormData(prev => ({
        ...prev,
        [name]: value ? parseInt(value) : ''
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? (checked ? 1 : 0) : value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      if (isEditMode) {
        await api.put(`/doctors/${id}`, formData);
      } else {
        await api.post('/doctors', formData);
      }
      navigate('/admin/doctors');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-xl text-center font-body-md">Loading...</div>;
  }

  return (
    <div className="w-full max-w-5xl mx-auto pb-xl">
      <div className="flex items-center gap-md mb-lg">
        <Link to="/admin/doctors" className="p-xs bg-surface-container rounded-full hover:bg-[#e0bfbc] transition-colors text-on-surface">
          <ArrowLeft size={20} />
        </Link>
        <h2 className="font-headline-md text-headline-md text-on-surface">
          {isEditMode ? 'Edit Doctor' : 'Add New Doctor'}
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
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder=" "
                required
                className="floating-input peer w-full bg-surface-container-lowest border border-[#E7E7E7] rounded-lg px-md pt-lg pb-sm text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              />
              <label htmlFor="name" className="absolute text-on-surface-variant left-md top-1/2 -translate-y-1/2 transition-all duration-200 pointer-events-none origin-left text-body-md font-body-md">
                Doctor Name *
              </label>
            </div>

            {/* Image URL */}
            <div className="relative w-full">
              <input
                type="text"
                id="image"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder=" "
                className="floating-input peer w-full bg-surface-container-lowest border border-[#E7E7E7] rounded-lg px-md pt-lg pb-sm text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              />
              <label htmlFor="image" className="absolute text-on-surface-variant left-md top-1/2 -translate-y-1/2 transition-all duration-200 pointer-events-none origin-left text-body-md font-body-md">
                Image URL
              </label>
            </div>

            {/* Experties */}
            <div className="relative w-full">
              <select
                id="experties"
                name="experties"
                value={formData.experties}
                onChange={handleChange}
                required
                className="peer w-full bg-surface-container-lowest border border-[#E7E7E7] rounded-lg px-md pt-lg pb-sm text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary appearance-none cursor-pointer h-[58px]"
              >
                <option value="" disabled></option>
                {expertiesList.map(exp => (
                  <option key={exp.id} value={exp.id}>{exp.expertyType}</option>
                ))}
              </select>
              <label htmlFor="experties" className={`absolute left-md transition-all duration-200 pointer-events-none origin-left font-body-md peer-focus:text-primary whitespace-nowrap ${formData.experties ? 'top-[10px] text-label-md text-on-surface-variant scale-85' : 'top-1/2 -translate-y-1/2 text-body-md text-on-surface-variant'}`}>
                Expertise *
              </label>
              <div className="absolute right-md top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
              </div>
            </div>

            {/* Languages */}
            <div className="relative w-full">
              <select
                id="languages"
                name="languages"
                value={formData.languages}
                onChange={handleChange}
                required
                className="peer w-full bg-surface-container-lowest border border-[#E7E7E7] rounded-lg px-md pt-lg pb-sm text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary appearance-none cursor-pointer h-[58px]"
              >
                <option value="" disabled></option>
                {languagesList.map(lang => (
                  <option key={lang.id} value={lang.id}>{lang.lang}</option>
                ))}
              </select>
              <label htmlFor="languages" className={`absolute left-md transition-all duration-200 pointer-events-none origin-left font-body-md peer-focus:text-primary whitespace-nowrap ${formData.languages ? 'top-[10px] text-label-md text-on-surface-variant scale-85' : 'top-1/2 -translate-y-1/2 text-body-md text-on-surface-variant'}`}>
                Language *
              </label>
              <div className="absolute right-md top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
              </div>
            </div>

            {/* Education */}
            <div className="relative w-full">
              <input
                type="text"
                id="education"
                name="education"
                value={formData.education}
                onChange={handleChange}
                placeholder=" "
                className="floating-input peer w-full bg-surface-container-lowest border border-[#E7E7E7] rounded-lg px-md pt-lg pb-sm text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              />
              <label htmlFor="education" className="absolute text-on-surface-variant left-md top-1/2 -translate-y-1/2 transition-all duration-200 pointer-events-none origin-left text-body-md font-body-md">
                Education (e.g. MBBS, MD)
              </label>
            </div>

            {/* Years of Experience */}
            <div className="relative w-full">
              <input
                type="number"
                id="yearOfExp"
                name="yearOfExp"
                value={formData.yearOfExp}
                onChange={handleChange}
                placeholder=" "
                className="floating-input peer w-full bg-surface-container-lowest border border-[#E7E7E7] rounded-lg px-md pt-lg pb-sm text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              />
              <label htmlFor="yearOfExp" className="absolute text-on-surface-variant left-md top-1/2 -translate-y-1/2 transition-all duration-200 pointer-events-none origin-left text-body-md font-body-md">
                Years of Experience
              </label>
            </div>

            {/* Status */}
            <div className="relative w-full md:col-span-2">
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

            {/* Description */}
            <div className="relative w-full md:col-span-2">
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder=" "
                rows="4"
                className="floating-input peer w-full bg-surface-container-lowest border border-[#E7E7E7] rounded-lg px-md pt-lg pb-sm text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors resize-none"
              ></textarea>
              <label htmlFor="description" className="absolute text-on-surface-variant left-md top-[18px] transition-all duration-200 pointer-events-none origin-left text-body-md font-body-md">
                Doctor Description / Bio
              </label>
            </div>

          </div>

          <div className="flex justify-end border-t border-[#E7E7E7] pt-lg mt-xl">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center justify-center gap-sm bg-primary text-on-primary hover:bg-primary-container px-xl py-sm rounded-lg font-label-md transition-colors shadow-sm disabled:opacity-50"
            >
              <Save size={18} />
              {saving ? 'Saving...' : 'Save Doctor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DoctorForm;
