import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [userRole, setUserRole] = useState(localStorage.getItem('role') || null);

  useEffect(() => {
    const checkAuthentication = () => {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('id');
      const role = localStorage.getItem('role');
      console.log('AuthContext - Checking authentication:');
      console.log('Token exists:', !!token);
      console.log('User ID exists:', !!userId);
      console.log('User role:', role);
      setIsAuthenticated(!!token && !!userId);
      setUserRole(role);
    };

    checkAuthentication();
    
    // Listen for storage changes
    const handleStorageChange = () => {
      checkAuthentication();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const login = (userData = null) => {
    console.log('AuthContext - Login called');
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('id');
    const role = localStorage.getItem('role');
    console.log('AuthContext - Token:', !!token, 'User ID:', !!userId, 'Role:', role);
    setIsAuthenticated(!!token && !!userId);
    setUserRole(role);
  };

  const logout = () => {
    console.log('AuthContext - Logout called');
    localStorage.removeItem('token');
    localStorage.removeItem('id');
    localStorage.removeItem('role');
    setIsAuthenticated(false);
    setUserRole(null);
  };

  const isAdminOrLeader = () => {
    return userRole === 'admin' || userRole === 'leader';
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      userRole, 
      login, 
      logout, 
      isAdminOrLeader 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);