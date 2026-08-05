import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import PublicLayout from './layouts/PublicLayout';
import ProtectedLayout from './layouts/ProtectedLayout';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import UserList from './pages/UserList';
import UserForm from './pages/UserForm';
import MenuList from './pages/MenuList';
import MenuForm from './pages/MenuForm';
import UserTypeList from './pages/UserTypeList';
import UserTypeForm from './pages/UserTypeForm';
import RolePermissionForm from './pages/RolePermissionForm';
import ExpertiesList from './pages/ExpertiesList';
import ExpertiesForm from './pages/ExpertiesForm';
import LanguageList from './pages/LanguageList';
import LanguageForm from './pages/LanguageForm';

function App() {
  return (
    <BrowserRouter>
      <Toaster 
        position="top-center"
        toastOptions={{
          style: {
            background: '#333',
            color: '#fff',
          }
        }}
      />
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
          
          <Route path="menus" element={<MenuList />} />
          <Route path="menus/new" element={<MenuForm />} />
          <Route path="menus/edit/:id" element={<MenuForm />} />
          
          <Route path="user-types" element={<UserTypeList />} />
          <Route path="user-types/new" element={<UserTypeForm />} />
          <Route path="user-types/edit/:id" element={<UserTypeForm />} />
          
          <Route path="experties" element={<ExpertiesList />} />
          <Route path="experties/new" element={<ExpertiesForm />} />
          <Route path="experties/edit/:id" element={<ExpertiesForm />} />
          
          <Route path="languages" element={<LanguageList />} />
          <Route path="languages/new" element={<LanguageForm />} />
          <Route path="languages/edit/:id" element={<LanguageForm />} />
          
          <Route path="permissions" element={<RolePermissionForm />} />
          <Route path="permissions/:userTypeId" element={<RolePermissionForm />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
