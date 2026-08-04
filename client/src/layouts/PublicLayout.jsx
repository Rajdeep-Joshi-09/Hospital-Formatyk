import { Outlet, Navigate } from 'react-router-dom';

const PublicLayout = () => {
  const token = localStorage.getItem('accessToken');

  if (token) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <div className="public-layout">
      {/* Header for public pages */}
      <main>
        <Outlet />
      </main>
      {/* Footer for public pages */}
    </div>
  );
};

export default PublicLayout;
