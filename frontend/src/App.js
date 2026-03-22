import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Toast from './components/Toast';
import './i18n/index.js';

import Splash            from './pages/Splash';
import Welcome           from './pages/Welcome';
import MobileEntry       from './pages/auth/MobileEntry';
import OTPVerify         from './pages/auth/OTPVerify';
import Register          from './pages/auth/Register';
import KYCUpload         from './pages/kyc/KYCUpload';
import OwnerDashboard    from './pages/owner/OwnerDashboard';
import AddProperty       from './pages/owner/AddProperty';
import MyProperties      from './pages/owner/MyProperties';
import OwnerApplications from './pages/owner/OwnerApplications';
import OwnerBookings     from './pages/owner/OwnerBookings';
import OwnerChat         from './pages/owner/OwnerChat';
import TenantDashboard   from './pages/tenant/TenantDashboard';
import PropertySearch    from './pages/tenant/PropertySearch';
import PropertyDetail    from './pages/tenant/PropertyDetail';
import MyApplications    from './pages/tenant/MyApplications';
import TenantBookings    from './pages/tenant/TenantBookings';
import TenantChat        from './pages/tenant/TenantChat';
import PayAdvance        from './pages/tenant/PayAdvance';
import WriteReview       from './pages/tenant/WriteReview';
import AdminDashboard    from './pages/admin/AdminDashboard';
import KYCQueue          from './pages/admin/KYCQueue';
import ListingQueue      from './pages/admin/ListingQueue';
import EscrowPanel       from './pages/admin/EscrowPanel';
import UserManagement    from './pages/admin/UserManagement';
import DisputePanel      from './pages/admin/DisputePanel';

function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-blue-900">
      <p className="text-white text-lg">Loading...</p>
    </div>
  );
  if (!user) return <Navigate to="/welcome" />;
  if (role && user.role !== role) return <Navigate to="/welcome" />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/"              element={<Splash />} />
      <Route path="/welcome"       element={<Welcome />} />
      <Route path="/auth/mobile"   element={<MobileEntry />} />
      <Route path="/auth/otp"      element={<OTPVerify />} />
      <Route path="/auth/register" element={<Register />} />

      <Route path="/kyc/upload" element={<ProtectedRoute><KYCUpload /></ProtectedRoute>} />

      <Route path="/owner/dashboard"      element={<ProtectedRoute role="owner"><OwnerDashboard /></ProtectedRoute>} />
      <Route path="/owner/properties/add" element={<ProtectedRoute role="owner"><AddProperty /></ProtectedRoute>} />
      <Route path="/owner/properties"     element={<ProtectedRoute role="owner"><MyProperties /></ProtectedRoute>} />
      <Route path="/owner/applications"   element={<ProtectedRoute role="owner"><OwnerApplications /></ProtectedRoute>} />
      <Route path="/owner/bookings"       element={<ProtectedRoute role="owner"><OwnerBookings /></ProtectedRoute>} />
      <Route path="/owner/chat"           element={<ProtectedRoute role="owner"><OwnerChat /></ProtectedRoute>} />
      <Route path="/owner/chat/:appId"    element={<ProtectedRoute role="owner"><OwnerChat /></ProtectedRoute>} />

      <Route path="/tenant/dashboard"         element={<ProtectedRoute role="tenant"><TenantDashboard /></ProtectedRoute>} />
      <Route path="/tenant/search"            element={<ProtectedRoute role="tenant"><PropertySearch /></ProtectedRoute>} />
      <Route path="/tenant/property/:id"      element={<ProtectedRoute role="tenant"><PropertyDetail /></ProtectedRoute>} />
      <Route path="/tenant/applications"      element={<ProtectedRoute role="tenant"><MyApplications /></ProtectedRoute>} />
      <Route path="/tenant/bookings"          element={<ProtectedRoute role="tenant"><TenantBookings /></ProtectedRoute>} />
      <Route path="/tenant/chat"              element={<ProtectedRoute role="tenant"><TenantChat /></ProtectedRoute>} />
      <Route path="/tenant/chat/:appId"       element={<ProtectedRoute role="tenant"><TenantChat /></ProtectedRoute>} />
      <Route path="/tenant/pay/:id"           element={<ProtectedRoute role="tenant"><PayAdvance /></ProtectedRoute>} />
      <Route path="/tenant/review/:bookingId" element={<ProtectedRoute role="tenant"><WriteReview /></ProtectedRoute>} />

      <Route path="/admin/dashboard" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/kyc"       element={<ProtectedRoute role="admin"><KYCQueue /></ProtectedRoute>} />
      <Route path="/admin/listings"  element={<ProtectedRoute role="admin"><ListingQueue /></ProtectedRoute>} />
      <Route path="/admin/escrow"    element={<ProtectedRoute role="admin"><EscrowPanel /></ProtectedRoute>} />
      <Route path="/admin/users"     element={<ProtectedRoute role="admin"><UserManagement /></ProtectedRoute>} />
      <Route path="/admin/disputes"  element={<ProtectedRoute role="admin"><DisputePanel /></ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toast />
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}