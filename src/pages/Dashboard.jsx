import React, { useState } from "react";
import { AppHeader, AppFooter, SubHeading } from "../common";
import { useLocation } from "react-router-dom";
import DashboardWidgets from "../components/DashboardWidgets";
import { useNavigate } from 'react-router-dom';
import api from "../services/api";
import { Link } from "lucide-react";

const ProgressBar = ({ approved, rejected, pending, notUploaded }) => {
  return (
    <div className="relative w-full h-6 rounded-full bg-gray-300 overflow-hidden">
      <div className="absolute h-full bg-green-500" style={{ width: `${approved}%` }}></div>
      <div className="absolute h-full bg-red-500" style={{ left: `${approved}%`, width: `${rejected}%` }}></div>
      <div className="absolute h-full bg-yellow-500" style={{ left: `${approved + rejected}%`, width: `${pending}%` }}></div>
      <div className="absolute h-full bg-gray-600" style={{ left: `${approved + rejected + pending}%`, width: `${notUploaded}%` }}></div>
    </div>
  );
};

const CategoryProgress = ({ title, approved, rejected, pending, notUploaded, evidences }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-gray-100 p-4 rounded-lg mb-2">
      <div className="flex justify-between items-center cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        <span className="text-lg font-semibold">{title}</span>
        <button className="text-xl">{isOpen ? "▲" : "▼"}</button>
      </div>
      <ProgressBar approved={approved} rejected={rejected} pending={pending} notUploaded={notUploaded} />
      {isOpen && (
        <div className="mt-4 bg-white p-4 rounded-lg shadow-md">
          <table className="w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-blue-500 text-white">
                <th className="p-2">Nombre evidencia</th>
                <th className="p-2">Responsable</th>
                <th className="p-2">Info. Básica</th>
                <th className="p-2">Ver</th>
                <th className="p-2">Verificado</th>
                <th className="p-2">Evaluado</th>
              </tr>
            </thead>
            <tbody>
              {evidences.map((evidence, index) => (
                <tr key={index} className="border-t">
                  <td className="p-2">{evidence.name}</td>
                  <td className="p-2">{evidence.responsible}</td>
                  <td className="p-2">{evidence.info}</td>
                  <td className="p-2">{evidence.file}</td>
                  <td className="p-2">{evidence.verified}</td>
                  <td className="p-2">{evidence.evaluated}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const Dashboard = () => {
  const location = useLocation();
  const processId = location.state?.processId;
  const navigate = useNavigate();

  const sampleEvidences = [
    { name: "Evidencia 0239..", responsible: "Ernesto Lopez", info: "Sección 2.1.3", file: "Apuntes.Pdf", verified: "(X)", evaluated: "Marco Alcaraz" },
    { name: "Evidencia 0240..", responsible: "Felipe Bravo", info: "Sección 4.1.2", file: "Examen.Pdf", verified: "(V)", evaluated: "Enrique Alcala" },
    { name: "Evidencia 0241....", responsible: "Enrique Alcala", info: "Sección 3.1.2", file: "NomArchivo.Pdf", verified: "(X)", evaluated: "Felipe Bravo" },
    { name: "Evidencia 0242..", responsible: "Marco Alcaraz", info: "Sección 1.1.3", file: "NomArchivo.Pdf", verified: "(X)", evaluated: "Ernesto Lopez" }
  ];

  const handleClick = () => {
    console.log('Navigating to EvidencesCompilation with processId:', processId);
    navigate('/EvidencesCompilation', { state: { processId } }); 
  };
  return (
    <>
      <AppHeader />
      <SubHeading />
      <div className="min-h-screen p-10 pl-18" style={{ background: "linear-gradient(180deg, #e1e5eb 0%, #FFF 50%)" }}>
        <div className="mb-8">
          <h1 className="text-[40px] font-bold text-[#004A98] font-['Open_Sans']">
            Dashboard
          </h1>
          <h2 className="text-[28px] font-bold text-gray-700 mt-2">
            {localStorage.getItem('frameName')}
          </h2>
        </div>
        <DashboardWidgets />

        <div className="mt-12 mb-6">
          <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#004A98]" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Progreso por Categoría
          </h3>
        </div>

        <div className="mt-6">
          <CategoryProgress title="Categoría 1" approved={50} rejected={20} pending={10} notUploaded={20} evidences={sampleEvidences} />
          <CategoryProgress title="Categoría 2" approved={50} rejected={20} pending={10} notUploaded={20} evidences={sampleEvidences} />
          <CategoryProgress title="Categoría 3" approved={50} rejected={20} pending={10} notUploaded={20} evidences={sampleEvidences} />
        </div>

        <div className="mt-12 mb-6">
          <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#004A98]" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
            </svg>
            Finalización del Proceso
          </h3>
        </div>

        <div className="mt-8 flex justify-start">
          <div className="bg-white rounded-xl shadow-lg p-6 w-96">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-[#004A98] p-2 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800">Compilación Final</h3>
            </div>
            <p className="text-gray-600 mb-4 text-sm">
              Finaliza el proceso de acreditación y genera la compilación de evidencias aprobadas.
            </p>
            <button 
              onClick={handleClick}
              className="w-full bg-[#004A98] text-white py-2.5 px-4 rounded-lg text-base font-semibold hover:bg-[#003d7a] transition-colors duration-300 flex items-center justify-center gap-2"
            >
              Compilar Evidencias
            </button>
          </div>
        </div>
        <div className="mb-12"></div>
      </div>
      <AppFooter />
    </>
  );
};

export default Dashboard;
