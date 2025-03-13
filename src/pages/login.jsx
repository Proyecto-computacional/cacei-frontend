import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import caceiLogo from '../assets/caceiLogo.png'
import '../app.css'
import { AppHeader } from "../common";
import { AppFooter } from "../common";
import { login } from "../services/api"
const API_URL = import.meta.env.VITE_API_URL;

const Login = () => {
    const [rpe, setRpe] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const manejarLogin = async (e) => {
        e.preventDefault();
    
        try {
            const userData = await login(rpe, password);
            if (userData) {
                // se obtiene el rpe directamente desde userData
                const userRpe = userData.rpe;
                // navegar a la página /mainmenu pasando el userRpe
                navigate("/mainmenu", { state: { rpe: userRpe } });
            } else {
                alert('RPE o contraseña incorrecto');
            }
        } catch (err) {
            console.log(err);
        }
    };
    

    return (
        <>
            <AppHeader></AppHeader>
            <div className="flex justify-center w-full items-start bg-linear-to-b from-backgroundFrom to-backgroundTo to-40%">
                <div className=" p-10 w-5/9" id="info">
                    <h1 className=" font-bold text-4xl">Bienvenido</h1>
                    <p className="mt-5 mb-10">Este sistema permitirá a los usuarios cargar evidencias en forma de archivos, los cuales serán almacenados en una base de datos y organizados según las categorías y secciones del Marco de Referencia 2025</p>
                    <img src={caceiLogo} alt="Logo no encontrado" className="w-3/4 m-auto" />
                </div>
                <div className="flex justify-center items-center h-fit w-3/9">
                    <form className="p-2 w-full" onSubmit={manejarLogin}>
                        <h2 className="text-2xl mb-4 text-center">Ingresar al sistema</h2>
                        <input
                            type="text"
                            placeholder="RPE"
                            className="w-full mb-4 p-2 border bg-neutral-200"
                            value={rpe}
                            onChange={(e) => setRpe(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Contraseña"
                            className="w-full mb-4 p-2 border bg-neutral-200"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button
                            type="submit"
                            className="bg-secondary1 text-white w-full p-2 rounded hover:bg-cyan-800"
                        >
                            Ingresar
                        </button>
                    </form>
                </div>
            </div>
            <AppFooter></AppFooter>
        </>

    );
};

export default Login;
