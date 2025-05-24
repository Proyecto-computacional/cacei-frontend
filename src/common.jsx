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
    const [isScrolled, setIsScrolled] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const isLoginPage = location.pathname === '/';

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 100) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="sticky-top">
            <div className={`header container-fluid ${isScrolled ? 'scrolled' : ''}`}>
                <div className="container">
                    <div className="row header">
                        <div className="col-12 col-md-auto d-flex justify-content-center justify-content-md-start align-items-center">
                            <a href="https://www.uaslp.mx">
                                <img src={headerLogo} className={`img-fluid ${isScrolled ? 'd-none' : 'd-block'} logoUASLP`} alt="UASLP Logo" />
                            </a>
                            <p className={`textoUASLP ${isScrolled ? 'd-block' : 'd-none'}`}>
                                <a href="https://www.uaslp.mx">UASLP</a>
                            </p>

                            <div className={`divisorUASLP-ENTIDAD me-2 ms-2 ${isScrolled ? 'd-none' : 'd-block'}`}></div>
                            <div className={`divisorUASLP-ENTIDADScroll ${isScrolled ? 'd-block' : 'd-none'} me-2 ms-3`}></div>
                        </div>

                        {!isLoginPage && (
                            <div className="col-12 col-md-auto flex-grow-1 justify-content-center justify-content-md-end align-items-center pt-md-0 pt-2 d-none d-md-block d-lg-block d-xl-block">
                                <div className="h-75 d-flex flex-column flex-sm-row bd-highlight justify-content-end align-items-sm-end pt-sm-0 pt-5 align-items-center">
                                    <div className="p-1 px-1 bd-highlight">
                                        <a href="/mainmenu" onClick={(e) => { e.preventDefault(); navigate('/mainmenu'); }}>Inicio</a>
                                        <span className="text-white"> | </span>
                                    </div>
                                    <div className="p-1 px-1 bd-highlight">
                                        <a href="/personalInfo" onClick={(e) => { e.preventDefault(); navigate('/personalInfo'); }}>Configuración Personal</a>
                                        <span className="text-white"> | </span>
                                    </div>
                                    <div className="p-1 px-1 bd-highlight">
                                        <a href="/notifications" onClick={(e) => { e.preventDefault(); navigate('/notifications'); }}>Notificaciones</a>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="fondoFooter" style={{ height: '10px' }}></div>
        </div>
    );
}

export function AppFooter() {
    return (
        <div className="mt-0">
            <footer>
                <div className="fondoFooter" style={{ height: '10px' }}></div>
                <div className="piePagina text-white">
                    <div className="container">
                        <div id="circulos" className="row">
                            <div className="col-12 col-md-9">
                                <div className="row">
                                    <div className="text-start" style={{ width: '30px' }}>
                                        <a href="https://www.facebook.com/LaUASLP/" target="_blank" rel="noopener noreferrer">
                                            <span className="fa fa-facebook-square"></span>
                                        </a>
                                    </div>
                                    <div className="text-start" style={{ width: '30px' }}>
                                        <a href="https://twitter.com/LaUASLP" target="_blank" rel="noopener noreferrer">
                                            <span className="fa fa-twitter-square"></span>
                                        </a>
                                    </div>
                                    <div className="text-start" style={{ width: '30px' }}>
                                        <a href="https://www.youtube.com/LaUASLP" target="_blank" rel="noopener noreferrer">
                                            <span className="fa fa-youtube-play"></span>
                                        </a>
                                    </div>
                                    <div className="text-start" style={{ width: '30px' }}>
                                        <a href="https://www.instagram.com/lauaslp" target="_blank" rel="noopener noreferrer">
                                            <span className="fa fa-instagram"></span>
                                        </a>
                                    </div>
                                </div>
                                <div className="row" id="identidad">
                                    <span><b>UASLP</b></span><br />
                                    <span>Universidad Autónoma de San Luis Potosí</span><br />
                                    <span>Álvaro Obregón 64, Centro. CP 78000</span><br />
                                    <span>San Luis Potosí, SLP</span><br />
                                    <span>444 826 23 00</span><br />
                                    <span>©Todos los derechos reservados</span><br />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export function SubHeading() {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [viewNotifications, setViewNotifications] = useState(false);
    const location = useLocation();
    const [userRole, setUserRole] = useState("");
    const [userName, setUserName] = useState("");
    const pathnames = location.pathname.split("/").filter((x) => x);
    const { evidence_id } = useParams();

    const breadcrumbMap = {
        mainmenu: "Inicio",
        personalInfo: "Configuración Personal",
        uploadEvidence: "Carga de Evidencias",
        usersAdmin: "Administración de Usuarios",
        ReviewEvidence: "Revisión de Evidencias",
        framesAdmin: "Gestión de Formato",
        evidenceManagement: "Asignación de tareas",
        notifications: "Notificaciones",
        dash: "Dashboard",
        EvidencesCompilation: "Compilación de Evidencias"
    };

    const [processName, setProcessName] = useState("");
    const [evidenceName, setEvidenceName] = useState("");

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await api.get('/api/user');
                console.log("API Response:", response.data);
                console.log("API user_role:", response.data.user_role);
                console.log("localStorage role:", localStorage.getItem("role"));
                const formattedRole = response.data.user_role
                    ? response.data.user_role
                        .split('_')
                        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                        .join(' ')
                    : '';
                console.log("Formatted role:", formattedRole);
                setUserRole(formattedRole);
                const formattedName = response.data.user_name
                    ? response.data.user_name
                        .split(' ')
                        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                        .join(' ')
                    : '';
                setUserName(formattedName);
            } catch (error) {
                console.error("Error al obtener la información del usuario:", error);
            }
        };
        fetchUserInfo();
    }, []);

    useEffect(() => {
        const fetchProcessName = async () => {
            try {
                const processId = localStorage.getItem('currentProcessId');
                if (processId) {
                    const response = await api.get(`/api/processes/${processId}`);
                    setProcessName(response.data.process_name);
                }
            } catch (error) {
                console.error("Error al obtener el nombre del proceso:", error);
            }
        };

        if (pathnames.includes('uploadEvidence') || pathnames.includes('evidenceManagement')) {
            fetchProcessName();
        }
    }, [pathnames]);

    useEffect(() => {
        const fetchEvidenceName = async () => {
            try {
                if (evidence_id) {
                    const response = await api.get(`/api/evidence/${evidence_id}`);
                    setEvidenceName(response.data.evidence_name);
                }
            } catch (error) {
                console.error("Error al obtener el nombre de la evidencia:", error);
            }
        };

        if (evidence_id) {
            fetchEvidenceName();
        }
    }, [evidence_id]);

    return (
        <div className="bg-white border-b border-gray-200">
            <div className="container mx-auto px-4 py-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <div className="relative">
                            {(() => {
                                const role = userRole;
                                console.log("Current role from API:", role);
                                return (role === "Administrador" || 
                                       role === "Jefe de area" || 
                                       role === "Coordinador") && (
                                    <>
                                        <button onClick={() => setOpen(!open)} className="w-6 h-6 text-black">
                                            <Menu />
                                        </button>
                                        {open && (
                                            <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                                                <ul className="py-2">
                                                    {role === "Administrador" && (
                                                        <>
                                                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                                                onClick={() => { navigate("/usersAdmin"); setOpen(false); }}>
                                                                Administración de usuarios
                                                            </li>
                                                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                                                onClick={() => { navigate("/framesAdmin"); setOpen(false); }}>
                                                                Gestión de formato
                                                            </li>
                                                        </>
                                                    )}
                                                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                                        onClick={() => { navigate("/ReviewEvidence"); setOpen(false); }} >
                                                        Revisión de evidencias
                                                    </li>
                                                </ul>
                                            </div>
                                        )}
                                    </>
                                );
                            })()}
                        </div>

                        <div className={`flex items-center ${userRole === "Administrador" || 
                            userRole === "Jefe de area" || 
                            userRole === "Coordinador" ? 'ml-12' : 'ml-0'}`}>
                            {pathnames.includes('mainmenu') ? (
                                <span className="text-[#00B2E3] text-lg font-medium pl-10">Inicio</span>
                            ) : pathnames.includes('dash') ? (
                                <>
                                    <span 
                                        className="text-[#00B2E3] text-lg font-medium hover:text-[#0088b3] transition-colors duration-200 cursor-pointer" 
                                        onClick={() => navigate('/mainmenu')}
                                    >
                                        Inicio
                                    </span>
                                    <span className="mx-2 text-gray-400 text-lg">/</span>
                                    <span className="text-[#00B2E3] text-lg font-medium">
                                        Dashboard
                                    </span>
                                    {processName && (
                                        <>
                                            <span className="mx-2 text-gray-400 text-lg">/</span>
                                            <span className="text-[#00B2E3] text-lg font-medium">
                                                {processName}
                                            </span>
                                        </>
                                    )}
                                </>
                            ) : (
                                <>
                                    <span 
                                        className="text-[#00B2E3] text-lg font-medium hover:text-[#0088b3] transition-colors duration-200 cursor-pointer" 
                                        onClick={() => navigate('/mainmenu')}
                                    >
                                        Inicio
                                    </span>
                                    {pathnames.map((value, index) => {
                                        if (value === 'uploadEvidence' || value === 'evidenceManagement') {
                                            return (
                                                <React.Fragment key={index}>
                                                    <span className="mx-2 text-gray-400 text-lg">/</span>
                                                    <span className="text-[#00B2E3] text-lg font-medium">
                                                        {breadcrumbMap[value]}
                                                    </span>
                                                    {processName && (
                                                        <>
                                                            <span className="mx-2 text-gray-400 text-lg">/</span>
                                                            <span className="text-[#00B2E3] text-lg font-medium">
                                                                {processName}
                                                            </span>
                                                        </>
                                                    )}
                                                    {evidenceName && (
                                                        <>
                                                            <span className="mx-2 text-gray-400 text-lg">/</span>
                                                            <span className="text-[#00B2E3] text-lg font-medium">
                                                                {evidenceName}
                                                            </span>
                                                        </>
                                                    )}
                                                </React.Fragment>
                                            );
                                        }
                                        return (
                                            <React.Fragment key={index}>
                                                <span className="mx-2 text-gray-400 text-lg">/</span>
                                                <span className="text-[#00B2E3] text-lg font-medium">
                                                    {breadcrumbMap[value] || value}
                                                </span>
                                            </React.Fragment>
                                        );
                                    })}
                                </>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <a href="https://outlook.office.com/mail/" target="_blank" rel="noopener noreferrer">
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
                        <div className="relative group">
                            <div className="flex items-center justify-center bg-[#004A98] text-white shadow w-85 h-7">
                                <User className="w-5 h-5 mr-2 pl-1" />
                                <span className="hidden group-hover:inline">{userName}</span>
                                <span className="group-hover:hidden">{userRole}</span>
                            </div>
                        </div>
                        <button className="flex items-center justify-center bg-[#004A98] text-white shadow w-55 h-7 cursor-pointer">
                            <Logout></Logout>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
