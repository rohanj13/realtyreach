import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../Context/useAuth";

type Props = {
  children: React.ReactNode;
  allowedRoles: string[]; // Array of allowed roles for the route
};

const ProtectedRoute = ({ children, allowedRoles }: Props) => {
  const location = useLocation();
  const { isLoggedIn, getUserRole } = useAuth(); // Assume getUserRole gets the role from JWT

  const userRole = getUserRole();

  if (!isLoggedIn() || userRole === null) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(userRole)) {
    // Redirect to unauthorized page or homepage if role is not allowed
    return <Navigate to="/unauthorized" replace />;
  }

  // If authenticated and role is allowed, render the children
  return <>{children}</>;
};

export default ProtectedRoute;
