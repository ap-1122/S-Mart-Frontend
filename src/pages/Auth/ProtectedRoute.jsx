import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
    // 1. Storage se Token aur Role nikalo
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("role");

    // 2. Agar Token nahi hai -> Login par bhejo
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // 3. Agar Role match nahi karta -> Home par bhejo
    // Example: Agar allowedRoles=["ADMIN"] hai aur userRole="USER" hai
    if (allowedRoles && !allowedRoles.includes(userRole)) {
        return <Navigate to="/" replace />;
    }

    // 4. Sab sahi hai -> Page dikhao
    return children;
};

export default ProtectedRoute;