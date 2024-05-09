// ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthProvider'; // Adjust the import path based on where AuthProvider is located

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>; // Optional: Replace with a spinner or other loading indicator
    }

    return user ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;