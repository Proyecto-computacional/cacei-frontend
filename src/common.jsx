import React, { useState, useEffect } from "react";
import './app.css';
import headerLogo from './assets/headerLogo.png';
import headerImg from './assets/headerImage.png';
import { useNavigate, useParams } from "react-router-dom";
import Logout from "./components/logout";
import NotificationsTable from "./components/NotificationTable";
import { Mail, Bell, User, Menu } from "lucide-react";
import { useLocation } from "react-router-dom";
import api from "./services/api";


export function AppHeader() {
    return (
        <header>
            
        </header>
    );
}

export function AppFooter() {
    return (
        <div></div>
    );
}

export function SubHeading() {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false); // Estado para controlar el menú
    const [viewNotifications, setViewNotifications] = useState(false)
    const location = useLocation();
    const userRole = localStorage.getItem("role") || "Usuario";
    const pathnames = location.pathname.split("/").filter((x) => x);
    const { evidence_id } = useParams();

    const breadcrumbMap = {
        mainmenu: "Inicio",
        personalInfo: "Configuración Personal",
        uploadEvidence: "Carga de Evidencias",
        usersAdmin: "Administración de Usuarios",
        ReviewEvidence: "Revisión de Evidencias",
        framesAdmin: "Gestión de Formato",
        evidenceManagement: "Gestión de Evidencias",
        notifications: "Notificaciones"
    };

    const [processName, setProcessName] = useState("");

    useEffect(() => {
        const fetchProcessName = async () => {
            if (pathnames.includes('uploadEvidence') || pathnames.includes('evidenceManagement')) {
                try {
                    const processId = localStorage.getItem('currentProcessId');
                    if (processId) {
                        const response = await api.get(`/api/processes/${processId}`);
                        setProcessName(response.data.process_name);
                    }
                } catch (error) {
                    console.error('Error fetching process name:', error);
                }
            }
        };
        fetchProcessName();
    }, [pathnames]);

    return (
        <div className="w-full bg-transparent">
            <div className="flex justify-between items-center p-3  space-x-4 border-b-3 bg-[#e1e5eb]">
                <div className="flex">
                    <div className="relative">
                        <button onClick={() => setOpen(!open)} className="w-6 h-6 text-black">
                            <Menu />
                        </button>
                        {/* obtener el id del usuario activo (local storage?) y pasarlo al main menu como prop*/}
                        {open && (
                            <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                                <ul className="py-2">
                                    
                                    
                                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                        onClick={() => { navigate("/uploadEvidence"); setOpen(false); }} >
                                        Carga de evidencias
                                    </li>
                                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                        onClick={() => { navigate("/usersAdmin"); setOpen(false); }}>
                                        Administración de usuarios
                                    </li>
                                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                        onClick={() => { navigate("/ReviewEvidence"); setOpen(false); }} >
                                        Revisión de evidencias
                                    </li>
                                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                        onClick={() => { navigate("/framesAdmin"); setOpen(false); }}>
                                        Gestión de formato
                                    </li>
                                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                        onClick={() => { navigate("/evidenceManagement"); setOpen(false); }} >
                                        Asignación de tareas
                                    </li>
                                    
                                </ul>
                            </div>
                        )}
                    </div>

                    <div className="ml-12 flex items-center">
                        {pathnames.includes('mainmenu') ? (
                            <span className="text-[#00B2E3] text-lg font-medium">Inicio</span>
                        ) : pathnames.includes('dash') ? (
                            <>
                                <span 
                                    className="text-[#00B2E3] text-lg font-medium hover:text-[#0088b3] transition-colors duration-200 cursor-pointer" 
                                    onClick={() => navigate('/mainmenu')}
                                >
                                    Inicio
                                </span>
                                <span className="mx-0.5 text-gray-400 text-lg">/</span>
                                <span className="text-[#00B2E3] text-lg font-medium">Dashboard</span>
                            </>
                        ) : (
                            <>
                                <span 
                                    className="text-[#00B2E3] text-lg font-medium hover:text-[#0088b3] transition-colors duration-200 cursor-pointer" 
                                    onClick={() => {
                                        const processId = localStorage.getItem('currentProcessId');
                                        if (processId) {
                                            navigate(`/dash/${processId}`);
                                        } else {
                                            navigate('/mainmenu');
                                        }
                                    }}
                                >
                                    Inicio
                                </span>
                                {pathnames.map((value, index) => {
                                    const to = "/" + pathnames.slice(0, index + 1).join("/");
                                    if (!isNaN(value)) return null;
                                    return (
                                        <span key={to} className="flex items-center">
                                            <span className="mx-0.5 text-gray-400 text-lg">/</span>
                                            <span
                                                className="text-[#00B2E3] text-lg font-medium hover:text-[#0088b3] transition-colors duration-200 cursor-pointer"
                                                onClick={() => navigate(to)}
                                            >
                                                {breadcrumbMap[value] || value}
                                            </span>
                                            {processName && (value === 'uploadEvidence' || value === 'evidenceManagement') && (
                                                <>
                                                    <span className="mx-0.5 text-gray-400 text-lg">/</span>
                                                    <span className="text-[#00B2E3] text-lg font-medium">
                                                        {processName}
                                                    </span>
                                                </>
                                            )}
                                        </span>
                                    );
                                })}
                                {pathnames.includes('uploadEvidence') && evidence_id && (
                                    <>
                                        <span className="mx-0.5 text-gray-400 text-lg">/</span>
                                        <span className="text-[#00B2E3] text-lg font-medium">
                                            {evidence_id}
                                        </span>
                                    </>
                                )}
                            </>
                        )}
                    </div>

                </div>


                <div className="flex items-center space-x-4">
                    <a href="https://mail.google.com" target="_blank" rel="noopener noreferrer">
                        <Mail className="w-5 h-5 text-black cursor-pointer" />
                    </a>
                    <div className="relative inline-block">
                        <button onClick={() => navigate("/notifications")} onMouseEnter={() => setViewNotifications(true)}>
                            <Bell className="w-5 h-5 text-black cursor-pointer" ></Bell>
                        </button>
                        {viewNotifications && (
                            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-fit bg-white border border-gray-200 rounded-lg shadow-lg z-50"
                                onMouseEnter={() => setViewNotifications(true)}
                                onMouseLeave={() => setViewNotifications(false)}>
                                <NotificationsTable />
                            </div>
                        )}
                    </div>

                    <button onClick={() => navigate("/personalInfo")} className="flex items-center justify-center bg-yellow-500 text-white shadow w-55 h-7 cursor-pointer">
                        <User className="w-5 h-5 mr-2 pl-1" />
                        {userRole}
                    </button>
                    <Logout></Logout>
                </div>
            </div>
        </div>
    );
}
