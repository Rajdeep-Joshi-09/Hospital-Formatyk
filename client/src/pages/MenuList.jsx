import { useState, useEffect } from 'react';
import { Link, useOutletContext, useLocation } from 'react-router-dom';
import { Plus, Edit, Trash2 } from 'lucide-react';
import api from '../utils/api';
import DataTable from '../components/DataTable';

const MenuList = () => {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const { menus: layoutMenus } = useOutletContext();
  const location = useLocation();
  const currentMenu = layoutMenus.find(m => m.listPageRoute === location.pathname) || {};
  const permissions = currentMenu.userPermission || { isWrite: 0, isEdit: 0, isDelete: 0 };

  const fetchMenus = async () => {
    try {
      const response = await api.get('/menus');
      if (response.data.status) {
        setMenus(response.data.result);
      }
    } catch (error) {
      console.error('Failed to fetch menus', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this menu?')) {
      try {
        await api.delete(`/menus/${id}`);
        fetchMenus(); // Refresh list
      } catch (error) {
        console.error('Failed to delete menu', error);
        alert(error.response?.data?.message || 'Error deleting menu');
      }
    }
  };

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'menuName', label: 'Menu Name' },
    { key: 'pageName', label: 'Page Name', render: (row) => row.pageName || '-' },
    { key: 'sortOrder', label: 'Sort Order' },
    { 
      key: 'parentId', 
      label: 'Parent',
      render: (row) => row.parent ? row.parent.menuName : <span className="text-on-surface-variant italic">None (Root)</span>
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
            <Link to={`/admin/menus/edit/${row.id}`} className="p-xs text-primary hover:bg-surface-container rounded transition-colors">
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
    return <div className="p-xl text-center font-body-md">Loading menus...</div>;
  }

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex justify-between items-center mb-lg">
        <div>
          <h2 className="font-headline-md text-headline-md text-on-surface">Manage Menus</h2>
          <p className="font-body-md text-on-surface-variant mt-xs">View, search, and manage application navigation menus.</p>
        </div>
        {permissions.isWrite === 1 && (
          <Link 
            to="/admin/menus/new" 
            className="flex items-center gap-xs bg-primary text-on-primary hover:bg-primary-container px-md py-sm rounded-lg font-label-md transition-colors shadow-sm"
          >
            <Plus size={20} />
            Add Menu
          </Link>
        )}
      </div>

      <div className="flex-1 overflow-hidden">
        <DataTable columns={columns} data={menus} exportFileName="LuxCare_Menus" />
      </div>
    </div>
  );
};

export default MenuList;
