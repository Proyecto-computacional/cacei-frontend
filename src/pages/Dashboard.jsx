import React, { useState } from "react";
import { AppHeader, AppFooter, SubHeading } from "../common";
import { useLocation } from "react-router-dom";
import DashboardWidgets from "../components/DashboardWidgets";

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

  const sampleEvidences = [
    { name: "Evidencia 0239..", responsible: "Ernesto Lopez", info: "Sección 2.1.3", file: "Apuntes.Pdf", verified: "(X)", evaluated: "Marco Alcaraz" },
    { name: "Evidencia 0240..", responsible: "Felipe Bravo", info: "Sección 4.1.2", file: "Examen.Pdf", verified: "(V)", evaluated: "Enrique Alcala" },
    { name: "Evidencia 0241....", responsible: "Enrique Alcala", info: "Sección 3.1.2", file: "NomArchivo.Pdf", verified: "(X)", evaluated: "Felipe Bravo" },
    { name: "Evidencia 0242..", responsible: "Marco Alcaraz", info: "Sección 1.1.3", file: "NomArchivo.Pdf", verified: "(X)", evaluated: "Ernesto Lopez" }
  ];

  // Definir el estado del modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Función para abrir el modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Función para cerrar el modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <AppHeader />
      <SubHeading />
      <div className="min-h-screen p-10 pl-18" style={{ background: "linear-gradient(180deg, #e1e5eb 0%, #FFF 50%)" }}>
        <h1 className="text-[34px] font-semibold text-black font-['Open_Sans'] mt-6 mb-5">
          Dashboard proceso: {processId}
        </h1>
        <h1 className="text-[34px] font-semibold text-black font-['Open_Sans'] mb-7">
          Resumen General
        </h1>
        <DashboardWidgets />

        <div className="mt-6">
          <CategoryProgress title="Categoría 1" approved={50} rejected={20} pending={10} notUploaded={20} evidences={sampleEvidences} />
          <CategoryProgress title="Categoría 2" approved={50} rejected={20} pending={10} notUploaded={20} evidences={sampleEvidences} />
          <CategoryProgress title="Categoría 3" approved={50} rejected={20} pending={10} notUploaded={20} evidences={sampleEvidences} />
        </div>


        <div className="mt-10 mb-10">
          <h1 className="text-[24px] font-semibold text-black font-['Open_Sans'] mt-15 mb-3">
            Compilación de evidencias
          </h1>
          <div className="text-sm text-gray-700 mb-3">
            <p>Al dar clic en "Compilar Evidencias", se tomarán todas las evidencias aprobadas para la compilación. Además, podrás finalizar el proceso de acreditación, lo que impedirá que los usuarios suban más evidencias.*</p>
          </div>
          <button 
            onClick={openModal} 
            className="bg-blue-700 text-white py-2 px-6 rounded-xl text-lg font-semibold"
          >
            Compilar Evidencias
          </button>
        </div>
      </div>

      {/* Modal de confirmación */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-2xl font-semibold text-center mb-4">Confirmar Finalización</h2>
            <p className="text-center mb-6">¿Estás seguro de que deseas finalizar el proceso de acreditación? Esto impedirá que los usuarios suban más evidencias.</p>
            <div className="flex justify-around">
              <button 
                onClick={closeModal}
                className="bg-gray-300 text-black py-2 px-4 rounded-lg"
              >
                Cancelar
              </button>
              <button 
                onClick={() => {
                  // Aquí puedes manejar el cierre del proceso
                  alert("Proceso finalizado");
                  closeModal();
                }}
                className="bg-red-600 text-white py-2 px-4 rounded-lg"
              >
                Finalizar
              </button>
            </div>
          </div>
        </div>
      )}

      <AppFooter />
    </>
  );
};

export default Dashboard;
