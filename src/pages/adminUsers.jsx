import React, { useEffect, useState } from 'react';
import { getAdminData } from '../services/api';

const AdminDashboard = () => {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getAdminData();
                setData(response.message);
            } catch (err) {
                setError('No tienes permisos o hubo un error');
            }
        };
        fetchData();
    }, []);

    return (
        <div>
            <h2>Dashboard de Administrador</h2>
            {data ? <p>{data}</p> : <p>Cargando...</p>}
            {error && <p>{error}</p>}
        </div>
    );
};

export default AdminDashboard;