import { useState, useEffect } from "react";
import SelectRol from "./selectRole";
import axios from "axios";
import "../app.css"
import api from "../services/api";
import { Search, Users, Shield } from "lucide-react";
const API_URL = import.meta.env.VITE_API_URL;

export default function UsersTable() {
    const [roles] = useState([
        { name: 'Administrador', description: 'Administración y visualización de todos los procesos de todos los procesos de acreditación' },
        { name: 'Directivo', description: 'visualización de todos los procesos de todos los procesos de acreditación' },
        { name: 'Jefe de área', description: 'Administración y visualización de todos los procesos de los procesos de acreditación de su area' },
        { name: 'Coordinador de carrera', description: 'Administración y visualización de todos los procesos de los procesos de acreditación de su carrera' },
        { name: 'Profesor', description: 'Subir y visualizar las evidencias que se le asignen' },
        { name: 'Profesor responsable', description: 'Subir y visualizar sus evidencias y revisar las evidencias que se le asignen' },
        { name: 'Departamento universitario', description: 'Subir y visualizar sus evidencias (Evidencias transversales)' },
        { name: 'Personal de apoyo', description: 'Subir y visualizar las evidencias que se les asigne' },
    ]);

    const [allUsers, setAllUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [nextPage, setNextPage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchUsers = async () => {
        try {
            const response = await api.get("/api/usersadmin", {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('token')}`,
                    "Content-Type": "application/json",
                },
            });

            setAllUsers(response.data.usuarios.data);
            setFilteredUsers(response.data.usuarios.data);
            setNextPage(response.data.usuarios.next_page_url);
        } catch (error) {
            if (error.response) {
                if (error.response.status === 403) {
                    alert("No tienes permisos para acceder a esta sección.");
                    window.location.href = "/PersonalConfig";
                } else if (error.response.status === 401) {
                    alert("Sesión expirada. Inicia sesión de nuevo.");
                    window.location.href = "/";
                } else {
                    alert("Error desconocido al obtener los usuarios.");
                }
            } else {
                alert("Error de conexión con el servidor.");
            }
            console.error("Error al obtener los usuarios:", error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleSearch = (value) => {
        setSearchTerm(value);
        
        if (!value.trim()) {
            setFilteredUsers(allUsers);
            return;
        }

        const searchLower = value.toLowerCase();
        const filtered = allUsers.filter(user => 
            user.user_rpe.toLowerCase().includes(searchLower) ||
            (user.user_name && user.user_name.toLowerCase().includes(searchLower)) ||
            (user.user_mail && user.user_mail.toLowerCase().includes(searchLower))
        );
        
        setFilteredUsers(filtered);
    };

    const loadMore = () => {
        if (!nextPage) return;
        setLoading(true);

        axios.get(nextPage).then(({ data }) => {
            const newUsers = data.usuarios.data;
            setAllUsers(prev => [...prev, ...newUsers]);
            setFilteredUsers(prev => [...prev, ...newUsers]);
            setNextPage(data.usuarios.next_page_url);
            setLoading(false);
        });
    };

    return (
        <div className="container mx-auto p-5">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="bg-[#004A98] p-2 rounded-lg">
                        <Users className="h-6 w-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">
                        Lista de Usuarios
                    </h2>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input 
                        type="text" 
                        placeholder="Buscar por RPE, nombre o correo..." 
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004A98] focus:border-transparent w-96"
                        value={searchTerm}
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="overflow-x-auto overflow-y-scroll max-h-[600px] rounded-lg shadow-sm border border-gray-200">
                <table className="min-w-full bg-white">
                    <thead className="sticky top-0 z-0">
                        <tr className="bg-[#004A98] text-white">
                            <th className="py-4 px-6 text-left font-semibold">RPE</th>
                            <th className="py-4 px-6 text-left font-semibold">Nombre</th>
                            <th className="py-4 px-6 text-left font-semibold">Correo</th>
                            <th className="py-4 px-6 text-left font-semibold">Rol</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.length > 0 ? filteredUsers.map((item) => (
                            <tr key={item.user_rpe} className="border-b hover:bg-gray-50 transition-colors duration-200">
                                <td className="py-4 px-6">{item.user_rpe}</td>
                                <td className="py-4 px-6 font-medium">{item.user_name || 'No especificado'}</td>
                                <td className="py-4 px-6 text-gray-600">{item.user_mail}</td>
                                <td className="py-4 px-6">
                                    <SelectRol userId={item.user_rpe} initialRole={item.user_role} AllRoles={roles} />
                                </td>
                            </tr>
                        )) :
                        <tr>
                            <td colSpan="4" className="py-8 text-center">
                                <div className="flex flex-col items-center text-gray-500">
                                    <Users className="h-12 w-12 mb-3 text-gray-400" />
                                    <p className="text-lg font-medium">No se encontraron usuarios</p>
                                    <p className="text-sm">Intenta con otros términos de búsqueda</p>
                                </div>
                            </td>
                        </tr>
                        }
                    </tbody>
                </table>
            </div>

            <div className="mt-8">
                <div className="flex items-center gap-3 mb-4">
                    <div className="bg-[#004A98] p-2 rounded-lg">
                        <Shield className="h-6 w-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">
                        Lista de Roles
                    </h2>
                </div>
                <div className="overflow-x-auto rounded-lg shadow-sm border border-gray-200">
                    <table className="min-w-full bg-white">
                        <thead>
                            <tr className="bg-[#004A98] text-white">
                                <th className="py-4 px-6 text-left font-semibold">Rol</th>
                                <th className="py-4 px-6 text-left font-semibold">Permisos</th>
                            </tr>
                        </thead>
                        <tbody>
                            {roles.map((rol) => (
                                <tr key={rol.name} className="border-b hover:bg-gray-50 transition-colors duration-200">
                                    <td className="py-4 px-6 font-medium">{rol.name}</td>
                                    <td className="py-4 px-6 text-gray-600">{rol.description}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
