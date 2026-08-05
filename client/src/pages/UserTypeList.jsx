import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2 } from 'lucide-react';
import api from '../utils/api';
import DataTable from '../components/DataTable';

const UserTypeList = () => {
  const [userTypes, setUserTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUserTypes = async () => {
    try {
      const response = await api.get('/user-types');
      if (response.data.status) {
        setUserTypes(response.data.result);
      }
    } catch (error) {
      console.error('Failed to fetch user types', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserTypes();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this User Type?')) {
      try {
        await api.delete(`/user-types/${id}`);
        fetchUserTypes(); // Refresh list
      } catch (error) {
        console.error('Failed to delete user type', error);
        alert(error.response?.data?.message || 'Error deleting user type');
      }
    }
  };

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'userType', label: 'User Type' },
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
        <div className="flex gap-sm">
          <Link to={`/admin/user-types/edit/${row.id}`} className="p-xs text-primary hover:bg-surface-container rounded transition-colors">
            <Edit size={18} />
          </Link>
          <button onClick={() => handleDelete(row.id)} className="p-xs text-error hover:bg-error-container rounded transition-colors">
            <Trash2 size={18} />
          </button>
        </div>
      )
    }
  ];

  if (loading) {
    return <div className="p-xl text-center font-body-md">Loading user types...</div>;
  }

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex justify-between items-center mb-lg">
        <div>
          <h2 className="font-headline-md text-headline-md text-on-surface">Manage User Types</h2>
          <p className="font-body-md text-on-surface-variant mt-xs">View, search, and manage system user roles.</p>
        </div>
        <Link 
          to="/admin/user-types/new" 
          className="flex items-center gap-xs bg-primary text-on-primary hover:bg-primary-container px-md py-sm rounded-lg font-label-md transition-colors shadow-sm"
        >
          <Plus size={20} />
          Add User Type
        </Link>
      </div>

      <div className="flex-1 overflow-hidden">
        <DataTable columns={columns} data={userTypes} exportFileName="LuxCare_UserTypes" />
      </div>
    </div>
  );
};

export default UserTypeList;
