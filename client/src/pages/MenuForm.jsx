import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, X, Search } from 'lucide-react';
import * as Icons from 'lucide-react';
import api from '../utils/api';

const MenuForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    menuName: '',
    pageName: '',
    formPageRoute: '',
    listPageRoute: '',
    sortOrder: 0,
    icon: '',
    parentId: '', 
    isStatus: 1
  });
  
  const [availableMenus, setAvailableMenus] = useState([]);
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Icon Picker State
  const [isIconPickerOpen, setIsIconPickerOpen] = useState(false);
  const [iconSearchTerm, setIconSearchTerm] = useState('');

  // Get all valid icon names from lucide-react
  const availableIcons = useMemo(() => {
    return Object.keys(Icons).filter(name => 
      /^[A-Z]/.test(name) && !name.endsWith('Icon')
    );
  }, []);

  const filteredIcons = useMemo(() => {
    return availableIcons.filter(name => 
      name.toLowerCase().includes(iconSearchTerm.toLowerCase())
    ).slice(0, 50); // limit to 50 for performance
  }, [availableIcons, iconSearchTerm]);

  useEffect(() => {
    // Fetch menus for the Parent Dropdown
    const fetchDropdownMenus = async () => {
      try {
        const response = await api.get('/menus');
        if (response.data.status) {
          let menus = response.data.result;
          if (isEditMode) {
            menus = menus.filter(m => m.id !== parseInt(id));
          }
          setAvailableMenus(menus);
        }
      } catch (err) {
        console.error('Failed to load parent menus', err);
      }
    };

    fetchDropdownMenus();

    if (isEditMode) {
      const fetchMenu = async () => {
        try {
          const response = await api.get(`/menus/${id}`);
          if (response.data.status) {
            const menu = response.data.result;
            setFormData({
              menuName: menu.menuName,
              pageName: menu.pageName || '',
              formPageRoute: menu.formPageRoute || '',
              listPageRoute: menu.listPageRoute || '',
              sortOrder: menu.sortOrder || 0,
              icon: menu.icon || '',
              parentId: menu.parentId || '',
              isStatus: menu.isStatus
            });
          }
        } catch (err) {
          setError('Failed to load menu data');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchMenu();
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: (name === 'isStatus' || name === 'sortOrder') ? parseInt(value) || 0 : value
    }));
  };

  const handleIconSelect = (iconName) => {
    setFormData(prev => ({ ...prev, icon: iconName }));
    setIsIconPickerOpen(false);
    setIconSearchTerm('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const payload = { ...formData };
      
      if (payload.parentId === '') {
        payload.parentId = null;
      } else {
        payload.parentId = parseInt(payload.parentId);
      }

      if (isEditMode) {
        await api.put(`/menus/${id}`, payload);
      } else {
        await api.post('/menus', payload);
      }
      navigate('/admin/menus');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-xl text-center font-body-md">Loading...</div>;

  const SelectedIcon = formData.icon && Icons[formData.icon] ? Icons[formData.icon] : null;

  return (
    <div className="w-full max-w-4xl mx-auto pb-xl relative">
      <div className="flex items-center gap-md mb-lg">
        <Link to="/admin/menus" className="p-xs bg-surface-container rounded-full hover:bg-[#e0bfbc] transition-colors text-on-surface">
          <ArrowLeft size={20} />
        </Link>
        <h2 className="font-headline-md text-headline-md text-on-surface">
          {isEditMode ? 'Edit Menu' : 'Create New Menu'}
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
            
            <div className="relative w-full">
              <input
                id="menuName"
                name="menuName"
                type="text"
                placeholder=" "
                required
                value={formData.menuName}
                onChange={handleChange}
                className="floating-input peer w-full bg-surface-container-lowest border border-[#E7E7E7] rounded-lg px-md pt-lg pb-sm text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              />
              <label htmlFor="menuName" className="absolute text-on-surface-variant left-md top-1/2 -translate-y-1/2 transition-all duration-200 pointer-events-none origin-left text-body-md font-body-md">
                Menu Name *
              </label>
            </div>

            <div className="relative w-full">
              <input
                id="pageName"
                name="pageName"
                type="text"
                placeholder=" "
                value={formData.pageName}
                onChange={handleChange}
                className="floating-input peer w-full bg-surface-container-lowest border border-[#E7E7E7] rounded-lg px-md pt-lg pb-sm text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              />
              <label htmlFor="pageName" className="absolute text-on-surface-variant left-md top-1/2 -translate-y-1/2 transition-all duration-200 pointer-events-none origin-left text-body-md font-body-md">
                Page Name
              </label>
            </div>

            <div className="relative w-full">
              <input
                id="formPageRoute"
                name="formPageRoute"
                type="text"
                placeholder=" "
                value={formData.formPageRoute}
                onChange={handleChange}
                className="floating-input peer w-full bg-surface-container-lowest border border-[#E7E7E7] rounded-lg px-md pt-lg pb-sm text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              />
              <label htmlFor="formPageRoute" className="absolute text-on-surface-variant left-md top-1/2 -translate-y-1/2 transition-all duration-200 pointer-events-none origin-left text-body-md font-body-md">
                Form Page Route (e.g. /admin/users/new)
              </label>
            </div>

            <div className="relative w-full">
              <input
                id="listPageRoute"
                name="listPageRoute"
                type="text"
                placeholder=" "
                value={formData.listPageRoute}
                onChange={handleChange}
                className="floating-input peer w-full bg-surface-container-lowest border border-[#E7E7E7] rounded-lg px-md pt-lg pb-sm text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              />
              <label htmlFor="listPageRoute" className="absolute text-on-surface-variant left-md top-1/2 -translate-y-1/2 transition-all duration-200 pointer-events-none origin-left text-body-md font-body-md">
                List Page Route (e.g. /admin/users)
              </label>
            </div>

            <div className="relative w-full">
              <input
                id="sortOrder"
                name="sortOrder"
                type="number"
                placeholder=" "
                value={formData.sortOrder}
                onChange={handleChange}
                className="floating-input peer w-full bg-surface-container-lowest border border-[#E7E7E7] rounded-lg px-md pt-lg pb-sm text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              />
              <label htmlFor="sortOrder" className="absolute text-on-surface-variant left-md top-1/2 -translate-y-1/2 transition-all duration-200 pointer-events-none origin-left text-body-md font-body-md">
                Sort Order
              </label>
            </div>

            {/* Icon Picker Field */}
            <div className="relative w-full">
              <div 
                onClick={() => setIsIconPickerOpen(true)}
                className="w-full bg-surface-container-lowest border border-[#E7E7E7] rounded-lg px-md pt-lg pb-sm flex items-center justify-between cursor-pointer hover:border-primary transition-colors h-[58px]"
              >
                <div className="flex items-center gap-sm">
                  {SelectedIcon ? <SelectedIcon size={20} className="text-primary" /> : <div className="w-5 h-5" />}
                  <span className={`text-body-md ${formData.icon ? 'text-on-surface' : 'text-on-surface-variant opacity-0'}`}>
                    {formData.icon || 'Select Icon'}
                  </span>
                </div>
                <Search size={18} className="text-on-surface-variant" />
              </div>
              <label className={`absolute left-md transition-all duration-200 pointer-events-none origin-left font-body-md ${formData.icon ? 'top-[10px] text-label-md text-primary scale-85' : 'top-1/2 -translate-y-1/2 text-body-md text-on-surface-variant'}`}>
                Icon Name (Lucide React)
              </label>
            </div>

            <div className="relative w-full flex flex-col gap-xs">
              <label className="text-caption font-label-md text-on-surface-variant pl-sm">Parent Menu</label>
              <select
                name="parentId"
                value={formData.parentId}
                onChange={handleChange}
                className="w-full bg-surface-container-lowest border border-[#E7E7E7] rounded-lg px-md py-[14px] text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary appearance-none cursor-pointer"
              >
                <option value="">None (Root Level)</option>
                {availableMenus.map(menu => (
                  <option key={menu.id} value={menu.id}>{menu.menuName}</option>
                ))}
              </select>
            </div>

            <div className="relative w-full flex flex-col gap-xs">
              <label className="text-caption font-label-md text-on-surface-variant pl-sm">Status</label>
              <select
                name="isStatus"
                value={formData.isStatus}
                onChange={handleChange}
                className="w-full bg-surface-container-lowest border border-[#E7E7E7] rounded-lg px-md py-[14px] text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary appearance-none cursor-pointer"
              >
                <option value={1}>Active</option>
                <option value={0}>Inactive</option>
              </select>
            </div>

          </div>

          <div className="flex justify-end border-t border-[#E7E7E7] pt-lg mt-xl">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center justify-center gap-sm bg-primary text-on-primary hover:bg-primary-container px-xl py-sm rounded-lg font-label-md transition-colors shadow-sm disabled:opacity-50"
            >
              <Save size={18} />
              {saving ? 'Saving...' : 'Save Menu'}
            </button>
          </div>
        </form>
      </div>

      {/* Icon Picker Modal */}
      {isIconPickerOpen && (
        <div className="fixed inset-0 bg-on-surface/50 z-50 flex items-center justify-center p-md">
          <div className="bg-surface-container-lowest rounded-[24px] w-full max-w-2xl max-h-[80vh] flex flex-col shadow-lg border border-[#E7E7E7] overflow-hidden">
            <div className="p-lg border-b border-[#E7E7E7] flex justify-between items-center bg-surface-container-lowest">
              <h3 className="font-headline-sm text-headline-sm text-on-surface">Select Icon</h3>
              <button 
                onClick={() => setIsIconPickerOpen(false)}
                className="p-xs text-on-surface-variant hover:text-error hover:bg-error-container rounded-full transition-colors"
                type="button"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-lg border-b border-[#E7E7E7] bg-surface-container-lowest">
              <div className="relative">
                <Search size={20} className="absolute left-md top-1/2 -translate-y-1/2 text-on-surface-variant" />
                <input
                  type="text"
                  placeholder="Search icons..."
                  autoFocus
                  value={iconSearchTerm}
                  onChange={(e) => setIconSearchTerm(e.target.value)}
                  className="w-full bg-surface-container border border-[#E7E7E7] rounded-lg pl-[44px] pr-md py-sm text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
            <div className="p-lg overflow-y-auto flex-1 bg-surface-container-lowest grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-md">
              {filteredIcons.length > 0 ? (
                filteredIcons.map(iconName => {
                  const IconComp = Icons[iconName];
                  return (
                    <button
                      key={iconName}
                      onClick={() => handleIconSelect(iconName)}
                      className="flex flex-col items-center gap-xs p-sm rounded-xl border border-transparent hover:border-primary hover:bg-primary-container/10 transition-colors group"
                      type="button"
                      title={iconName}
                    >
                      <IconComp size={24} className="text-on-surface-variant group-hover:text-primary transition-colors" />
                      <span className="text-[10px] text-on-surface-variant truncate w-full text-center">
                        {iconName}
                      </span>
                    </button>
                  );
                })
              ) : (
                <div className="col-span-full text-center p-xl text-on-surface-variant font-body-md">
                  No icons found for "{iconSearchTerm}"
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default MenuForm;
