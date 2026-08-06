import { useState, useEffect } from 'react';
import { useOutletContext, useLocation } from 'react-router-dom';
import api from '../utils/api';
import DataTable from '../components/DataTable';

const PatientList = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const { menus } = useOutletContext();
  const location = useLocation();
  const currentMenu = menus.find(m => m.listPageRoute === location.pathname) || {};
  const permissions = currentMenu.userPermission || { isWrite: 0, isEdit: 0, isDelete: 0 };

  const fetchPatients = async () => {
    try {
      const response = await api.get('/patients');
      if (response.data.status) {
        setPatients(response.data.result);
      }
    } catch (error) {
      console.error('Failed to fetch patients', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'phone', label: 'Phone' },
    {
      key: 'createdDate',
      label: 'Registered On',
      render: (row) => new Date(row.createdDate).toLocaleDateString()
    }
  ];

  return (
    <div className="flex flex-col gap-lg animate-fade-in">
      <div className="flex justify-between items-center bg-surface p-lg rounded-2xl shadow-sm border border-outline-variant/30">
        <div>
          <h1 className="font-display-sm text-on-surface mb-xs">Patients</h1>
          <p className="font-body-md text-on-surface-variant">View registered patients</p>
        </div>
      </div>

      <div className="bg-surface rounded-2xl shadow-sm border border-outline-variant/30 p-lg">
        {loading ? (
          <div className="flex justify-center p-xl">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <DataTable columns={columns} data={patients} searchPlaceholder="Search patients..." />
        )}
      </div>
    </div>
  );
};

export default PatientList;
