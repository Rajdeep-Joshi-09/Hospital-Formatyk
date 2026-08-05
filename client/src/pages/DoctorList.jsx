import { useState, useEffect } from 'react';
import { Link, useOutletContext, useLocation } from 'react-router-dom';
import { Plus, Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api';
import DataTable from '../components/DataTable';

const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const { menus: layoutMenus } = useOutletContext();
  const location = useLocation();
  const currentMenu = layoutMenus.find(m => m.listPageRoute === location.pathname) || {};
  const permissions = currentMenu.userPermission || { isWrite: 0, isEdit: 0, isDelete: 0 };

  const fetchDoctors = async () => {
    try {
      const response = await api.get('/doctors');
      if (response.data.status) {
        setDoctors(response.data.result);
      }
    } catch (error) {
      console.error('Failed to fetch doctors', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleDelete = (id) => {
    toast((t) => (
      <div className="flex flex-col gap-xs">
        <p className="font-body-md m-0">Are you sure you want to delete this doctor?</p>
        <div className="flex gap-sm justify-end mt-2">
          <button 
            className="px-md py-xs bg-error text-on-error rounded-md text-sm font-label-md"
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                await api.delete(`/doctors/${id}`);
                fetchDoctors();
                toast.success('Deleted successfully');
              } catch (error) {
                console.error('Failed to delete doctor', error);
                toast.error(error.response?.data?.message || 'Error deleting doctor');
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
      key: 'image', 
      label: 'Photo',
      render: (row) => (
        row.image ? (
          <img src={row.image} alt={row.name} className="w-10 h-10 rounded-full object-cover border border-[#E7E7E7]" />
        ) : (
          <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant font-label-sm border border-[#E7E7E7]">
            {row.name.charAt(0).toUpperCase()}
          </div>
        )
      )
    },
    { key: 'name', label: 'Doctor Name' },
    { 
      key: 'expertiesMaster.expertyType', 
      label: 'Expertise',
      render: (row) => row.expertiesMaster?.expertyType || 'N/A'
    },
    { 
      key: 'languageMaster.lang', 
      label: 'Language',
      render: (row) => row.languageMaster?.lang || 'N/A'
    },
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
            <Link to={`/admin/doctors/edit/${row.id}`} className="p-xs text-primary hover:bg-surface-container rounded transition-colors">
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
    return <div className="p-xl text-center font-body-md">Loading doctors...</div>;
  }

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex justify-between items-center mb-lg">
        <div>
          <h2 className="font-headline-md text-headline-md text-on-surface">Manage Doctors</h2>
          <p className="font-body-md text-on-surface-variant mt-xs">View, search, and manage doctor profiles.</p>
        </div>
        {permissions.isWrite === 1 && (
          <Link 
            to="/admin/doctors/new" 
            className="flex items-center gap-xs bg-primary text-on-primary hover:bg-primary-container px-md py-sm rounded-lg font-label-md transition-colors shadow-sm"
          >
            <Plus size={20} />
            Add Doctor
          </Link>
        )}
      </div>

      <div className="flex-1 overflow-hidden">
        <DataTable columns={columns} data={doctors} exportFileName="LuxCare_Doctors" />
      </div>
    </div>
  );
};

export default DoctorList;
