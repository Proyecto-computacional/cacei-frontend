import React from "react"
import './app.css'
import headerLogo from './assets/headerLogo.png'
import headerImg from './assets/headerImage.png'
import { useNavigate } from "react-router-dom";
import { Mail, Bell, User } from "lucide-react";
export function AppHeader() {
    return (
        <header className="flex h-[25vh] bg-neutral-100 flex-wrap mb-2 select-none">
            <div className="flex flex-nowrap items-center justify-around h-8/10 w-screen">
                <div className="min-w-2/4 max-w-2/4 h-full bg-primary1 flex items-center justify-around">
                    <img src={headerLogo} alt="" className="w-8/10 h-9/10" />
                </div>
                <div className="bg-secondary1 w-1/4 h-full text-neutral-50 
                text-5xl font-light flex items-center text-center justify-center"><p className="w-1/2">Portal CACEI</p></div>
                <img src={headerImg} alt="" className="w-1/4 h-full" />
            </div>
            <div className="h-2/10 w-screen mt-3 flex bg-alt1 items-center">
                <div className="h-full min-w-1/2 bg-primary1 clip-triangle"></div>
                <div className="h-full min-w-1/2 bg-alt1 
                text-gray-950 pr-2 mx-auto flex items-center">
                    <p className="w-full text-end text-sm">"MODOS ET CUNCTARUM RERUM MENSURAS AUDEBO"</p>
                </div>
            </div>
        </header>
    );
}

export function AppFooter() {
    return (
        <div className="min-w-full max-w-full min-h-[15vh] bg-linear-to-t from-primary1 from-80%  to-secondary1 to-20%"></div>
    );
}

export function SubHeading() {
    const navigate = useNavigate();
    return (
      <div className="w-full bg-transparent">
        <div className="flex justify-start items-center p-3 pl-18 space-x-4 border-b-3 bg-[#e1e5eb]">
            <a href="https://www.google.com" className="text-[#00B2E3] italic underline">Breadcrumbs</a>/
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

            </div>
        </div>
      </div>
    );
}
  
