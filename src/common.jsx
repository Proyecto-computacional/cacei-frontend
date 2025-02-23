import React from "react"
import './app.css'
import headerLogo from './assets/headerLogo.png'
import headerImg from './assets/headerImage.png'
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