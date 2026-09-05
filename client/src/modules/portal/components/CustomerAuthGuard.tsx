import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { customerAuth } from '../services/portal.service';

interface Props {
  children: React.ReactNode;
}

export const CustomerAuthGuard: React.FC<Props> = ({ children }) => {
  const token = customerAuth.getToken();
  const location = useLocation();

  if (!token) {
    return <Navigate to="/customer/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
