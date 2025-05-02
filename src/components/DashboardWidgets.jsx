

import React from "react";
//import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
//import "react-circular-progressbar/dist/styles.css";
import { Bell } from "lucide-react";




import { useEffect, useState } from "react";
import api from "../services/api";  // Importa la API configurada

const DashboardWidgets = () => {
  const [estadisticas, setEstadisticas] = useState({
    aprobado: 0,
    desaprobado: 0,
    sin_evidencia: 0,
    notificaciones: 0,
  });

  // Obtener el RPE del usuario desde el localStorage
  const rpe = localStorage.getItem("rpe");
 
  // Función para obtener las estadísticas generales desde la API
  const fetchEstadisticas = async () => {
    try {

      // Obtener las estadísticas generales de la API
      const { data: resumenGeneralPorRPE } = await api.get(`/estadisticas/resumen/${rpe}`);
      console.log("resumenGeneralPorRPE: ", resumenGeneralPorRPE); 

      // Obtener las notificaciones no vistas
      const { data: notificacionesData } = await api.get(`/estadisticas/no-vistas/${rpe}`);
      console.log("Notificaciones: ", notificacionesData); 

      // Obtener la última actualización del CV
      const { data: ultimaActualizacionCV } = await api.get(`/cv/ultima-actualizacion/${rpe}`);
      console.log("ultimaActualizacionCV: ", ultimaActualizacionCV); 

      setEstadisticas({
        aprobado: resumenGeneralPorRPE.aprobado,
        desaprobado: resumenGeneralPorRPE.desaprobado,
        sin_evidencia: resumenGeneralPorRPE.sin_evidencia,
        notificaciones: notificacionesData.no_vistas,
        ultimaActualizacionCV: ultimaActualizacionCV.ultima_actualizacion_cv, // Fecha de la última actualización
      });
    } catch (error) {
      console.error("Error al obtener las estadísticas:", error);
    }
  };

  useEffect(() => {
    fetchEstadisticas();
  }, []); // Se ejecuta una sola vez al cargar el componente

  const { aprobado, desaprobado, sin_evidencia, notificaciones } = estadisticas;
  const total = aprobado + desaprobado + sin_evidencia;

  const aprobadoPercentage = (aprobado / total) * 100;
  const desaprobadoPercentage = (desaprobado / total) * 100;
  const sinSubirPercentage = (sin_evidencia / total) * 100;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 ml-21 mr-21 mb-21">
      {/* CV */}
      <div className="bg-white shadow-lg rounded-2xl p-6 flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">CV</h2>
          <p className="text-gray-500">Última actualización:</p>
          <p className="font-semibold">
            {estadisticas.ultimaActualizacionCV
              ? new Date(estadisticas.ultimaActualizacionCV).toLocaleDateString()
              : "No disponible"}
          </p>
        </div>
        <button className="bg-blue-700 text-white mt-4 py-2 rounded-xl">
          <a href="http://localhost:5173/personalInfo">Actualizar</a>
        </button>
      </div>

      {/* Notificaciones */}
      <div className="bg-white shadow-lg rounded-2xl p-6">
        <h2 className="text-2xl font-bold mb-2 flex justify-between items-center">
          Notificaciones
          <Bell className="w-5 h-5 text-black cursor-pointer" />
        </h2>
        <p className="text-4xl font-bold">{notificaciones}</p>
      </div>

      {/* Progreso General */}
      <div className="bg-white shadow-lg rounded-2xl p-6 flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-2">Progreso General</h2>
        <div className="relative w-24 h-24">
          <svg width="100%" height="100%" viewBox="0 0 36 36" className="circular-chart">
            {/* Fondo del círculo */}
            <circle
              cx="18"
              cy="18"
              r="15.91549431"
              fill="none"
              stroke="#d6d6d6"
              strokeWidth="3"
            />
            {/* Procesado (Aprobado) */}
            <circle
              cx="18"
              cy="18"
              r="15.91549431"
              fill="none"
              stroke="#004A98"
              strokeWidth="3"
              strokeDasharray={`${aprobadoPercentage} ${100 - aprobadoPercentage}`}
              strokeDashoffset="25"
            />
            {/* Pendiente */}
            <circle
              cx="18"
              cy="18"
              r="15.91549431"
              fill="none"
              stroke="#5B7897"
              strokeWidth="3"
              strokeDasharray={`${desaprobadoPercentage} ${100 - desaprobadoPercentage}`}
              strokeDashoffset={25 + aprobadoPercentage}
            />
            {/* Sin subir */}
            <circle
              cx="18"
              cy="18"
              r="15.91549431"
              fill="none"
              stroke="#FFC600"
              strokeWidth="3"
              strokeDasharray={`${sinSubirPercentage} ${100 - sinSubirPercentage}`}
              strokeDashoffset={25 + aprobadoPercentage + desaprobadoPercentage}
            />
            {/* Texto en el centro del círculo */}
            <text x="18" y="18" textAnchor="middle" dy=".3em" fontSize="4" fill="black">
              {aprobadoPercentage.toFixed(0)}%
            </text>
          </svg>
        </div>
        <div className="mt-4 text-left text-sm">
          <div className="flex items-center">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: "#004A98" }}
            ></div>
            <p className="ml-2">{aprobadoPercentage.toFixed(0)}% Aprobado</p>
          </div>
          <div className="flex items-center">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: "#5B7897" }}
            ></div>
            <p className="ml-2">{desaprobadoPercentage.toFixed(0)}% Desaprobado</p>
          </div>
          <div className="flex items-center">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: "#FFC600" }}
            ></div>
            <p className="ml-2">{sinSubirPercentage.toFixed(0)}% Sin subir</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardWidgets;
