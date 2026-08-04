import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout';
import ProtectedLayout from './layouts/ProtectedLayout';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import UserList from './pages/UserList';
import UserForm from './pages/UserForm';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
        </Route>
        
        <Route path="/admin" element={<ProtectedLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<UserList />} />
          <Route path="users/new" element={<UserForm />} />
          <Route path="users/edit/:id" element={<UserForm />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
