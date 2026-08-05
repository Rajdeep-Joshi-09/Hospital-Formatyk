import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import api from '../utils/api';

const SpecialitiesForm = () => {
  const { id } = useParams();
  const isEditMode = !!id;
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    speciality: '',
    description: '',
    experience: '',
    icon: '',
    treatType: '',
    isStatus: 1
  });
  
  const [treatmentTypes, setTreatmentTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const treatRes = await api.get('/treatment-types');
        if (treatRes.data.status) {
          setTreatmentTypes(treatRes.data.result.filter(t => t.isStatus === 1));
        }

        if (isEditMode) {
          const specRes = await api.get(`/specialities/${id}`);
          if (specRes.data.status) {
            const spec = specRes.data.result;
            setFormData({
              speciality: spec.speciality || '',
              description: spec.description || '',
              experience: spec.experience || '',
              icon: spec.icon || '',
              treatType: spec.treatType || '',
              isStatus: spec.isStatus ?? 1
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
    if (name === 'isStatus' || name === 'treatType' || name === 'experience') {
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
        await api.put(`/specialities/${id}`, formData);
      } else {
        await api.post('/specialities', formData);
      }
      navigate('/admin/specialities');
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
        <Link to="/admin/specialities" className="p-xs bg-surface-container rounded-full hover:bg-[#e0bfbc] transition-colors text-on-surface">
          <ArrowLeft size={20} />
        </Link>
        <h2 className="font-headline-md text-headline-md text-on-surface">
          {isEditMode ? 'Edit Speciality' : 'Add New Speciality'}
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
            
            {/* Speciality Name */}
            <div className="relative w-full">
              <input
                type="text"
                id="speciality"
                name="speciality"
                value={formData.speciality}
                onChange={handleChange}
                placeholder=" "
                required
                className="floating-input peer w-full bg-surface-container-lowest border border-[#E7E7E7] rounded-lg px-md pt-lg pb-sm text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              />
              <label htmlFor="speciality" className="absolute text-on-surface-variant left-md top-1/2 -translate-y-1/2 transition-all duration-200 pointer-events-none origin-left text-body-md font-body-md">
                Speciality Name *
              </label>
            </div>

            {/* Treatment Type Dropdown */}
            <div className="relative w-full">
              <select
                id="treatType"
                name="treatType"
                value={formData.treatType}
                onChange={handleChange}
                required
                className="peer w-full bg-surface-container-lowest border border-[#E7E7E7] rounded-lg px-md pt-lg pb-sm text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary appearance-none cursor-pointer h-[58px]"
              >
                <option value="" disabled></option>
                {treatmentTypes.map(tt => (
                  <option key={tt.id} value={tt.id}>{tt.treatType}</option>
                ))}
              </select>
              <label htmlFor="treatType" className={`absolute left-md transition-all duration-200 pointer-events-none origin-left font-body-md peer-focus:text-primary whitespace-nowrap ${formData.treatType ? 'top-[10px] text-label-md text-on-surface-variant scale-85' : 'top-1/2 -translate-y-1/2 text-body-md text-on-surface-variant'}`}>
                Treatment Type *
              </label>
              <div className="absolute right-md top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
              </div>
            </div>

            {/* Experience */}
            <div className="relative w-full">
              <input
                type="number"
                id="experience"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                placeholder=" "
                className="floating-input peer w-full bg-surface-container-lowest border border-[#E7E7E7] rounded-lg px-md pt-lg pb-sm text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              />
              <label htmlFor="experience" className="absolute text-on-surface-variant left-md top-1/2 -translate-y-1/2 transition-all duration-200 pointer-events-none origin-left text-body-md font-body-md">
                Experience (Years)
              </label>
            </div>

            {/* Icon URL */}
            <div className="relative w-full">
              <input
                type="text"
                id="icon"
                name="icon"
                value={formData.icon}
                onChange={handleChange}
                placeholder=" "
                className="floating-input peer w-full bg-surface-container-lowest border border-[#E7E7E7] rounded-lg px-md pt-lg pb-sm text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              />
              <label htmlFor="icon" className="absolute text-on-surface-variant left-md top-1/2 -translate-y-1/2 transition-all duration-200 pointer-events-none origin-left text-body-md font-body-md">
                Icon URL
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
                Description
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
              {saving ? 'Saving...' : 'Save Speciality'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SpecialitiesForm;
