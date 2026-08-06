import { useState, useEffect } from 'react';
import { useOutletContext, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { CheckCircle, XCircle } from 'lucide-react';
import api from '../utils/api';
import DataTable from '../components/DataTable';

const AppointmentList = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { menus } = useOutletContext();
  const location = useLocation();
  const currentMenu = menus.find(m => m.listPageRoute === location.pathname) || {};
  const permissions = currentMenu.userPermission || { isWrite: 1, isEdit: 1, isDelete: 1 };

  const fetchAppointments = async () => {
    try {
      const response = await api.get('/appointments');
      if (response.data.status) {
        setAppointments(response.data.result);
      }
    } catch (error) {
      console.error('Failed to fetch appointments', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadAppointments = async () => {
      setLoading(true);
      await fetchAppointments();
      setLoading(false);
    };

    loadAppointments();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      const response = await api.put(`/appointments/${id}/status`, { status });
      if (response.data.status) {
        toast.success(`Appointment ${status.toLowerCase()} successfully`);
        setAppointments((currentAppointments) =>
          currentAppointments.map((appointment) =>
            appointment.id === id ? { ...appointment, status } : appointment
          )
        );
        fetchAppointments();
      }
    } catch (error) {
      console.error(`Failed to update status to ${status}`, error);
      toast.error(`Error updating status: ${error.response?.data?.message || error.message}`);
    }
  };

  const columns = [
    { key: 'id', label: 'ID' },
    { 
      key: 'patient', 
      label: 'Patient Name',
      render: (row) => row.patient?.name || 'N/A'
    },
    { 
      key: 'doctor', 
      label: 'Doctor Name',
      render: (row) => row.doctor?.name || 'N/A'
    },
    { 
      key: 'appointmentDate', 
      label: 'Date',
      render: (row) => new Date(row.appointmentDate).toLocaleDateString()
    },
    { key: 'appointmentTime', label: 'Time' },
    { key: 'reason', label: 'Reason' },
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <span className={`px-sm py-xs rounded-lg font-label-md ${
          row.status === 'Approved' ? 'bg-[#E0F2E9] text-[#1D7A46]' : 
          row.status === 'Rejected' ? 'bg-error-container text-on-error-container' : 
          'bg-surface-container text-on-surface-variant'
        }`}>
          {row.status}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      render: (row) => (
        <div className="flex gap-sm">
          {permissions.isEdit === 1 && row.status === 'Pending' && (
            <>
              <button 
                onClick={() => handleStatusChange(row.id, 'Approved')} 
                className="p-xs text-[#1D7A46] hover:bg-[#E0F2E9] rounded transition-colors"
                title="Approve"
              >
                <CheckCircle size={18} />
              </button>
              <button 
                onClick={() => handleStatusChange(row.id, 'Rejected')} 
                className="p-xs text-error hover:bg-error-container rounded transition-colors"
                title="Reject"
              >
                <XCircle size={18} />
              </button>
            </>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="flex flex-col gap-lg animate-fade-in">
      <div className="flex justify-between items-center bg-surface p-lg rounded-2xl shadow-sm border border-outline-variant/30">
        <div>
          <h1 className="font-display-sm text-on-surface mb-xs">Appointments</h1>
          <p className="font-body-md text-on-surface-variant">Manage and approve appointments</p>
        </div>
      </div>

      <div className="bg-surface rounded-2xl shadow-sm border border-outline-variant/30 p-lg">
        {loading ? (
          <div className="flex justify-center p-xl">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <DataTable columns={columns} data={appointments} searchPlaceholder="Search appointments..." />
        )}
      </div>
    </div>
  );
};

export default AppointmentList;
