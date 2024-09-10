import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './Auth';
import { useAuth0 } from '@auth0/auth0-react';

interface ProtectedRouteProps {
    children: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { isAuthenticated } = useAuth0();
    const location = useLocation();

    if (!isAuthenticated) {
        // Redirect them to the login page, but save the current location they were trying to go to
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    return children;
};

export default ProtectedRoute;
