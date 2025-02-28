import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");  // Check if user is logged in
  const role = localStorage.getItem("role");    // Get user role from localStorage

  if (!token) {
    return <Navigate to="/login" />;  // Redirect to login if not authenticated
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/" />;  // Redirect to home if role is not allowed
  }

  return children;  // If the user is logged in and has the right role, allow access
};

export default ProtectedRoute;
