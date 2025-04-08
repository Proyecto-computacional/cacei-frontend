import React, { useState } from "react";
import { AppHeader, AppFooter, SubHeading } from "../common";
import FeedbackModal from "../components/Feedback";
import CriteriaGuide from "../components/CriteriaGuide";
import '../app.css';
import api from "../services/api";

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

  return (
    <>
      <AppHeader />
      <SubHeading />
      <div className="min-h-screen p-10 flex flex-col items-center relative" style={{ background: "linear-gradient(180deg, #e1e5eb 0%, #FFF 50%)" }}>
        <h1 className="text-[34px] font-semibold text-black font-['Open_Sans'] mt-2 mb-2 self-start">
          Subir Evidencia
        </h1>
        <div className="bg-white p-6 rounded-lg shadow-lg flex flex-row w-[80%] min-w-7xl min-h-[500px]">
          <div className="flex flex-col flex-1 mr-10">
            <p className="text-black text-lg font-semibold">Nombre del criterio</p>
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
          <div className="flex-1 flex justify-center items-center border rounded bg-gray-100 p-4">
            {file ? (
              file.name.endsWith(".png") ||
              file.name.endsWith(".jpg") ||
              file.name.endsWith(".jpeg") ||
              file.name.endsWith(".gif") ? (
                <img src={file.preview} alt="Preview" className="w-full h-full object-cover" />
              ) : file.name.endsWith(".pdf") ? (
                <iframe src={file.preview} title="Vista previa PDF" className="w-full h-full" />
              ) : file.name.endsWith(".docx") || file.name.endsWith(".doc") ? (
                <p className="text-blue-600 text-center">
                  Archivo de Word cargado correctamente, pero no se puede previsualizar.
                </p>
              ) : file.name.endsWith(".xlsx") ? (
                <p className="text-gray-600 text-center">
                  Archivo .xlsx aceptado, pero no se puede previsualizar.
                </p>
              ) : (
                <p className="text-red-600 text-center">
                  Formato de archivo no permitido.
                </p>
              )
            ) : (
              <p className="text-gray-600">Preview</p> // Solo muestra esto si no hay archivo
            )}
          </div>
        </div>
      </div>
      <AppFooter />
      {showFeedback && <FeedbackModal onClose={() => setShowFeedback(false)} />}
      {showCriteriaGuide && <CriteriaGuide onClose={() => setShowCriteriaGuide(false)} />}
    </>
  );
};

export default UploadEvidence;