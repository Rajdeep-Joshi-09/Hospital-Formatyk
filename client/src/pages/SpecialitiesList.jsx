import { useState, useEffect } from 'react';
import { Link, useOutletContext, useLocation } from 'react-router-dom';
import { Plus, Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api';
import DataTable from '../components/DataTable';

const SpecialitiesList = () => {
  const [specialities, setSpecialities] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const { menus: layoutMenus } = useOutletContext();
  const location = useLocation();
  const currentMenu = layoutMenus.find(m => m.listPageRoute === location.pathname) || {};
  const permissions = currentMenu.userPermission || { isWrite: 0, isEdit: 0, isDelete: 0 };

  const fetchSpecialities = async () => {
    try {
      const response = await api.get('/specialities');
      if (response.data.status) {
        setSpecialities(response.data.result);
      }
    } catch (error) {
      console.error('Failed to fetch specialities', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpecialities();
  }, []);

  const handleDelete = (id) => {
    toast((t) => (
      <div className="flex flex-col gap-xs">
        <p className="font-body-md m-0">Are you sure you want to delete this speciality?</p>
        <div className="flex gap-sm justify-end mt-2">
          <button 
            className="px-md py-xs bg-error text-on-error rounded-md text-sm font-label-md"
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                await api.delete(`/specialities/${id}`);
                fetchSpecialities();
                toast.success('Deleted successfully');
              } catch (error) {
                console.error('Failed to delete speciality', error);
                toast.error(error.response?.data?.message || 'Error deleting speciality');
              }
            }}
          >
            Delete
          </button>
          <button 
            className="px-md py-xs bg-[#444] rounded-md text-sm text-white font-label-md"
            onClick={() => toast.dismiss(t.id)}
          >
            Cancel
          </button>
        </div>
      </div>
    ), { duration: Infinity });
  };

  const columns = [
    { key: 'id', label: 'ID' },
    { 
      key: 'icon', 
      label: 'Icon',
      render: (row) => (
        row.icon ? (
          <img src={row.icon} alt={row.speciality} className="w-10 h-10 object-contain" />
        ) : (
          <div className="w-10 h-10 bg-surface-container flex items-center justify-center text-on-surface-variant font-label-sm rounded border border-[#E7E7E7]">
            -
          </div>
        )
      )
    },
    { key: 'speciality', label: 'Speciality' },
    { 
      key: 'treatmentType.treatType', 
      label: 'Treatment Type',
      render: (row) => row.treatmentType?.treatType || 'N/A'
    },
    { key: 'experience', label: 'Experience (Yrs)' },
    { 
      key: 'isStatus', 
      label: 'Status',
      render: (row) => (
        <span className={`px-sm py-xs rounded-lg font-label-md ${row.isStatus === 1 ? 'bg-[#E0F2E9] text-[#1D7A46]' : 'bg-error-container text-on-error-container'}`}>
          {row.isStatus === 1 ? 'Active' : 'Inactive'}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      render: (row) => (
        <div className="flex gap-sm items-center">
          {permissions.isEdit === 1 && (
            <Link to={`/admin/specialities/edit/${row.id}`} className="p-xs text-primary hover:bg-surface-container rounded transition-colors">
              <Edit size={18} />
            </Link>
          )}
          {permissions.isDelete === 1 && (
            <button onClick={() => handleDelete(row.id)} className="p-xs text-error hover:bg-error-container rounded transition-colors">
              <Trash2 size={18} />
            </button>
          )}
        </div>
      )
    }
  ];

  if (loading) {
    return <div className="p-xl text-center font-body-md">Loading specialities...</div>;
  }

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex justify-between items-center mb-lg">
        <div>
          <h2 className="font-headline-md text-headline-md text-on-surface">Manage Specialities</h2>
          <p className="font-body-md text-on-surface-variant mt-xs">View, search, and manage specialities.</p>
        </div>
        {permissions.isWrite === 1 && (
          <Link 
            to="/admin/specialities/new" 
            className="flex items-center gap-xs bg-primary text-on-primary hover:bg-primary-container px-md py-sm rounded-lg font-label-md transition-colors shadow-sm"
          >
            <Plus size={20} />
            Add Speciality
          </Link>
        )}
      </div>

      <div className="flex-1 overflow-hidden">
        <DataTable columns={columns} data={specialities} exportFileName="LuxCare_Specialities" />
      </div>
    </div>
  );
};

export default SpecialitiesList;
