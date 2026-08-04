const AdminDashboard = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <div className="w-full">
      <div className="mb-lg">
        <h2 className="font-headline-md text-headline-md text-on-surface mb-sm">Dashboard Overview</h2>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Welcome back to the admin panel, {user.email || 'Admin'}. Here's what's happening today.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
        {/* Stat Card 1 */}
        <div className="glass-card p-lg rounded-[24px]">
          <h3 className="font-label-md text-label-md text-on-surface-variant mb-xs">Total Patients</h3>
          <p className="font-display-lg text-display-lg text-primary">1,248</p>
        </div>
        
        {/* Stat Card 2 */}
        <div className="glass-card p-lg rounded-[24px]">
          <h3 className="font-label-md text-label-md text-on-surface-variant mb-xs">Appointments Today</h3>
          <p className="font-display-lg text-display-lg text-tertiary">42</p>
        </div>
        
        {/* Stat Card 3 */}
        <div className="glass-card p-lg rounded-[24px]">
          <h3 className="font-label-md text-label-md text-on-surface-variant mb-xs">Available Doctors</h3>
          <p className="font-display-lg text-display-lg text-secondary">18</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
