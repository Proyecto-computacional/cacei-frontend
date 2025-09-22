import { useEffect, useState,  } from "react";
import api from "../services/api";
import { useParams } from "react-router-dom";
import { AppHeader, AppFooter, SubHeading } from "../common";
import UserCVTable from "../components/usersCVTable";
import '../app.css'
const API_URL = import.meta.env.VITE_API_URL;

const CVsOfProcess = () => {

const[teachers, setTeachers] = useState();

const params = useParams();

useEffect(() => {
    try {
        //setLoading(true);
        api.get(`/api/cvs-of-process/${params.processId}`, {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('token')}`,
                    "Content-Type": "application/json",
                },
        })
        .then((response) => {
            setTeachers(response.data);
        });
        } catch (error) {
            if (error.response) {
                if (error.response.status === 403 ) {
                    alert("No tienes permisos para acceder a esta sección.");
                    window.location.href = "/PersonalConfig";
                } else if (error.response.status === 401) {
                    alert("Sesión expirada. Inicia sesión de nuevo.");
                    window.location.href = "/";
                } else {
                    alert("Error desconocido al obtener los usuarios.");
                }
            } else {
                alert("Error de conexión con el servidor.");
            }
            console.error("Error al obtener los usuarios:", error);
        } finally {
            //setLoading(false);
        }
},[]);

  return (
    <>
      <AppHeader />
      <SubHeading />
      <div className="min-h-screen p-10 pl-18" style={{ background: "linear-gradient(180deg, #e1e5eb 0%, #FFF 50%)" }}>

        {teachers && (
            <div className="w-8/10 mx-auto">
            <h1 className="text-[34px] font-semibold text-black font-['Open_Sans'] mt-2 mb-2">
                CV's del área de la carrera del proceso.
            </h1>
            <UserCVTable users={teachers.rpes_area}/>

            <h1 className="text-[34px] font-semibold text-black font-['Open_Sans'] mt-6 mb-2">
                CV's del área de Formación Humanística
            </h1>
            <UserCVTable users={teachers.rpes_humanistic}/>

            <h1 className="text-[34px] font-semibold text-black font-['Open_Sans'] mt-6 mb-2">
                CV's del Departamento Físico Matemático
            </h1>
            <UserCVTable users={teachers.rpes_dfm}/>
            
        </div>
        )}
      </div>
      <AppFooter></AppFooter>
    </>
  );
};

export default CVsOfProcess;
