import React from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../services/api';
import '../app.css'

const Logout = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    return <button className="flex items-center justify-center bg-[#004A98] text-white shadow w-55 h-7 cursor-pointer" onClick={handleLogout}>Cerrar Sesión</button>;
};

export default Logout;