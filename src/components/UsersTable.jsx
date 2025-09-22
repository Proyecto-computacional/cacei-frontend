import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import SelectRol from "./selectRole";
import axios from "axios";
import "../app.css"
import api from "../services/api";
import { Search, Users, Shield, FileUser } from "lucide-react";
import LoadingSpinner from "./LoadingSpinner";
import PermissionsTable from "./permissionsTable";

const API_URL = import.meta.env.VITE_API_URL;

export default function UsersTable() {
    const [roles] = useState([
        { name: 'Administrador', description: 'Administración y visualización de todos los procesos de todos los procesos de acreditación' },
        { name: 'Directivo', description: 'Visualización de todos los procesos de todos los procesos de acreditación' },
        { name: 'Jefe de área', description: 'Administración y visualización de todos los procesos de los procesos de acreditación de su area' },
        { name: 'Coordinador de carrera', description: 'Administración y visualización de todos los procesos de los procesos de acreditación de su carrera' },
        { name: 'Profesor', description: 'Subir y visualizar las evidencias que se le asignen' },
        { name: 'Profesor responsable', description: 'Subir y visualizar sus evidencias y revisar las evidencias que se le asignen' },
        { name: 'Departamento de Apoyo', description: 'Subir y visualizar sus evidencias (Evidencias transversales)' },
        { name: 'Personal de apoyo', description: 'Subir y visualizar las evidencias que se les asigne' },
    ]);

    const [allUsers, setAllUsers] = useState([]);
    const [areas, setAreas] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [nextPage, setNextPage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedArea, setSelectedArea] = useState("-1");

    
    const fetchUsers = async () => {
        try {
            setLoading(true);
            const [responseUsers, responseAreas] = await Promise.all([
            api.get("/api/usersadmin", {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('token')}`,
                    "Content-Type": "application/json",
                },
            }),
            api.get("/api/areas", { // <-- Aquí tu segunda consulta
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    "Content-Type": "application/json",
                },
            })
        ]);

            setAllUsers(responseUsers.data.usuarios);
            setAreas(responseAreas.data);
        
            setFilteredUsers(responseUsers.data.usuarios);
            //setNextPage(responseUsers.data.usuarios.next_page_url);
        } catch (error) {
            if (error.response) {
                if (error.response.status === 403 ) {
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
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleSearch = () => {
        let filtered = allUsers;

        // Filtro por área
        if (selectedArea !== "-1") {
            filtered = filtered.filter(user => user.user_area === selectedArea);
        }

        // Filtro por término de búsqueda
        const trimmedSearch = searchTerm.trim().toLowerCase();
        if (trimmedSearch !== "") {
            filtered = filtered.filter(user =>
                user.user_rpe?.toLowerCase().includes(trimmedSearch) ||
                user.user_name?.toLowerCase().includes(trimmedSearch) ||
                user.user_mail?.toLowerCase().includes(trimmedSearch)
            );
        }

        setFilteredUsers(filtered);
    };

    useEffect(() => {
        handleSearch();
    }, [selectedArea, searchTerm]);

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

    // HTML --------------------------------------------------------------------------------------------
    return (
        <div className="container mx-auto p-5">
            <div className="flex justify-between items-end mb-8">
                <div className="flex items-center gap-3 w-1/2">
                    <div className="bg-[#004A98] p-2 rounded-lg">
                        <Users className="h-6 w-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">
                        Lista de Usuarios
                    </h2>
                </div>
                <div className="flex flex-col">
                    <label className="p-2">Filtrar por área</label>
                    <select className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004A98] focus:border-transparent w-fit"
                            value={selectedArea}
                            onChange={(e) => setSelectedArea(e.target.value)}
                            >
                        <option value="-1">Seleccionar área</option>
                        {areas.map(area =>(
                            <option key={area.area_id} value={area.area_id}>{area.area_name}</option>
                        ))}
                    </select>
                </div>
                <div className="relative">
                    <label className="p-2">Buscar</label>
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input 
                        type="text" 
                        placeholder="Buscar por RPE, nombre o correo..." 
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004A98] focus:border-transparent w-96"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="overflow-x-auto overflow-y-scroll max-h-[600px] rounded-lg shadow-sm border border-gray-200">
                <table className="min-w-full bg-white">
                    <thead className="sticky top-0 z-0">
                        <tr className="bg-primary1 text-white">
                            <th className="py-4 px-6 text-left font-semibold">RPE</th>
                            <th className="py-4 px-6 text-left font-semibold">Nombre</th>
                            <th className="py-4 px-6 text-left font-semibold">Correo</th>
                            <th className="py-4 px-6 text-left font-semibold">Rol</th>
                            <th className="py-4 px-6 text-left font-semibold">Area</th>
                            <th className="py-4 px-6 text-left font-semibold">CV</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="6" className="py-8">
                                    <div className="flex justify-center">
                                        <LoadingSpinner />
                                    </div>
                                </td>
                            </tr>
                        ) : filteredUsers.length > 0 ? filteredUsers.map((item) => (
                            <tr key={item.user_rpe} className="border-b hover:bg-gray-50 transition-colors duration-200">
                                <td className="py-4 px-6">{item.user_rpe}</td>
                                <td className="py-4 px-6 font-medium">{item.user_name || 'No especificado'}</td>
                                <td className="py-4 px-6 text-gray-600">{item.user_mail}</td>
                                <td className="py-4 px-6">
                                    <SelectRol userId={item.user_rpe} initialRole={item.user_role} AllRoles={roles} />
                                </td>
                                <td className="py-4 px-6 text-gray-600">{item.area.area_name || 'No especificado'}</td>
                                <td className="py-4 px-6">
                                    <Link to={`/personalInfo/${item.user_rpe}`}>
                                        <div className="bg-[#004A98] p-2 rounded-lg w-fit cursor-pointer">
                                            <FileUser className="h-6 w-6 text-white"/>
                                        </div>
                                    </Link>
                                </td>
                            </tr>
                        )) :
                        <tr>
                            <td colSpan="6" className="py-8 text-center">
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

            <PermissionsTable/>
        </div>
    );
}
