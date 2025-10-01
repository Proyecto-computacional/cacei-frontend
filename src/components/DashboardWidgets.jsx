import React from "react";
//import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
//import "react-circular-progressbar/dist/styles.css";
import { Bell, Upload, ClipboardList, FileUser } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";  // Importa la API configurada

const DashboardWidgets = () => {
  const [estadisticas, setEstadisticas] = useState({
    aprobado: 0,
    desaprobado: 0,
    pendientes: 0,
  });
  const [userRole, setUserRole] = useState("");
  const navigate = useNavigate();
  const rpe = localStorage.getItem("rpe");
  const frameName = localStorage.getItem("frameName");
  const careerName = localStorage.getItem("careerName");
  const processId = localStorage.getItem("currentProcessId");

  const fetchUserRole = async () => {
    try {
      const response = await api.get('/api/user');
      setUserRole(response.data.user_role);
    } catch (error) {
      console.error("Error al obtener el rol del usuario:", error);
    }
  };

  const fetchEstadisticas = async () => {
    try {
      let resumenGeneralPorRPE = {};
      if (userRole === "ADMINISTRADOR" || userRole === "JEFE DE AREA" || userRole === "DIRECTIVO" || userRole === "COORDINADOR") {
        const res = await api.get(`/estadisticas/${rpe}/${frameName}/${careerName}`);
        resumenGeneralPorRPE = res.data;
      } else if (userRole === "PROFESOR RESPONSABLE" || userRole === "DEPARTAMENTO DE APOYO" || userRole === "PERSONAL DE APOYO") {
        const res = await api.get(`/estadisticas/por-autor/${rpe}/${frameName}/${careerName}`);
        resumenGeneralPorRPE = res.data;
      }

      setEstadisticas({
        aprobado: resumenGeneralPorRPE[0]?.aprobado || 0,
        desaprobado: resumenGeneralPorRPE[0]?.desaprobado || 0,
        pendientes: resumenGeneralPorRPE[0]?.pendientes || 0,
      });

    } catch (error) {
      console.error("Error al obtener las estadísticas:", error);
    }
  };

  useEffect(() => {
    fetchUserRole();
  }, []);

  useEffect(() => {
    if (userRole) {
      fetchEstadisticas();
    }
  }, [userRole]);

  const { aprobado, desaprobado, pendientes } = estadisticas;
  const total = aprobado + desaprobado + pendientes;

  const aprobadoPercentage = total > 0 ? (aprobado / total) * 100 : 0;
  const desaprobadoPercentage = total > 0 ? (desaprobado / total) * 100 : 0;
  const pendientesPercentage = total > 0 ? (pendientes / total) * 100 : 0;

  return (
    <div className="grid grid-cols-4 md:grid-cols-4 gap-6 ml-21 mr-21 mb-21">

      {/* Task Assignments Card (Admin Only) */}
      {(userRole === "ADMINISTRADOR" || userRole === "COORDINADOR" || userRole === "JEFE DE AREA") && (
        <div className="bg-white shadow-lg rounded-2xl p-6 flex flex-col justify-between hover:shadow-xl transition-shadow duration-300">
          <div>
            <h2 className="text-2xl font-bold mb-2 flex items-center">
              <ClipboardList className="w-6 h-6 mr-2" />
              Asignación de Tareas
            </h2>
            <p className="text-gray-600 mb-4">
              Gestiona y asigna tareas a los miembros del equipo para el proceso de acreditación.
            </p>
          </div>
          
          <button 
            onClick={() => navigate('/evidenceManagement')}
            className="bg-blue-700 text-white mt-4 py-2 rounded-xl hover:bg-blue-800 transition-colors duration-300"
          >
            Ir a Asignación de Tareas
          </button>
        </div>
      )}
      
      {/* Upload Evidence Card */}
      <div className="bg-white shadow-lg rounded-2xl p-6 flex flex-col justify-between hover:shadow-xl transition-shadow duration-300">
        <div>
          <h2 className="text-2xl font-bold mb-2 flex items-center">
            <Upload className="w-6 h-6 mr-2" />
            Carga de Evidencias
          </h2>
          <p className="text-gray-600 mb-4">
            Sube y gestiona las evidencias necesarias para el proceso de acreditación.
          </p>
        </div>
        <button 
          onClick={() => navigate('/uploadEvidence')}
          className="bg-blue-700 text-white mt-4 py-2 rounded-xl hover:bg-blue-800 transition-colors duration-300"
        >
          Ir a Carga de Evidencias
        </button>
      </div>

            {/* Consult CV's of process */}
      {(['ADMINISTRADOR', 'COORDINADOR', 'JEFE DE AREA', 'DIRECTIVO'].includes(userRole)) && (
        <div className="bg-white shadow-lg rounded-2xl p-6 flex flex-col justify-between hover:shadow-xl transition-shadow duration-300">
          <div>
            <h2 className="text-2xl font-bold mb-2 flex items-center">
            <FileUser className="w-6 h-6 mr-2" />
              CV's de profesores.
            </h2>
            <p className="text-gray-600 mb-4">
              Consulta los CV's de los profesores que el sistema anexara para este proceso de acreditación en base a los horarios del semestre en el que se lleva a cabo.
            </p>
          </div>
          <button 
            onClick={() => navigate(`/CVsOfProcess/${processId}`)}
            className="bg-blue-700 text-white mt-4 py-2 rounded-xl hover:bg-blue-800 transition-colors duration-300"
          >
            Ir a Lista de CV's.
          </button>
        </div>
      )}


      {/* Progress Card */}
      <div className="bg-white shadow-lg rounded-2xl p-6 flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-2">Progreso General</h2>
        <div className="relative w-32 h-32">
          <svg width="100%" height="100%" viewBox="0 0 36 36" className="circular-chart">
            {/* Background circle */}
            <circle
              cx="18"
              cy="18"
              r="15.91549431"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="3"
            />
            {/* Approved section */}
            <circle
              cx="18"
              cy="18"
              r="15.91549431"
              fill="none"
              stroke="#004A98"
              strokeWidth="3"
              strokeDasharray={`${aprobadoPercentage} 100`}
              strokeDashoffset="0"
              transform="rotate(-90 18 18)"
            />
            {/* Rejected section */}
            <circle
              cx="18"
              cy="18"
              r="15.91549431"
              fill="none"
              stroke="#5B7897"
              strokeWidth="3"
              strokeDasharray={`${desaprobadoPercentage} 100`}
              strokeDashoffset={`-${aprobadoPercentage}`}
              transform="rotate(-90 18 18)"
            />
            {/* Pending section */}
            <circle
              cx="18"
              cy="18"
              r="15.91549431"
              fill="none"
              stroke="#FFC600"
              strokeWidth="3"
              strokeDasharray={`${pendientesPercentage} 100`}
              strokeDashoffset={`-${aprobadoPercentage + desaprobadoPercentage}`}
              transform="rotate(-90 18 18)"
            />
            {/* Center text */}
            <text 
              x="18" 
              y="18" 
              textAnchor="middle" 
              dy=".3em" 
              className="text-xs font-bold fill-gray-800"
            >
              {aprobadoPercentage.toFixed(0)}%
            </text>
          </svg>
        </div>
        <div className="mt-6 w-full space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-[#004A98]"></div>
              <p className="ml-2 text-sm font-medium">Aprobado</p>
            </div>
            <p className="text-sm font-semibold">{aprobadoPercentage.toFixed(0)}%</p>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-[#5B7897]"></div>
              <p className="ml-2 text-sm font-medium">Desaprobado</p>
            </div>
            <p className="text-sm font-semibold">{desaprobadoPercentage.toFixed(0)}%</p>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-[#FFC600]"></div>
              <p className="ml-2 text-sm font-medium">Pendiente</p>
            </div>
            <p className="text-sm font-semibold">{pendientesPercentage.toFixed(0)}%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardWidgets;
