import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../Context/useAuth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { isLoggedIn, getUserRole } = useAuth();
  const isAuthenticated = isLoggedIn();
  const userRole = getUserRole();

  if (!isAuthenticated) {
    // Not logged in, redirect to login
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(userRole || "")) {
    // Not authorized for this specific route, redirect to unauthorized
    return <Navigate to="/unauthorized" replace />;
  }

  // User is logged in and has permission
  return <>{children}</>;
};

export default ProtectedRoute;
