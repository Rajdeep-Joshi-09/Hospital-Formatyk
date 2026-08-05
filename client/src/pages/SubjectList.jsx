import { useState, useEffect } from 'react';
import { Link, useOutletContext, useLocation } from 'react-router-dom';
import { Plus, Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api';
import DataTable from '../components/DataTable';

const SubjectList = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const { menus: layoutMenus } = useOutletContext();
  const location = useLocation();
  const currentMenu = layoutMenus.find(m => m.listPageRoute === location.pathname) || {};
  const permissions = currentMenu.userPermission || { isWrite: 0, isEdit: 0, isDelete: 0 };

  const fetchSubjects = async () => {
    try {
      const response = await api.get('/subjects');
      if (response.data.status) {
        setSubjects(response.data.result);
      }
    } catch (error) {
      console.error('Failed to fetch subjects', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const handleDelete = (id) => {
    toast((t) => (
      <div className="flex flex-col gap-xs">
        <p className="font-body-md m-0">Are you sure you want to delete this subject?</p>
        <div className="flex gap-sm justify-end mt-2">
          <button 
            className="px-md py-xs bg-error text-on-error rounded-md text-sm font-label-md"
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                await api.delete(`/subjects/${id}`);
                fetchSubjects();
                toast.success('Deleted successfully');
              } catch (error) {
                console.error('Failed to delete subject', error);
                toast.error(error.response?.data?.message || 'Error deleting subject');
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
    { key: 'subjects', label: 'Subject Name' },
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
            <Link to={`/admin/subjects/edit/${row.id}`} className="p-xs text-primary hover:bg-surface-container rounded transition-colors">
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
    return <div className="p-xl text-center font-body-md">Loading subjects...</div>;
  }

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex justify-between items-center mb-lg">
        <div>
          <h2 className="font-headline-md text-headline-md text-on-surface">Manage Subjects</h2>
          <p className="font-body-md text-on-surface-variant mt-xs">View, search, and manage subjects.</p>
        </div>
        {permissions.isWrite === 1 && (
          <Link 
            to="/admin/subjects/new" 
            className="flex items-center gap-xs bg-primary text-on-primary hover:bg-primary-container px-md py-sm rounded-lg font-label-md transition-colors shadow-sm"
          >
            <Plus size={20} />
            Add Subject
          </Link>
        )}
      </div>

      <div className="flex-1 overflow-hidden">
        <DataTable columns={columns} data={subjects} exportFileName="LuxCare_Subjects" />
      </div>
    </div>
  );
};

export default SubjectList;
