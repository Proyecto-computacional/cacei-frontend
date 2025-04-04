import { useState, useEffect } from "react";
import SelectRol from "./selectRole";
import axios from "axios";
import "../app.css"
import api from "../services/api";
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

    const [users, setUsers] = useState([]);
    const [nextPage, setNextPage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchUsers = async () => {
            const url = searchTerm
            ? `${API_URL}/api/usersadmin?search=${searchTerm}`
            : `${API_URL}/api/usersadmin`;
    
            try {
                const response = await api.get(url, {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem('token')}`,
                        "Content-Type": "application/json",
                    },
                });
    
                setUsers(response.data.usuarios.data);
                setNextPage(response.data.usuarios.next_page_url);
            } catch (error) {
                if (error.response) {
                    if (error.response.status === 403) {
                        alert("No tienes permisos para acceder a esta sección.");
                        window.location.href = "/PersonalConfig"; // Redirige al dashboard (*pending)
                    } else if (error.response.status === 401) {
                        alert("Sesión expirada. Inicia sesión de nuevo.");
                        window.location.href = "/login"; // Redirige a la página de login
                    } else {
                        alert("Error desconocido al obtener los usuarios.");
                    }
                } else {
                    alert("Error de conexión con el servidor.");
                }
                console.error("Error al obtener los usuarios:", error);
            }
        };
    
        fetchUsers(); 
    }, [searchTerm]);    

    const loadMore = () => {
        if (!nextPage) return;
        setLoading(true);

        axios.get(nextPage).then(({ data }) => {
            setUsers((prev) => [...prev, ...data.usuarios.data]);
            setNextPage(data.usuarios.next_page_url);
            setLoading(false);
        });
    };


    return (
        <div className="container mx-auto p-5 ">
            <h2 className="text-2xl font-bold mb-2">Lista de Usuarios</h2>
            <input type="" placeholder="RPE o Correo" className="bg-backgroundFrom text-2xl w-1/2 mb-3 p-1.5"  
            onChange={(e) => setSearchTerm(e.target.value)}/>

            <div className="overflow-x-auto overflow-y-scroll max-h-100" onScroll={(e) => {
                const bottom = e.target.scrollHeight - e.target.scrollTop <= e.target.clientHeight + 1;
                if (bottom && !loading) loadMore();
            }}>
                <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md table-fixed">
                    <thead className="sticky top-0 z-0">
                        <tr className="bg-primary1 text-white">
                            <th className="w-3/10 py-3 px-4 text-left">RPE</th>
                            <th className="w-4/10 py-3 px-4 text-left">Correo</th>
                            <th className="w-3/10 py-3 px-4 text-left">Rol</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length > 0 ? users.map((item) => (
                            <tr key={item.user_rpe} className="border-b hover:bg-gray-100">
                                <td className="py-3 px-4">{item.user_rpe}</td>
                                <td className="py-3 px-4">{item.user_mail}</td>
                                <td className="py-3 px-4">
                                    <SelectRol userId={item.user_rpe} initialRole={item.user_role} AllRoles={roles}></SelectRol>
                                </td>
                            </tr>
                        )):
                        <tr>
                            <td colSpan="3">
                                <p className="text-2xl text-neutral-500 text-center width-max my-2">No se encontaron usuarios</p>
                            </td>
                        </tr>
                    }
                    </tbody>
                </table>
            </div>
            <h2 className="text-2xl font-bold mb-1 mt-4">Lista de Roles</h2>
            <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
                <thead>
                    <tr className="bg-primary1 text-white">
                        <th className="py-3 px-4 text-left">Rol</th>
                        <th className="py-3 px-4 text-left">Permisos</th>
                    </tr>
                </thead>
                <tbody>
                    {roles.map((rol) => (
                        <tr key={rol.name} className="border-b hover:bg-gray-100">
                            <td className="py-3 px-4">{rol.name}</td>
                            <td className="py-3 px-4">{rol.description}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
