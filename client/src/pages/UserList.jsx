import { useState, useEffect } from 'react';
import { Link, useOutletContext, useLocation } from 'react-router-dom';
import { Plus, Edit, Trash2 } from 'lucide-react';
import api from '../utils/api';
import DataTable from '../components/DataTable';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { menus } = useOutletContext();
  const location = useLocation();
  const currentMenu = menus.find(m => m.listPageRoute === location.pathname) || {};
  const permissions = currentMenu.userPermission || { isWrite: 0, isEdit: 0, isDelete: 0 };

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      if (response.data.status) {
        setUsers(response.data.result);
      }
    } catch (error) {
      console.error('Failed to fetch users', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.delete(`/users/${id}`);
        fetchUsers(); // Refresh list
      } catch (error) {
        console.error('Failed to delete user', error);
        alert('Error deleting user');
      }
    }
  };

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email Address' },
    { key: 'phone', label: 'Phone Number' },
    {
      key: 'userType',
      label: 'Role',
      render: (row) => (
        <span className="px-sm py-xs bg-surface-container rounded-lg font-label-md text-on-surface-variant">
          {row.userTypeRole ? row.userTypeRole.userType : 'Unknown'}
        </span>
      )
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
        <div className="flex gap-sm">
          {permissions.isEdit === 1 && (
            <Link to={`/admin/users/edit/${row.id}`} className="p-xs text-primary hover:bg-surface-container rounded transition-colors">
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
    return <div className="p-xl text-center font-body-md">Loading users...</div>;
  }

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex justify-between items-center mb-lg">
        <div>
          <h2 className="font-headline-md text-headline-md text-on-surface">Manage Users</h2>
          <p className="font-body-md text-on-surface-variant mt-xs">View, search, and export system users.</p>
        </div>
        {permissions.isWrite === 1 && (
          <Link
            to="/admin/users/new"
            className="flex items-center gap-xs bg-primary text-on-primary hover:bg-primary-container px-md py-sm rounded-lg font-label-md transition-colors shadow-sm"
          >
            <Plus size={20} />
            Add User
          </Link>
        )}
      </div>

      <div className="flex-1 overflow-hidden">
        <DataTable columns={columns} data={users} exportFileName="LuxCare_Users" />
      </div>
    </div>
  );
};

export default UserList;
