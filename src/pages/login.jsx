import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../app.css'
import { AppHeader } from "../common";
import { AppFooter } from "../common";
import { login } from "../services/api"
import ModalAlert from "../components/ModalAlert";



const Login = () => {
    const [rpe, setRpe] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const [modalAlertMessage, setModalAlertMessage] = useState(null);

    const validateRpe = (value) => {
        return /^\d+$/.test(value);
    };

    const sanitizeInput = (input) => {
        return input.replace(/[<>{}()'"]/g, '');
    };

    const manejarLogin = async (e) => {
        e.preventDefault();

        if (!validateRpe(rpe)) {
            setModalAlertMessage("El RPE debe contener solo números");
            return;
        }

        // Sanitizar inputs
        const sanitizedRpe = sanitizeInput(rpe);
        const sanitizedPassword = sanitizeInput(password);

        try {
            const userData = await login(sanitizedRpe, sanitizedPassword);
            if (userData.correct) {
                const userRpe = userData.rpe;
                localStorage.setItem('userRpe', userRpe);
                navigate("/mainmenu");
            } else {
                setModalAlertMessage('RPE o contraseña incorrecto');
            }
        } catch (err) {
            console.log(err);
            setModalAlertMessage('Error al intentar iniciar sesión');
        }
    };


    return (
        <>
            <AppHeader></AppHeader>
            <div className="flex justify-center w-full min-h-[calc(100vh-200px)] items-start bg-gradient-to-b from-backgroundFrom to-backgroundTo to-40% pt-15 pb-2">
                <div className=" p-10 w-5/9" id="info">
                    <h1 className=" font-bold text-4xl">Bienvenido</h1>
                    <p className="mt-5 mb-10">Esta plataforma facilita la integración, organización y respaldo de evidencias digitales en los procesos de autoevaluación alineados a los Marcos de Referencia establecidos por los organismos acreditadores, atendiendo a la mejora continua de nuestros Programas Educativos.</p>
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
           
<ModalAlert
  isOpen={modalAlertMessage !== null}
  message={modalAlertMessage}
  onClose={() => setModalAlertMessage(null)}
/>


        </>

    );
};

export default Login;
