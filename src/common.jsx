import React, { useState } from "react";
import './app.css';
import headerLogo from './assets/headerLogo.png';
import headerImg from './assets/headerImage.png';
import { useNavigate } from "react-router-dom";
import Logout from "./components/logout";
import { Mail, Bell, User, Menu } from "lucide-react";

export function AppHeader() {
    return (
        <header className="flex h-[25vh] bg-neutral-100 flex-wrap mb-2 select-none">
            <div className="flex flex-nowrap items-center justify-around h-8/10 w-screen">
                <div className="min-w-2/4 max-w-2/4 h-full bg-primary1 flex items-center justify-around">
                    <img src={headerLogo} alt="Logo" className="w-8/10 h-9/10" />
                </div>
                <div className="bg-secondary1 w-1/4 h-full text-neutral-50 text-5xl font-light flex items-center text-center justify-center">
                    <p className="w-1/2">Portal CACEI</p>
                </div>
                <img src={headerImg} alt="Header" className="w-1/4 h-full" />
            </div>
            <div className="h-2/10 w-screen mt-3 flex bg-alt1 items-center">
                <div className="h-full min-w-1/2 bg-primary1 clip-triangle"></div>
                <div className="h-full min-w-1/2 bg-alt1 text-gray-950 pr-2 mx-auto flex items-center">
                    <p className="w-full text-end text-sm">"MODOS ET CUNCTARUM RERUM MENSURAS AUDEBO"</p>
                </div>
            </div>
        </header>
    );
}

export function AppFooter() {
    return (
        <div className="min-w-full max-w-full min-h-[15vh] bg-gradient-to-t from-primary1 from-80% to-secondary1 to-20%"></div>
    );
}

export function SubHeading() {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false); // Estado para controlar el menú

    return (
        <div className="w-full bg-transparent">
            <div className="flex justify-start items-center p-3 pl-18 space-x-4 border-b-3 bg-[#e1e5eb]">
                
            <div className="relative">
                <button onClick={() => setOpen(!open)} className="w-6 h-6 text-black">
                    <Menu />
                </button>

                {open && (
                    <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                        <ul className="py-2">
                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => { navigate("/mainMenu"); setOpen(false); }}>
                                Inicio
                            </li>
                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => { navigate("/personalInfo"); setOpen(false); }}>
                                Configuración personal
                            </li>
                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => { navigate("/mainMenu"); setOpen(false); }} >
                                Carga de evidencias
                            </li>
                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => { navigate("/usersAdmin"); setOpen(false); }}>
                                Administración de usuarios
                            </li>
                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => { navigate("/mainMenu"); setOpen(false); }} >
                                Revisión de evidencias
                            </li>
                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => { navigate("/mainMenu"); setOpen(false); }}>
                                Gestión de formato
                            </li>
                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => { navigate("/mainMenu"); setOpen(false); }} >
                                Gestión de evidencias
                            </li>
                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => { navigate("/notifications"); setOpen(false); }} >
                                Notificaciones
                            </li>
                        </ul>
                    </div>
                )}
            </div>

                <a href="https://www.google.com" className="text-[#00B2E3] italic underline">Breadcrumbs</a> /
                <a href="https://www.google.com" className="text-[#00B2E3] italic underline">Breadcrumbs</a>

                <div className="flex justify-between items-center w-75 ml-215">
                    <a href="https://mail.google.com" target="_blank" rel="noopener noreferrer">
                        <Mail className="w-5 h-5 text-black cursor-pointer" />
                    </a>
                    <button onClick={() => navigate("/notifications")}>
                        <Bell className="w-5 h-5 text-black cursor-pointer" />
                    </button>
                    <button onClick={() => navigate("/personalInfo")} className="flex items-center justify-center bg-yellow-500 text-white shadow w-55 h-7 cursor-pointer">
                        <User className="w-5 h-5 mr-2 pl-1" />
                        User
                    </button>
                    <Logout></Logout>
                </div>
            </div>
        </div>
    );
}
