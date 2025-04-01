import React, { useState } from "react";

const Feedback = ({ onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="w-[400px] bg-white shadow-lg rounded-lg border border-gray-300 p-6">
        <h2 className="text-2xl font-bold text-black mb-4">Retroalimentación</h2>
        <ul className="bg-gray-100 p-4 rounded-md text-gray-600 text-sm">
          <li className="mb-2">✔ Corregir ortografía</li>
          <li className="mb-2">✔ Profundizar en las instrucciones de proceso</li>
          <li className="mb-2">✔ Favor de hacer la justificación más larga</li>
          <li>✔ Seguir el formato dado en la guía proporcionada</li>
        </ul>
        <div className="flex justify-center mt-4">
          <button onClick={onClose} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Feedback;