import React, { useState, useEffect } from "react";
import { AppHeader, AppFooter, SubHeading } from "../common";
import CV from "../components/cv";
import api from "../services/api";

const PersonalConfig = () => {
  const [cvData, setCvData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCV = async () => {
      try {
        const rpe = localStorage.getItem("rpe");
        if (!rpe) throw new Error("No se encontró el RPE en localStorage");

        const response = await api.post("/api/cvs", { user_rpe: rpe });
        
        // Asumiendo que la respuesta es directa (axios) o necesitas response.json() si es fetch nativo
        setCvData(response.data); // Para axios
        // setCvData(response); // Si api.post devuelve directamente los datos
      } catch (err) {
        console.error("Error fetching CV:", err);
        setError(err.message);
        alert(`Error al cargar datos: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchCV();
  }, []);

  return (
    <>
      <AppHeader/>
      <SubHeading />
      <div className="min-h-screen p-10 pl-18" style={{ background: "linear-gradient(180deg, #e1e5eb 0%, #FFF 50%)" }}>
        <h1 className="text-[34px] font-semibold text-black font-['Open_Sans'] mt-6 mb-5">
          Información Personal
        </h1>

        {/* Sección de visualización de datos */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          {loading ? (
            <p>Cargando información...</p>
          ) : error ? (
            <p className="text-red-500">Error: {error}</p>
          ) : cvData ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Ejemplo con estructura común de CV - ajusta según tu API */}
              <div>
                <p className="font-semibold">Nombre:</p>
                <p>{cvData.professor_name || "No especificado"}</p>
              </div>
              <div>
                <p className="font-semibold">Edad:</p>
                <p>{cvData.age || "No especificado"}</p>
              </div>
              <div>
                <p className="font-semibold">Cargo actual:</p>
                <p>{cvData.actual_position || "No especificado"}</p>
              </div>
              <div>
                <p className="font-semibold">Número de profesor:</p>
                <p>{cvData.professor_number || "No especificado"}</p>
              </div>
              <div>
                <p className="font-semibold">Fecha de nacimiento:</p>
                <p>{cvData.birth_date || "No especificado"}</p>
              </div>
              <div>
                <p className="font-semibold">Antigüedad:</p>
                <p>{cvData.duration || "No especificado"}</p>
              </div>
            </div>
          ) : (
            <p>No se encontraron datos personales</p>
          )}
        </div>

        <h1 className="text-[34px] font-semibold text-black font-['Open_Sans'] mt-6 mb-5">
          Curriculum Vitae
        </h1>
        <CV cvData={cvData} /> {/* Pasamos los datos al componente CV si es necesario */}
      </div>
      <AppFooter/>
    </>
  );
};

export default PersonalConfig;