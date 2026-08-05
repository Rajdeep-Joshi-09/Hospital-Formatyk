import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import api from '../utils/api';

const RolePermissionForm = () => {
  const navigate = useNavigate();
  const { userTypeId } = useParams();
  
  const [userTypes, setUserTypes] = useState([]);
  const [selectedUserTypeId, setSelectedUserTypeId] = useState(userTypeId ? parseInt(userTypeId) : '');
  const [menus, setMenus] = useState([]);
  const [permissions, setPermissions] = useState({});
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch all active User Types
        const utRes = await api.get('/user-types');
        if (utRes.data.status) {
          setUserTypes(utRes.data.result);
        }
        
        // Fetch all menus
        const menuRes = await api.get('/menus');
        if (menuRes.data.status) {
          setMenus(menuRes.data.result);
          // Initialize default permissions structure
          const initialPerms = {};
          menuRes.data.result.forEach(m => {
            initialPerms[m.id] = { isRead: 0, isWrite: 0, isEdit: 0, isDelete: 0 };
          });
          setPermissions(initialPerms);
        }
        
      } catch (err) {
        setError('Failed to load initial data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Fetch permissions when a UserType is selected
  useEffect(() => {
    if (!selectedUserTypeId) return;
    
    const fetchPermissions = async () => {
      try {
        const res = await api.get(`/permissions/${selectedUserTypeId}`);
        if (res.data.status) {
          setPermissions(prev => {
            const updated = { ...prev };
            res.data.result.forEach(p => {
              if (updated[p.menuId]) {
                updated[p.menuId] = {
                  isRead: p.isRead,
                  isWrite: p.isWrite,
                  isEdit: p.isEdit,
                  isDelete: p.isDelete
                };
              }
            });
            return updated;
          });
        }
      } catch (err) {
        console.error('Failed to load permissions for role', err);
      }
    };
    
    fetchPermissions();
  }, [selectedUserTypeId]);

  const handleUserTypeChange = (e) => {
    const val = e.target.value;
    setSelectedUserTypeId(val ? parseInt(val) : '');
    setSuccess(null);
    setError(null);
    // Reset permissions back to 0 when switching roles to avoid showing stale data before API returns
    setPermissions(prev => {
      const reset = {};
      Object.keys(prev).forEach(k => {
        reset[k] = { isRead: 0, isWrite: 0, isEdit: 0, isDelete: 0 };
      });
      return reset;
    });
  };

  const togglePermission = (menuId, field) => {
    setPermissions(prev => {
      const currentPerms = prev[menuId];
      const newValue = currentPerms[field] === 1 ? 0 : 1;
      const newPerms = { ...currentPerms, [field]: newValue };

      // If turning off Read, turn off all others
      if (field === 'isRead' && newValue === 0) {
        newPerms.isWrite = 0;
        newPerms.isEdit = 0;
        newPerms.isDelete = 0;
      }
      
      // If turning on Write, Edit, or Delete, ensure Read is on
      if (field !== 'isRead' && newValue === 1) {
        newPerms.isRead = 1;
      }

      return {
        ...prev,
        [menuId]: newPerms
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUserTypeId) {
      setError('Please select a Role');
      return;
    }
    
    setSaving(true);
    setError(null);

    // Convert permissions object to array for API
    const permissionsArray = Object.keys(permissions).map(menuId => ({
      menuId: parseInt(menuId),
      ...permissions[menuId]
    }));

    try {
      await api.post('/permissions', {
        userTypeId: selectedUserTypeId,
        permissions: permissionsArray
      });
      setSuccess('Permissions saved successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save permissions');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-xl text-center font-body-md">Loading...</div>;

  return (
    <div className="w-full max-w-5xl mx-auto pb-xl">
      <div className="flex items-center gap-md mb-lg">
        <h2 className="font-headline-md text-headline-md text-on-surface">
          Manage Role Permissions
        </h2>
      </div>

      <div className="glass-card p-xl rounded-[24px]">
        {error && (
          <div className="mb-lg p-md bg-error-container text-on-error-container rounded-lg font-body-md">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-lg p-md bg-[#e6f4ea] text-[#137333] rounded-lg font-body-md">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          
          {/* Role Selection Dropdown */}
          <div className="mb-xl flex flex-col gap-xs" style={{ width: '100%', maxWidth: '448px' }}>
            <label htmlFor="userTypeId" className="text-label-md font-label-md text-on-surface-variant ml-sm whitespace-nowrap">
              Role Name *
            </label>
            <select
              id="userTypeId"
              value={selectedUserTypeId}
              onChange={handleUserTypeChange}
              className="bg-surface-container-lowest border border-[#E7E7E7] rounded-lg px-md py-sm text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary cursor-pointer h-[48px]"
              style={{ width: '100%', minWidth: '100%', display: 'block' }}
            >
              <option value="">-- Select Role --</option>
              {userTypes.map(ut => (
                <option key={ut.id} value={ut.id}>{ut.userType}</option>
              ))}
            </select>
          </div>

          {/* Permissions Grid */}
          {selectedUserTypeId && menus.length > 0 && (
            <div className="border border-[#E7E7E7] rounded-xl overflow-hidden bg-surface-container-lowest mb-xl">
              
              {/* Header Row */}
              <div className="grid grid-cols-5 gap-4 p-md bg-surface-container border-b border-[#E7E7E7] font-label-md text-on-surface-variant">
                <div className="col-span-2">Menu Name</div>
                <div className="text-center">Write</div>
                <div className="text-center">Edit</div>
                <div className="text-center">Delete</div>
              </div>

              {/* Menu Rows */}
              {menus.map((menu, index) => {
                const perms = permissions[menu.id] || { isRead: 0, isWrite: 0, isEdit: 0, isDelete: 0 };
                
                return (
                  <div key={menu.id} className={`grid grid-cols-5 gap-4 p-md items-center ${index !== menus.length - 1 ? 'border-b border-[#E7E7E7]' : ''}`}>
                    
                    {/* Menu Name + Read Checkbox */}
                    <div className="col-span-2 flex items-center gap-md">
                      <input 
                        type="checkbox" 
                        checked={perms.isRead === 1}
                        onChange={() => togglePermission(menu.id, 'isRead')}
                        className="w-5 h-5 accent-primary rounded cursor-pointer"
                      />
                      <span className="font-label-md text-on-surface uppercase tracking-wide">
                        {menu.menuName}
                      </span>
                    </div>

                    {/* Write Toggle */}
                    <div className="flex flex-col items-center gap-xs">
                      <button
                        type="button"
                        disabled={perms.isRead === 0}
                        onClick={() => togglePermission(menu.id, 'isWrite')}
                        className={`w-12 h-6 rounded-full transition-colors relative ${perms.isWrite ? 'bg-[#FFC107]' : 'bg-[#E0E0E0]'} ${perms.isRead === 0 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${perms.isWrite ? 'transform translate-x-6' : ''}`} />
                      </button>
                    </div>

                    {/* Edit Toggle */}
                    <div className="flex flex-col items-center gap-xs">
                      <button
                        type="button"
                        disabled={perms.isRead === 0}
                        onClick={() => togglePermission(menu.id, 'isEdit')}
                        className={`w-12 h-6 rounded-full transition-colors relative ${perms.isEdit ? 'bg-[#4CAF50]' : 'bg-[#E0E0E0]'} ${perms.isRead === 0 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${perms.isEdit ? 'transform translate-x-6' : ''}`} />
                      </button>
                    </div>

                    {/* Delete Toggle */}
                    <div className="flex flex-col items-center gap-xs">
                      <button
                        type="button"
                        disabled={perms.isRead === 0}
                        onClick={() => togglePermission(menu.id, 'isDelete')}
                        className={`w-12 h-6 rounded-full transition-colors relative ${perms.isDelete ? 'bg-error' : 'bg-[#E0E0E0]'} ${perms.isRead === 0 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${perms.isDelete ? 'transform translate-x-6' : ''}`} />
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          )}

          <div className="flex justify-center pt-lg">
            <button
              type="submit"
              disabled={saving || !selectedUserTypeId}
              className="flex items-center justify-center bg-surface-container-lowest border border-[#E7E7E7] text-on-surface hover:border-primary hover:text-primary px-xl py-[10px] rounded-lg font-label-lg transition-colors shadow-sm disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RolePermissionForm;
