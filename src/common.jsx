import React from "react"
import './app.css'
import headerLogo from './assets/headerLogo.png'
import headerImg from './assets/headerImage.png'
export function AppHeader() {
    return (
        <header className="flex h-[25vh] bg-neutral-100 flex-wrap mb-2 select-none">
            <div className="flex flex-nowrap items-center justify-around h-8/10 w-screen">
                <div className="min-w-2/4 max-w-2/4 h-full bg-blue-900 flex items-center justify-around">
                    <img src={headerLogo} alt="" className="w-8/10 h-9/10" />
                </div>
                <div className="bg-cyan-500 w-1/4 h-full text-neutral-50 
                text-5xl font-light flex items-center text-center justify-center"><p className="w-1/2">Portal CACEI</p></div>
                <img src={headerImg} alt="" className="w-1/4 h-full" />
            </div>
            <div className="h-2/10 w-screen mt-3 flex bg-yellow-500">
                <div className="h-full min-w-1/2 bg-blue-900 clip-triangle"></div>
                <div className="h-full min-w-1/2 bg-yellow-500 text-gray-950 text-end text-sm pr-1"> "MODOS ET CUNCTARUM RERUM MENSURAS AUDEBO" </div>
            </div>
        </header>
    );
}

export function AppFooter() {
    return (
        <div>Footer</div>
    );
}