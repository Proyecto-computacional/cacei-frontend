import React from "react";

export default function ModalAlert({ isOpen, onClose, message }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100000]">
      <div className="bg-white p-8 rounded-xl shadow-2xl max-w-lg w-full mx-4 text-center transform transition-transform duration-300 scale-100">
        <p className="mb-6 text-2xl font-semibold text-gray-800">{message}</p>
        <button
          onClick={onClose}
          className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full shadow-md hover:from-blue-700 hover:to-indigo-700 transition-colors duration-300 font-semibold text-lg focus:outline-none focus:ring-4 focus:ring-blue-300"
          autoFocus
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}
