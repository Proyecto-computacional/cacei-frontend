import React, { useState, useEffect } from "react";
import { AppHeader, AppFooter, SubHeading } from "../common";
import CV from "../components/cv";
import api from "../services/api";
import ModalAlert from "../components/ModalAlert";
import { User, Calendar, Briefcase, Hash, Clock, Award } from "lucide-react";

const PersonalConfig = () => {
  const [cvData, setCvData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalAlertMessage, setModalAlertMessage] = useState(null);

  useEffect(() => {
    const fetchCV = async () => {
      try {
        const rpe = localStorage.getItem("rpe");
        if (!rpe) throw new Error("No se encontró el RPE en localStorage");

        const response = await api.post("/api/cvs", { user_rpe: rpe });
        setCvData(response.data);
      } catch (err) {
        console.error("Error fetching CV:", err);
        setError(err.message);
        setModalAlertMessage(`Error al cargar datos: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchCV();
  }, []);

  return (
    <>
      <AppHeader />
      <SubHeading />
      <div className="min-h-screen p-10 pl-18" style={{ background: "linear-gradient(180deg, #e1e5eb 0%, #FFF 50%)" }}>
        <div className="max-w-7xl mx-auto">
          <h1 className="text-[34px] font-semibold text-black font-['Open_Sans'] mt-6 mb-6">
            Información Personal
          </h1>

          {/* Sección de visualización de datos */}
          <div className="bg-white p-6 rounded-xl shadow-lg mb-8 transition-all duration-300 hover:shadow-xl">
            {loading ? (
              <div className="flex justify-center items-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary1"></div>
              </div>
            ) : error ? (
              <div className="bg-red-50 border-l-4 border-red-500 p-4">
                <p className="text-red-700">Error: {error}</p>
              </div>
            ) : cvData ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                  <User className="w-5 h-5 text-primary1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-600 text-sm">Nombre</p>
                    <p className="text-gray-800">{cvData.professor_name
                      ? cvData.professor_name
                        .split(' ')
                        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                        .join(' ')
                      : "No especificado"}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                  <Calendar className="w-5 h-5 text-primary1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-600 text-sm">Edad</p>
                    <p className="text-gray-800">{cvData.age || "No especificado"}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                  <Briefcase className="w-5 h-5 text-primary1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-600 text-sm">Cargo actual</p>
                    <p className="text-gray-800">{cvData.actual_position || "No especificado"}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                  <Hash className="w-5 h-5 text-primary1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-600 text-sm">Número de profesor</p>
                    <p className="text-gray-800">{cvData.professor_number || "No especificado"}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                  <Calendar className="w-5 h-5 text-primary1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-600 text-sm">Fecha de nacimiento</p>
                    <p className="text-gray-800">{cvData.birth_date || "No especificado"}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                  <Clock className="w-5 h-5 text-primary1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-600 text-sm">Antigüedad</p>
                    <p className="text-gray-800">{cvData.duration || "No especificado"}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <Award className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">No se encontraron datos personales</p>
              </div>
            )}
          </div>

          <h1 className="text-[34px] font-semibold text-black font-['Open_Sans'] mt-8 mb-6">
            Curriculum Vitae
          </h1>
          <div className="bg-white p-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl">
            <CV cvData={cvData} />
          </div>
        </div>
      </div>
      <AppFooter />
      <ModalAlert
        isOpen={modalAlertMessage !== null}
        message={modalAlertMessage}
        onClose={() => setModalAlertMessage(null)}
      />

    </>
  );
};

export default PersonalConfig;