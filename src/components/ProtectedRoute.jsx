import { Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../services/api';
import PersonalConfig from "../pages/PersonalConfig";

const ProtectedRoute = ({ children, allowedRoles }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const token = localStorage.getItem('token');

    if (!token) {
        return <Navigate to="/" />;
    }

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await api.get('/api/user');
                setUser(response.data);
            } catch (error) {
                console.error('Error fetching user:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchUser();
    }, []);

    // Show loading state while fetching user data
    if (isLoading) {
        return <div>Loading...</div>;
    }

    // If user data is not available, redirect to login
    if (!user) {
        return <Navigate to="/" />;
    }


    const userRole = user.user_role;
    // Si hay roles específicos y el usuario no los tiene, redirigir
    if (allowedRoles && Array.isArray(allowedRoles) && !allowedRoles.includes(userRole)) {
        return <Navigate to="/personalConfig" />;
    }

    // Si no hay roles específicos, permitir acceso con token válido
    return children;
};

export default ProtectedRoute;