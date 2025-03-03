import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api', // Ajusta la URL
});

export const login = async (rpe, password) => {
    try {
        //Peticion post a localhost/api/login
        const response = await api.post('/login', { rpe, password });
        //Correct = login exitoso
        if (response.data.correct) {
            //Variables globales de usuario (no definitivas)
            localStorage.setItem('role', response.data.role);
            localStorage.setItem('name', response.data.name);
            localStorage.setItem('rpe', rpe);
            const token = response.data.token;
            localStorage.setItem('token', token);
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
        //Retornar si el login fue exitoso para controlar navegacion.
        return response.data.correct;
    } catch (error) {
        console.error('Error en login:', error.response?.data || error.message);
        throw error; // Lanza el error para que el componente lo maneje (pendiente de revisar)
    }

};

export const logout = async () => {
    await api.post('/logout');
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    delete api.defaults.headers.common['Authorization'];
};
