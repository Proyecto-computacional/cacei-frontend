import React from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../services/api';

const Logout = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return <button onClick={handleLogout}>Cerrar Sesión</button>;
};

export default Logout;