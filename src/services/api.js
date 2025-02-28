import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api', // Ajusta la URL
});

export const login = async (rpe, password) => {
    const response = await api.post('/login', { rpe, password });
    const token = response.data.token;
    localStorage.setItem('token', token);
    localStorage.setItem('role', response.data.user.role);
    localStorage.setItem('rpe', response.data.user.rpe);
    localStorage.setItem('email', response.data.user.email);
    localStorage.setItem('name', response.data.user.name);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    return response.data;
};

export const getAdminData = async () => {
    const response = await api.get('/admin');
    return response.data;
};

export const getDashboardData = async () => {
    const response = await api.get('/dashboard');
    return response.data;
};