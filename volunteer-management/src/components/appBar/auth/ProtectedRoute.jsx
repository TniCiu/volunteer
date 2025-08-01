import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, isAdminOrLeader } = useAuth();

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/dang-nhap" replace />;
  }

  // If admin access is required but user is not admin/leader, redirect to home
  if (requireAdmin && !isAdminOrLeader()) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute; 