import React from "react";
import { BrowserRouter as Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('role');
    console.log(token, userRole);

    if (!token) {
        return <Navigate to="/login" />;
    }

    if (allowedRoles && Array.isArray(allowedRoles) && !allowedRoles.includes(userRole)) {
        return <Navigate to="/mainmenu" />; //Pagina por defecto
    }
    // Si no hay roles específicos, permitir acceso con token válido
    return children;
};

export default ProtectedRoute;
