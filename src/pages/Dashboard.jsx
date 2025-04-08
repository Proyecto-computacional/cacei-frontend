import React, { useState } from "react";
import { AppHeader, AppFooter, SubHeading } from "../common";
import { useLocation } from "react-router-dom";

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

const PersonalConfig = () => {
  const location = useLocation();
  const processId = location.state?.processId;

  const sampleEvidences = [
    { name: "Evidencia 0239..", responsible: "Ernesto Lopez", info: "Sección 2.1.3", file: "Apuntes.Pdf", verified: "(X)", evaluated: "Marco Alcaraz" },
    { name: "Evidencia 0240..", responsible: "Felipe Bravo", info: "Sección 4.1.2", file: "Examen.Pdf", verified: "(V)", evaluated: "Enrique Alcala" },
    { name: "Evidencia 0241....", responsible: "Enrique Alcala", info: "Sección 3.1.2", file: "NomArchivo.Pdf", verified: "(X)", evaluated: "Felipe Bravo" },
    { name: "Evidencia 0242..", responsible: "Marco Alcaraz", info: "Sección 1.1.3", file: "NomArchivo.Pdf", verified: "(X)", evaluated: "Ernesto Lopez" }
  ];

  return (
    <>
      <AppHeader />
      <SubHeading />
      <div className="min-h-screen p-10 pl-18" style={{ background: "linear-gradient(180deg, #e1e5eb 0%, #FFF 50%)" }}>
        <h1 className="text-[34px] font-semibold text-black font-['Open_Sans'] mt-6 mb-5">
          Dashboard proceso: {processId}
        </h1>
        <div className="mt-4">
          <ProgressBar approved={40} rejected={10} pending={10} notUploaded={40} />
          <p className="text-right mt-2 text-lg font-semibold">40%</p>
        </div>
        <div className="mt-6">
          <CategoryProgress title="Categoría 1" approved={50} rejected={20} pending={10} notUploaded={20} evidences={sampleEvidences} />
          <CategoryProgress title="Categoría 2" approved={50} rejected={20} pending={10} notUploaded={20} evidences={sampleEvidences} />
          <CategoryProgress title="Categoría 3" approved={50} rejected={20} pending={10} notUploaded={20} evidences={sampleEvidences} />
        </div>
      </div>
      <AppFooter />
    </>
  );
};

export default PersonalConfig;
