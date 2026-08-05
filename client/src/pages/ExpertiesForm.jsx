import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import api from '../utils/api';

const ExpertiesForm = () => {
  const { id } = useParams();
  const isEditMode = !!id;
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    expertyType: '',
    isStatus: 1
  });
  
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditMode) {
      const fetchExperties = async () => {
        try {
          const response = await api.get(`/experties/${id}`);
          if (response.data.status) {
            setFormData({
              expertyType: response.data.result.expertyType || '',
              isStatus: response.data.result.isStatus ?? 1
            });
          }
        } catch (err) {
          setError('Failed to load experties details');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchExperties();
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (checked ? 1 : 0) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      if (isEditMode) {
        await api.put(`/experties/${id}`, formData);
      } else {
        await api.post('/experties', formData);
      }
      navigate('/admin/experties');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-xl text-center font-body-md">Loading...</div>;
  }

  return (
    <div className="w-full max-w-4xl mx-auto pb-xl">
      <div className="flex items-center gap-md mb-lg">
        <Link to="/admin/experties" className="p-xs bg-surface-container rounded-full hover:bg-[#e0bfbc] transition-colors text-on-surface">
          <ArrowLeft size={20} />
        </Link>
        <h2 className="font-headline-md text-headline-md text-on-surface">
          {isEditMode ? 'Edit Experties' : 'Add New Experties'}
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
            
            {/* Experties Type */}
            <div className="relative w-full">
              <input
                type="text"
                id="expertyType"
                name="expertyType"
                value={formData.expertyType}
                onChange={handleChange}
                placeholder=" "
                required
                className="floating-input peer w-full bg-surface-container-lowest border border-[#E7E7E7] rounded-lg px-md pt-lg pb-sm text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              />
              <label htmlFor="expertyType" className="absolute text-on-surface-variant left-md top-1/2 -translate-y-1/2 transition-all duration-200 pointer-events-none origin-left text-body-md font-body-md">
                Experties Type *
              </label>
            </div>

            {/* Status */}
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
              {saving ? 'Saving...' : 'Save Experties'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExpertiesForm;
