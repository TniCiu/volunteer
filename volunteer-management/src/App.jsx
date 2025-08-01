import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/appBar/menus/home/index.jsx';
import Activity from './components/appBar/menus/activity/index.jsx';
import ActivityDetail from './components/appBar/menus/activity/activityDetail/index.jsx';
import Registration from './pages/view/customer/registration/index.jsx';
import Login from './components/appBar/auth/login/index.jsx';
import SignUp from './components/appBar/auth/signUp/index.jsx';
import DonationPage from './components/appBar/menus/donation/index.jsx';
import Contact from './components/contact/index.jsx';
import { AuthProvider } from './components/appBar/auth/AuthContext';
import { SocketProvider } from './contexts/SocketContext';
import SocketStatus from './components/SocketStatus';
import ErrorBoundary from './components/ErrorBoundary';
import { ConfirmProvider } from 'material-ui-confirm';
import AdminDashboard from './pages/view/admin/dashboard/index.jsx';
import VolunteerManager from './pages/view/admin/dashboard/Volunteermanager/index.jsx';
import LeaderManager from './pages/view/admin/dashboard/leadermanager/index.jsx';
import TagManager from './pages/view/admin/dashboard/TagManager/index.jsx';
import ActivityManager from './pages/view/admin/dashboard/ActivityManager/index.jsx';
import RegistrationManager from './pages/view/admin/dashboard/RegistrationManager/index.jsx';
import ProtectedRoute from './components/appBar/auth/ProtectedRoute';
// Import time utilities for event date handling
import './utils/timeUtils';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <SocketProvider>
          <ConfirmProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/dang-nhap" element={<Login />} />
                <Route path="/dang-ky" element={<SignUp />} />
                <Route path="/hoat-dong" element={<Activity />} />
                <Route path="/hoat-dong/:id" element={<ActivityDetail />} />
                <Route path="/dang-ky-hoat-dong/:activityId" element={<Registration />} />
                <Route path="/quyen-gop" element={<DonationPage />} />
                <Route path="/admin/dashboard" element={
                  <ProtectedRoute requireAdmin={true}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/admin/volunteer-manager" element={
                  <ProtectedRoute requireAdmin={true}>
                    <VolunteerManager />
                  </ProtectedRoute>
                } />
                <Route path="/admin/leader-manager" element={
                  <ProtectedRoute requireAdmin={true}>
                    <LeaderManager />
                  </ProtectedRoute>
                } />
                <Route path="/admin/tag-manager" element={
                  <ProtectedRoute requireAdmin={true}>
                    <TagManager />
                  </ProtectedRoute>
                } />
                <Route path="/admin/activity-manager" element={
                  <ProtectedRoute requireAdmin={true}>
                    <ActivityManager />
                  </ProtectedRoute>
                } />
                <Route path="/admin/registration-manager" element={
                  <ProtectedRoute requireAdmin={true}>
                    <RegistrationManager />
                  </ProtectedRoute>
                } />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </BrowserRouter>
            <SocketStatus />
          </ConfirmProvider>
        </SocketProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
