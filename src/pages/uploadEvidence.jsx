import React, { useState } from "react";
import { AppHeader, AppFooter, SubHeading } from "../common";
import FeedbackModal from "../components/Feedback";
import CriteriaGuide from "../components/CriteriaGuide";
import '../app.css';
import api from "../services/api";
import { FileQuestion } from "lucide-react";
import Feedback from "../components/Feedback";

const UploadEvidence = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;
  
    setFile({
      name: selectedFile.name.toLowerCase(), // Guardamos el nombre en minúsculas
      preview: URL.createObjectURL(selectedFile), // URL para previsualizar archivos compatibles
    });
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Por favor, selecciona un archivo.");
      return;
    }
  
    const formData = new FormData();
    formData.append("file", document.querySelector('input[type="file"]').files[0]);
    formData.append("evidence_id", 1); // Reemplaza con el ID correcto
    formData.append("justification", "Justificación opcional");
  
    try {
      const response = await api.post("/api/file", 
        formData, { //Ajusta la URL
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('token')}`, // autenticación
          "Content-Type": "multipart/form-data",
        },
      });
  
      console.log("Archivo subido con éxito:", response.data);
      alert("Archivo subido con éxito");
    } catch (error) {
      console.error("Error al subir archivo", error);
      alert("Error al subir archivo");
    }
  };  

  const handleRemoveFile = () => {
    setFile(null);
    document.querySelector('input[type="file"]').value = "";
  };

  const [showFeedback, setShowFeedback] = useState(false);
  const [showCriteriaGuide, setShowCriteriaGuide] = useState(false);

  const asignaciones = [
    {criterio:"Criterio 1.1", estado: "NO CARGADA"},
    {criterio:"Criterio 1.2", estado: "PENDIENTE"},
    {criterio:"Criterio 1.3", estado: "NO APROBADA"},
    {criterio:"Criterio 1.4", estado: "APROBADA"}
  ]

  const statuses = [
    {revisor:"Cesar Auguto", estado: "APROBADA", feedback:"feedback"},
    {revisor:"Silvia Vaca", estado: "NO APROBADA", feedback:"feedback"},
    {revisor:"Lilia del Carmen", estado: "PENDIENTE", feedback:"feedback"},
  ]

  const getEstadoClass = (estado) => {
    switch (estado) {
      case "NO CARGADA":
        return "bg-neutral-500 text-neutral-50";
      case "PENDIENTE":
        return "bg-yellow-400 text-white";
      case "NO APROBADA":
        return "bg-red-500 text-white";
      case "APROBADA":
        return "bg-green-500 text-white";
      default:
        return "bg-gray-300 text-black";
    }
  };

  return (
    <>
      <AppHeader />
      <SubHeading />
      <div className="h-fit p-10 flex justify-around items-stretch relative" style={{ background: "linear-gradient(180deg, #e1e5eb 0%, #FFF 50%)" }}>
        <div className="bg-cyan-300 w-2/10">
        <p className="w-full text-center text-3xl bg-cyan-500 text-amber-50 py-2">Mis asignaciones</p>
          <div>
      {asignaciones.map((item, index) => (
        <div
          key={index}
          className="flex justify-around text-[20px] items-center p-2 cursor-pointer hover:bg-cyan-500">
          <p className="w-1/2">{item.criterio}</p>
          <p className={`w-1/2 font-semibold px-3 text-center rounded-lg ${getEstadoClass(item.estado)}`}>
            {item.estado}
          </p>
        </div>
      ))}
        </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg flex flex-wrap flex-row w-7/10 min-h-[500px]">
          <div className="flex flex-col flex-1 mr-10 w-1/2">
            <h1 className="text-[40px] font-semibold text-black font-['Open_Sans'] mt-2 self-start">
            Subir Evidencia
            </h1>
            <h1 className="text-[25px] font-light text-black font-['Open_Sans'] mb-4 self-start">
            Sección/categoria/criterio
            </h1>
            <p className="text-black text-lg font-semibold">Justificación</p>
            <textarea
              className="w-full p-2 border rounded mt-2 text-gray-600 bg-gray-100 min-h-[150px]"
              placeholder="Descripción"
            ></textarea>
            <div className="mt-4">
                <label className="w-full p-2 border rounded bg-gray-100 text-gray-600 cursor-pointer flex justify-center items-center">
                    Ingresa el archivo aquí
                    <input
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                    />
                </label>
            </div>
            <div className="flex space-x-4 mt-8 pl-14">
              <button className="bg-[#00B2E3] text-white px-20 py-2 rounded-full" onClick={handleRemoveFile}>Cancelar</button>
              <button className="bg-[#004A98] text-white px-20 py-2 ml-10 rounded-full" onClick={handleUpload}>Guardar</button>
            </div>
            <button
              onClick={() => setShowFeedback(true)}
              className="mt-4 bg-[#5B7897] text-white px-6 py-2 rounded-full w-1/2 self-center"
            >
              Retroalimentación
            </button>
          </div>
          <div className="w-1/2">
          <h1 className="text-[40px] font-semibold text-black font-['Open_Sans'] mt-2 self-start">
            Revisión
            </h1>
                {statuses.map((item, index) => (
                  <div>
                    <div className="flex">
                    <p className="text-black text-lg font-semibold">Revisor:</p><p className="text-black text-lg ml-1">{item.revisor}</p>
                    </div>
                    <p className="text-black text-lg font-semibold">Estado</p>
                    <p className={`w-1/2 font-semibold px-3 text-center rounded-lg ${getEstadoClass(item.estado)}`}>{item.estado}</p>
                    <p className="text-black text-lg font-semibold">Retroalimentación</p>
                    <p className="w-full p-2 border rounded mt-2 text-gray-600 bg-gray-100 min-h-[150px]">{item.feedback}</p>
                  </div>
                ))}

          </div>
          <div className="w-full flex justify-end mt-7"><FileQuestion size={50} onClick={() => {setShowCriteriaGuide(true)}}/></div>
        </div>
      </div>
      <AppFooter />
      {showFeedback && <FeedbackModal onClose={() => setShowFeedback(false)} />}
      {showCriteriaGuide && <CriteriaGuide onClose={() => setShowCriteriaGuide(false)} />}
    </>
  );
};

export default UploadEvidence;