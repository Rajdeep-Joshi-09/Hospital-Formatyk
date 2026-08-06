import { useState, useEffect } from 'react';
import { useOutletContext, useLocation } from 'react-router-dom';
import api from '../utils/api';
import DataTable from '../components/DataTable';

const InquiryList = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const { menus } = useOutletContext();
  const location = useLocation();
  const currentMenu = menus.find(m => m.listPageRoute === location.pathname) || {};
  const permissions = currentMenu.userPermission || { isWrite: 0, isEdit: 0, isDelete: 0 };

  const fetchInquiries = async () => {
    try {
      const response = await api.get('/inquiries');
      if (response.data.status) {
        setInquiries(response.data.result);
      }
    } catch (error) {
      console.error('Failed to fetch inquiries', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'phoneNumber', label: 'Phone' },
    {
      key: 'subject',
      label: 'Subject',
      render: (row) => row.subject?.subject || 'N/A'
    },
    { key: 'message', label: 'Message' },
    {
      key: 'createdDate',
      label: 'Date',
      render: (row) => new Date(row.createdDate).toLocaleDateString()
    }
  ];

  return (
    <div className="flex flex-col gap-lg animate-fade-in">
      <div className="flex justify-between items-center bg-surface p-lg rounded-2xl shadow-sm border border-outline-variant/30">
        <div>
          <h1 className="font-display-sm text-on-surface mb-xs">Inquiries</h1>
          <p className="font-body-md text-on-surface-variant">View patient inquiries and contact requests</p>
        </div>
      </div>

      <div className="bg-surface rounded-2xl shadow-sm border border-outline-variant/30 p-lg">
        {loading ? (
          <div className="flex justify-center p-xl">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <DataTable columns={columns} data={inquiries} searchPlaceholder="Search inquiries..." />
        )}
      </div>
    </div>
  );
};

export default InquiryList;
