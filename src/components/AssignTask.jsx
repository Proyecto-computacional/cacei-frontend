import React from "react";
import { Search } from "lucide-react";

const AssignTask = ({ onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-96 bg-white p-6 rounded-2xl shadow-lg">
        <h2 className="text-xl font-bold text-center mb-4">Asignar tarea</h2>
        
        <div className="mb-4">
          <label className="block mb-1 font-medium">Punto del marco:</label>
          <select className="w-full p-2 border rounded">
            <option value="punto">Punto</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Subpunto del marco:</label>
          <select className="w-full p-2 border rounded">
            <option value="subpunto">Subpunto</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Usuario(s):</label>
          <div className="relative">
            <input
              type="text"
              placeholder="Usuario"
              className="w-full p-2 border rounded pr-10"
            />
            <Search className="absolute right-3 top-2 w-5 h-5 text-gray-500" />
          </div>
        </div>

        <div className="mb-4 flex space-x-4">
          <label className="flex items-center">
            <input type="checkbox" className="mr-2" /> Ver
          </label>
          <label className="flex items-center">
            <input type="checkbox" className="mr-2" /> Editar
          </label>
          <label className="flex items-center">
            <input type="checkbox" className="mr-2" /> Eliminar
          </label>
        </div>

        <div className="flex justify-between mt-4">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded"
            onClick={onClose}
          >
            Guardar
          </button>
          <button
            className="px-4 py-2 border border-gray-300 rounded"
            onClick={onClose}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignTask;
