import { useEffect, useState,  } from "react";
import api from "../services/api";
import { useParams } from "react-router-dom";
import { AppHeader, AppFooter, SubHeading } from "../common";
import UserCVTable from "../components/usersCVTable";
import '../app.css'
import ModalAlert from "../components/ModalAlert";

const API_URL = import.meta.env.VITE_API_URL;

const CVsOfProcess = () => {

const[teachers, setTeachers] = useState();

const params = useParams();
const [modalAlertMessage, setModalAlertMessage] = useState(null);

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
                    setModalAlertMessage("No tienes permisos para acceder a esta sección.");
                    window.location.href = "/PersonalConfig";
                } else if (error.response.status === 401) {
                    setModalAlertMessage("Sesión expirada. Inicia sesión de nuevo.");
                    window.location.href = "/";
                } else {
                    setModalAlertMessage("Error desconocido al obtener los usuarios.");
                }
            } else {
                setModalAlertMessage("Error de conexión con el servidor.");
            }
            console.error("Error al obtener los usuarios:", error);
        } finally {
            //setLoading(false);
        }
},[]);

// HTML ------------------------------------------------------------------------------------------------------------------------------
  return (
    <>
      <AppHeader />
      <SubHeading />
      <div className="min-h-screen p-10 pl-18" style={{ background: "linear-gradient(180deg, #e1e5eb 0%, #FFF 50%)" }}>
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 pt-4 pb-2 pl-8 pr-8 w-full mb-6">
            <div className="flex items-center gap-4 mb-6">
              <div>
                <h1 className="text-4xl font-bold text-gray-800 font-['Open_Sans'] tracking-tight mb-3">
                  Curríulums de Profesores
                </h1>
                <p className="text-lg text-gray-700 leading-relaxed">
                Consulte los currículums vitae de los profesores vinculados al programa académico del proceso.
              </p>
              </div>
            </div>
          </div>


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
       <ModalAlert
        isOpen={modalAlertMessage !== null}
        message={modalAlertMessage}
        onClose={() => setModalAlertMessage(null)}
      />
    </>
  );
};

export default CVsOfProcess;
