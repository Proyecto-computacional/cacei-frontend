import React, { useState } from "react";
import { AppHeader, AppFooter, SubHeading } from "../common";
import FeedbackModal from "../components/Feedback";
import CriteriaGuide from "../components/CriteriaGuide";
import '../app.css';

const UploadEvidence = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(URL.createObjectURL(event.target.files[0]));
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
              <button className="bg-[#00B2E3] text-white px-20 py-2 rounded-full">Cancelar</button>
              <button className="bg-[#004A98] text-white px-20 py-2 ml-10 rounded-full">Guardar</button>
            </div>
            <button
              onClick={() => setShowFeedback(true)}
              className="mt-4 bg-[#5B7897] text-white px-6 py-2 rounded-full w-1/2 self-center"
            >
              Retroalimentación
            </button>
          </div>
          <div className="flex-1 flex justify-center items-center border rounded bg-gray-100">
          {file ? (
              file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.gif') ? (
                <img src={file} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <iframe src={file} title="Preview" className="w-full h-full" />
              )
            ) : (
              <p className="text-gray-600">Preview</p>
            )}
          </div>
          <button
            onClick={() => setShowCriteriaGuide(true)}
            className="absolute bottom-4 right-4 bg-white border border-gray-400 w-10 h-10 flex items-center justify-center rounded-full shadow-lg"
          >
            ?
          </button>

        </div>
      </div>
      <AppFooter />
      {showFeedback && <FeedbackModal onClose={() => setShowFeedback(false)} />}
      {showCriteriaGuide && <CriteriaGuide onClose={() => setShowCriteriaGuide(false)} />}
    </>
  );
};

export default UploadEvidence;