import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import api from "../services/api";

// # Proceso del modal
const DeleteProcessModal = ({ isOpen, onClose, onSuccess, process }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [processWritten, setProcessWritten] = useState("");

  useEffect(() => {
    setProcessWritten("");
    setError(null)
  }, [process, isOpen]);

  if (!isOpen) return null;

  // Variables para manejar eliminación
  const requiredName = process?.process_name.toString();

  // # Realiza la eliminación del proceso
  const handleConfirmDelete = async () => {
    if (!process) return;
    setLoading(true);
    setError(null);

    if (processWritten != requiredName) {
      setError("Debe escribir el nombre del proceso de manera identica");
      setLoading(false);
      return;
    }

    // Hace petición a Back
    try {
      const response = await api.delete(`/api/accreditation-processes/${process.process_id}/delete`, {
        process_id: process.process_id
      });
      
      if (response.status === 201) {
        onSuccess();
        onClose();
      }
    } catch (error) {
      console.error("Error al eliminar el proceso:", error);
      if (error.response?.data?.errors) {
        const errorMessages = Object.values(error.response.data.errors).flat();
        setError(errorMessages.join(", "));
      } else {
        setError(error.response?.data?.message || "Error al eliminar el proceso. Por favor, intente nuevamente.");
      }
    } finally {
      setLoading(false);
    }
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setProcessWritten(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // # HTML -------------------------------------------------------------------------------------------------------------------------
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[99999]">
      <div className="bg-white rounded-xl p-6 w-full max-w-md relative z-[99999]">
        <div className="flex justify-between items-center mb-4">
          {/* Titulo del modal */}
          <h2 className="text-xl font-semibold text-gray-800">Eliminar Proceso</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <p className="text-sm text-gray-700 mb-4">
          Está a punto de eliminar este proceso:
        </p>

        {/* Muestra información del proceso (segura si process es null) */}
        <div className="mb-4 text-sm text-gray-600">
          <div><strong>{process?.process_name ?? "-"}</strong></div>
          <div><strong>Marco:</strong> {process?.frame_name ?? "-"}</div>
          <div><strong>Carrera:</strong> {process?.career_name ?? "-"}</div>
          <div><strong>Periodo:</strong> {process?.start_date ?? "-"} → {process?.end_date ?? "-"}</div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Escriba el nombre del proceso para continuar (con mayusculas y acentos)
          </label>
          <input
            type="text"
            name="process_name"
            value={processWritten}
            onChange={(e) => setProcessWritten(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00b2e3] focus:border-[#00b2e3] transition-all"
            disabled={!requiredName || loading}
          />
        </div>

        


        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Confirmación */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={() => {onClose?.(); setProcessWritten("");}}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirmDelete}
            disabled={loading}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-950 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Eliminando..." : "Eliminar proceso"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteProcessModal; 