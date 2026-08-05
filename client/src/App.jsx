import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import PublicLayout from './layouts/PublicLayout';
import ProtectedLayout from './layouts/ProtectedLayout';
import ClientLayout from './layouts/ClientLayout';
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
import DoctorList from './pages/DoctorList';
import DoctorForm from './pages/DoctorForm';
import TreatmentTypeList from './pages/TreatmentTypeList';
import TreatmentTypeForm from './pages/TreatmentTypeForm';
import SpecialitiesList from './pages/SpecialitiesList';
import SpecialitiesForm from './pages/SpecialitiesForm';
import SubjectList from './pages/SubjectList';
import SubjectForm from './pages/SubjectForm';

// Client pages
import HomePage from './pages/client/HomePage';
import AboutPage from './pages/client/AboutPage';
import ExpertsPage from './pages/client/ExpertsPage';
import ExpertDetailPage from './pages/client/ExpertDetailPage';
import SpecialitiesPage from './pages/client/SpecialitiesPage';
import SpecialityDetailPage from './pages/client/SpecialityDetailPage';
import ContactPage from './pages/client/ContactPage';
import BookAppointmentPage from './pages/client/BookAppointmentPage';

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
        {/* Client-facing public pages */}
        <Route element={<ClientLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/experts" element={<ExpertsPage />} />
          <Route path="/experts/:id" element={<ExpertDetailPage />} />
          <Route path="/specialities" element={<SpecialitiesPage />} />
          <Route path="/specialities/:id" element={<SpecialityDetailPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/book-appointment" element={<BookAppointmentPage />} />
        </Route>

        {/* Login page */}
        <Route element={<PublicLayout />}>
          <Route path="/login" element={<Login />} />
        </Route>
        
        {/* Admin panel */}
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
          
          <Route path="doctors" element={<DoctorList />} />
          <Route path="doctors/new" element={<DoctorForm />} />
          <Route path="doctors/edit/:id" element={<DoctorForm />} />
          
          <Route path="treatment-types" element={<TreatmentTypeList />} />
          <Route path="treatment-types/new" element={<TreatmentTypeForm />} />
          <Route path="treatment-types/edit/:id" element={<TreatmentTypeForm />} />
          
          <Route path="specialities" element={<SpecialitiesList />} />
          <Route path="specialities/new" element={<SpecialitiesForm />} />
          <Route path="specialities/edit/:id" element={<SpecialitiesForm />} />
          
          <Route path="subjects" element={<SubjectList />} />
          <Route path="subjects/new" element={<SubjectForm />} />
          <Route path="subjects/edit/:id" element={<SubjectForm />} />
          
          <Route path="permissions" element={<RolePermissionForm />} />
          <Route path="permissions/:userTypeId" element={<RolePermissionForm />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
