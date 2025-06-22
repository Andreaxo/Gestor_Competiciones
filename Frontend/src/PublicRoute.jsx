import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from './IsAuthenticated.jsx';

function PublicRoute({ children }) {
  if (isAuthenticated()) {
    return <Navigate to="/competencias" replace />;
  }
  return children;
}

export default PublicRoute;