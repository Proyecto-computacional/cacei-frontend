import React from "react";
//import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
//import "react-circular-progressbar/dist/styles.css";
import { Bell, Upload, ClipboardList } from "lucide-react";
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
      if (userRole === "ADMINISTRADOR") {
        const res = await api.get(`/estadisticas/${rpe}/${frameName}/${careerName}`);
        resumenGeneralPorRPE = res.data;
      } else if (userRole === "PROFESOR" || userRole === "DEPARTAMENTO UNIVERSITARIO") {
        const res = await api.get(`/estadisticas/por-autor/${rpe}/${frameName}/${careerName}`);
        resumenGeneralPorRPE = res.data;
      }

      setEstadisticas({
        aprobado: resumenGeneralPorRPE[0]?.aprobado || 0,
        desaprobado: resumenGeneralPorRPE[0]?.desaprobado || 0,
        pendientes: resumenGeneralPorRPE[0]?.pendientes || 0,
      });

      console.log("aprobado: ", resumenGeneralPorRPE[0]?.aprobado || 0);
      console.log("desaprobado: ", resumenGeneralPorRPE[0]?.desaprobado || 0);
      console.log("pendientes: ", resumenGeneralPorRPE[0]?.pendientes || 0);
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

  const aprobadoPercentage = (aprobado / total) * 100;
  const desaprobadoPercentage = (desaprobado / total) * 100;
  const sinSubirPercentage = (pendientes / total) * 100;

  // Debug log to check user role
  console.log("Current user role:", userRole);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 ml-21 mr-21 mb-21">
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

      {/* Task Assignments Card (Admin Only) */}
      {userRole === "ADMINISTRADOR" && (
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

      {/* Progress Card */}
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
            {/* Pendiente */}
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
            <p className="ml-2">{sinSubirPercentage.toFixed(0)}% Pendiente</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardWidgets;
