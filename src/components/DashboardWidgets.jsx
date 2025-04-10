import React from "react";
//import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
//import "react-circular-progressbar/dist/styles.css";
import { Bell } from "lucide-react";

const DashboardWidgets = () => {
  // Valores para las tres secciones
  const aprobado = 55; // 55% Aprobado
  const pendiente = 20; // 20% Pendiente
  const sinSubir = 25; // 25% Sin Subir

  const total = aprobado + pendiente + sinSubir;

  // Porcentajes relativos para cada sección
  const aprobadoPercentage = (aprobado / total) * 100;
  const pendientePercentage = (pendiente / total) * 100;
  const sinSubirPercentage = (sinSubir / total) * 100;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 ml-21 mr-21 mb-21">
      {/* CV */}
      <div className="bg-white shadow-lg rounded-2xl p-6 flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">CV</h2>
          <p className="text-gray-500">Última actualización:</p>
          <p className="font-semibold">15/01/2023</p>
        </div>
        <button className="bg-blue-700 text-white mt-4 py-2 rounded-xl">Actualizar</button>
      </div>

      {/* Notificaciones */}
      <div className="bg-white shadow-lg rounded-2xl p-6">
        <h2 className="text-2xl font-bold mb-2 flex justify-between items-center">
          Notificaciones
          <Bell className="w-5 h-5 text-black cursor-pointer" />
        </h2>
        <p className="text-4xl font-bold">10</p>
      </div>

      {/* Progreso General */}
      <div className="bg-white shadow-lg rounded-2xl p-6 flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-2">Progreso General</h2>
        <div className="relative w-24 h-24">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 36 36"
            className="circular-chart"
          >
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
              strokeDasharray={`${pendientePercentage} ${100 - pendientePercentage}`}
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
              strokeDashoffset={25 + aprobadoPercentage + pendientePercentage}
            />
            {/* Texto en el centro del círculo */}
            <text
              x="18"
              y="18"
              textAnchor="middle"
              dy=".3em"
              fontSize="4"
              fill="black"
            >
              {aprobado}%
            </text>
          </svg>
        </div>
        <div className="mt-4 text-left text-sm">
          <div className="flex items-center">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: "#004A98" }}
            ></div>
            <p className="ml-2">55% Aprobado</p>
          </div>
          <div className="flex items-center">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: "#5B7897" }}
            ></div>
            <p className="ml-2">20% Pendiente</p>
          </div>
          <div className="flex items-center">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: "#FFC600" }}
            ></div>
            <p className="ml-2">25% Sin subir</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardWidgets;
