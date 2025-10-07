import React from "react";

export default function ModalAlert({ isOpen, onClose, message }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100000]">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4 transform transition-all duration-200">
        {/* Header con color UASLP */}
        <div className="bg-[#004A98] px-4 py-3 rounded-t-lg">
          <div className="flex items-center justify-center">
            <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center mr-2">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-white font-medium text-base">Información</h3>
          </div>
        </div>
        
        {/* Contenido */}
        <div className="px-6 py-6">
          <p className="text-gray-700 text-base leading-relaxed mb-6">{message}</p>
          
          {/* Botón alineado a la derecha */}
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-[#004A98] text-white rounded-lg hover:bg-[#003d7a] transition-colors duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-[#004A98] focus:ring-opacity-50"
              autoFocus
            >
              Aceptar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
