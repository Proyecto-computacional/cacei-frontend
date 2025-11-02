import React, { useState, useEffect, useRef } from "react";
import './app.css';
import headerLogo from './assets/headerLogo.png';
import headerImg from './assets/headerImage.png';
import { useNavigate, useParams } from "react-router-dom";
import Logout from "./components/logout";
import NotificationsTable from "./components/NotificationTable";
import { Mail, Bell, User, Menu, Users, FileText, Eye, Upload } from "lucide-react";
import { useLocation } from "react-router-dom";
import api from "./services/api";

// TODO LO DEL HEADER
export function AppHeader() {
    const [isScrolled, setIsScrolled] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const isLoginPage = location.pathname === '/';


    useEffect(() => { // ¿Qué tanto ha "scrolleado" en la página?
        const handleScroll = () => {
            if (window.scrollY > 100) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div className="sticky-top">
            <div className={`header container-fluid ${isScrolled ? 'scrolled' : ''}`}>
                <div className="container">
                    <div className="row header">
                        {/* Para el login */}
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

                        {/* Para cuando ya está logeado */}
                        {!isLoginPage && (
                            <div className="col-12 col-md-auto flex-grow-1 justify-content-center justify-content-md-end align-items-center pt-md-0 pt-2 d-none d-md-block d-lg-block d-xl-block">
                                <div className="h-75 d-flex flex-column flex-sm-row bd-highlight justify-content-end align-items-sm-end pt-sm-0 pt-5 align-items-center">
                                    <div className="p-1 px-1 bd-highlight">
                                        <a href="/mainmenu" onClick={(e) => { e.preventDefault(); navigate('/mainmenu'); }}>Inicio</a>
                                        <span className="text-white"> | </span>
                                    </div>
                                    <div className="p-1 px-1 bd-highlight">
                                        <a href="/personalInfo" onClick={(e) => { e.preventDefault(); navigate(`/personalInfo/${localStorage.getItem("rpe")}`); }}>Mi CV</a>
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

// TODO el footer
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

// TODO LO DEL SUBHEADER
export function SubHeading() {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [viewNotifications, setViewNotifications] = useState(false);
    const location = useLocation();
    const [userRole, setUserRole] = useState("");
    const [userName, setUserName] = useState("");
    const pathnames = location.pathname.split("/").filter((x) => x && isNaN(x));
    const { evidence_id } = useParams();
    const containerRef = useRef(null);

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
        EvidencesCompilation: "Compilación de Evidencias",
        CVsOfProcess: "CVs de Profesores",
        framesStructure: "Estructura del Marco"
    };

    const [processName, setProcessName] = useState("");
    const [areaName, setAreaName] = useState("");
    const [evidenceName, setEvidenceName] = useState("");
    const processId = localStorage.getItem('currentProcessId');

    // Obtiene la información del usuario
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await api.get('/api/user');
                const formattedRole = response.data.user_role
                    ? response.data.user_role
                        .split('_')
                        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                        .join(' ')
                    : '';
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

    // Obtiene el nombre del proceso
    useEffect(() => {
        const fetchProcessName = async () => {
            try {
                if (processId) {
                    const response = await api.get(`/api/processes/${processId}`);
                    setProcessName(response.data.process_name);
                    setAreaName(response.data.area_name || "");
                }
            } catch (error) {
                console.error("Error al obtener el nombre del proceso:", error);
            }
        };

        if (pathnames.includes('uploadEvidence') || pathnames.includes('evidenceManagement') || pathnames.includes('dash') ||
            pathnames.includes('CVsOfProcess')) {
            fetchProcessName();
        }
    }, [pathnames]);


    useEffect(() => {
        const fetchEvidenceName = async () => {
            try {
                if (evidence_id) {
                    const response = await api.get(`/api/evidences/${evidence_id}`);
                    const evidence = response.data.evidence;
                    setEvidenceName(evidence?.standard?.standard_name || "Sin nombre");
                }
            } catch (error) {
                console.error("Error al obtener el nombre del criterio:", error);
            }
        };

        if (evidence_id) fetchEvidenceName();
    }, [evidence_id]);


    // Maneja la tabla de notificaciones desplegable
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setViewNotifications(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Alterna el panel al hacer click en la campana
    const handleBellClick = (e) => {
        e.stopPropagation(); // evitar que el click burbujee y cierre inmediatamente por el listener del doc
        setViewNotifications((v) => !v);
    };

    // Determinar si estamos en una página de proceso
    const isProcessPage = pathnames.some(p =>
        ['dash', 'uploadEvidence', 'evidenceManagement', 'CVsOfProcess'].includes(p)
    );

    // Estado de carga general del breadcrumb
    const isBreadcrumbLoading = isProcessPage
        ? !processName || (pathnames.includes('uploadEvidence') && evidence_id && !evidenceName)
        : false;



    return (
        <div className="bg-white border-b border-gray-200">
            <div className="container mx-auto px-4 py-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <div className="relative">
                            {(() => {
                                const role = userRole;
                                return(
                                        <>
                                            <button onClick={() => setOpen(!open)} className="w-6 h-6 text-black hover:text-[#004A98] transition-colors duration-200">
                                                <Menu />
                                            </button>
                                            {open && (
                                                <div className="absolute left-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
                                                    <ul className="py-1">
                                                        {role === "Administrador" && (
                                                            <>
                                                                <li className="px-4 py-2.5 hover:bg-[#004A98] hover:text-white transition-colors duration-200 cursor-pointer flex items-center"
                                                                    onClick={() => { navigate("/usersAdmin"); setOpen(false); }}>
                                                                    <Users className="w-4 h-4 mr-3" />
                                                                    <span>Administración de usuarios</span>
                                                                </li>
                                                                <li className="px-4 py-2.5 hover:bg-[#004A98] hover:text-white transition-colors duration-200 cursor-pointer flex items-center"
                                                                    onClick={() => { navigate("/framesAdmin"); setOpen(false); }}>
                                                                    <FileText className="w-4 h-4 mr-3" />
                                                                    <span>Gestión de formato</span>
                                                                </li>
                                                                <div className="border-t border-gray-200 my-1"></div>
                                                            </>
                                                        )}
                                                        {(
                                                            role === "Administrador" ||
                                                            role === "Jefe de area" ||
                                                        role === "Coordinador de carrera" ||
                                                        role === "Directivo" )&& (
                                                            <>
                                                                <li className="px-4 py-2.5 hover:bg-[#004A98] hover:text-white transition-colors duration-200 cursor-pointer flex items-center"
                                                                    onClick={() => { navigate("/ReviewEvidence"); setOpen(false); }} >
                                                                    <Eye className="w-4 h-4 mr-3" />
                                                                    <span>Revisión de evidencias</span>
                                                                </li>
                                                            </>
                                                        )}
                                                        <li className="px-4 py-2.5 hover:bg-[#004A98] hover:text-white transition-colors duration-200 cursor-pointer flex items-center"
                                                            onClick={() => { navigate("/uploadEvidence"); setOpen(false); }} >
                                                            <Upload className="w-4 h-4 mr-3" />
                                                            <span>Subir evidencias</span>
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
                            userRole === "Coordinador" || userRole === "Directivo" ? 'ml-12' : 'ml-0'}`}>


                            {isBreadcrumbLoading ? (
                                <span className="text-[#00B2E3] text-lg font-medium pl-10">Cargando...</span>
                            ) : (
                                <>
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
                                                {processName || "Cargando..."}
                                            </span>
                                        </>
                                    ) : (
                                        <>
                                            <span
                                                className="text-[#00B2E3] text-lg font-medium hover:text-[#0088b3] transition-colors duration-200 cursor-pointer"
                                                onClick={() => navigate('/mainmenu')}
                                            >
                                                Inicio
                                            </span>

                                            {isProcessPage && processId && (pathnames.includes('dash') || pathnames.includes('uploadEvidence') || pathnames.includes('evidenceManagement') || pathnames.includes('CVsOfProcess')) && (
                                                <>
                                                    <span className="mx-2 text-gray-400 text-lg">/</span>

                                                    <span
                                                        className="text-[#00B2E3] text-lg font-medium cursor-pointer hover:text-[#0088b3]"
                                                        onClick={() => navigate(`/dash/${processId}`)}
                                                    >
                                                        {processName}
                                                    </span>
                                                </>
                                            )}

                                            {pathnames.map((value, index) => {
                                                if (value === 'uploadEvidence' || value === 'evidenceManagement') {
                                                    return (
                                                        <React.Fragment key={index}>
                                                            <span className="mx-2 text-gray-400 text-lg">/</span>
                                                            <span className="text-[#00B2E3] text-lg font-medium">
                                                                {breadcrumbMap[value]}
                                                            </span>

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
                                                if (value === 'CVsOfProcess') {
                                                    return (
                                                        <React.Fragment key={index}>
                                                            <span className="mx-2 text-gray-400 text-lg">/</span>
                                                            <span className="text-[#00B2E3] text-lg font-medium">
                                                                {areaName ? `CVs de ${areaName}` : 'CVs de Profesores'}
                                                            </span>
                                                        </React.Fragment>
                                                    );
                                                }

                                                if (value === 'framesStructure') {
                                                    const marco = location.state?.marco;
                                                    return (
                                                        <React.Fragment key={index}>
                                                            <span className="mx-2 text-gray-400 text-lg">/</span>
                                                            <span
                                                                className="text-[#00B2E3] text-lg font-medium cursor-pointer hover:text-[#0088b3]"
                                                                onClick={() => navigate('/framesAdmin')}
                                                            >
                                                                {breadcrumbMap['framesAdmin']}
                                                            </span>
                                                            <span className="mx-2 text-gray-400 text-lg">/</span>
                                                            <span className="text-[#00B2E3] text-lg font-medium">
                                                                {marco?.frame_name || breadcrumbMap['framesStructure']}
                                                            </span>
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
                                </>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <a href="https://outlook.office.com/mail/" target="_blank" rel="noopener noreferrer">
                            <Mail className="w-5 h-5 text-black cursor-pointer" />
                        </a>
                        {/* ¿Es esto para los botones del correo y notificaciones? */}
                        <div className="relative inline-block" ref={containerRef}>
                            <button onClick={handleBellClick}>
                                <Bell className="w-5 h-5 text-black cursor-pointer" ></Bell>
                            </button>
                            {/* Comportamiento de la mini-tabla de notificaciones */}
                            {viewNotifications && (
                                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-fit bg-white border border-gray-200 rounded-lg shadow-lg z-50"
                                    onClick={(e) => e.stopPropagation()}>
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
                        <Logout></Logout>

                    </div>
                </div>
            </div>
        </div>
    );
}