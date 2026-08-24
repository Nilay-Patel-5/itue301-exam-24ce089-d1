import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

/**
 * ProtectedRoute
 * @param {string[]} allowedRoles - optional array e.g. ['member'], ['trainer'], ['admin']
 *   If omitted, any authenticated user is allowed.
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { token, role } = useContext(AuthContext);

  // Not logged in → redirect to login
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // Logged in but wrong role → redirect to their home
  if (allowedRoles && !allowedRoles.includes(role)) {
    const roleHome = {
      member:  '/classes',
      trainer: '/trainer/dashboard',
      admin:   '/admin',
    };
    return <Navigate to={roleHome[role] || '/'} replace />;
  }

  return children;
};

export default ProtectedRoute;
