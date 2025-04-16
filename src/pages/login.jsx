import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import caceiLogo from '../assets/caceiLogo.png'
import '../app.css'
import { AppHeader } from "../common";
import { AppFooter } from "../common";
import { login } from "../services/api"
import api from "../services/api"

const Login = () => {
    const [rpe, setRpe] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const manejarLogin = async (e) => {
        e.preventDefault();
    
        try {
            const userData = await login(rpe, password);
            if (userData.correct) {
                // se obtiene el rpe directamente desde userData
                const userRpe = userData.rpe;

                // si hay procesos relacionados, lo manda a /mainMenu
                const response = await api.get("api/ProcesosUsuario", {
                    params: {
                        userRpe: userRpe, 
                    },
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem('token')}`, 
                    },
                });
                if(response.data.length>0){
                    navigate("/mainmenu", { state: { rpe: userRpe } });
                } else {
                    navigate("/personalInfo");
                }
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
            <div className="flex justify-center w-full min-h-screen items-start bg-gradient-to-b from-backgroundFrom to-backgroundTo to-40% pt-15">
                <div className=" p-10 w-5/9" id="info">
                    <h1 className=" font-bold text-4xl">Bienvenido</h1>
                    <p className="mt-5 mb-10">Esta plataforma facilita el registro, almacenamiento y clasificación de evidencias en formato digital, alineadas con las categorías y secciones establecidas en el Marco de Referencia vigente, con el objetivo de respaldar los procesos de evaluación y seguimiento institucional.</p>
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
