import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import api from "../services/api";

// # Proceso del modal
const DeleteProcessModal = ({ isOpen, onClose, onSuccess, process }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [processWritten, setProcessWritten] = useState("");

  // # Realiza la creación del proceso
  const handleConfirmDelete = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    useEffect(() => {
      if (!isOpen) {
        setLoading(false);
        setError(null);
      }
    }, [isOpen]);

    if (!isOpen) return null;

    // Valida nombre
    let filtered = processes;

    // Filtro por término de búsqueda
    if (trimmedSearch !== "") {
        filtered = filtered.filter(proc =>
            proc.area_name?.toLowerCase().includes(trimmedSearch.toLowerCase()) ||
            proc.career?.toLowerCase().includes(trimmedSearch.toLowerCase()) ||
            proc.frame_name?.toLowerCase().includes(trimmedSearch.toLowerCase())
        );
    }

    setFilteredProcesses(filtered);

    if (endDate <= startDate) {
      setError("La fecha de fin debe ser posterior a la fecha de inicio");
      setLoading(false);
      return;
    }

    if (dueDate < startDate || dueDate > endDate) {
      setError("La fecha límite debe estar entre la fecha de inicio y la fecha de fin");
      setLoading(false);
      return;
    }

    // Hace petición a Back
    try {
      const response = await api.post("/api/accreditation-processes", {
        ...formData,
        frame_id: formData.frame_id || null
      });
      
      if (response.status === 201) {
        onSuccess();
        onClose();
      }
    } catch (error) {
      console.error("Error creating process:", error);
      if (error.response?.data?.errors) {
        const errorMessages = Object.values(error.response.data.errors).flat();
        setError(errorMessages.join(", "));
      } else {
        setError(error.response?.data?.message || "Error al crear el proceso. Por favor, intente nuevamente.");
      }
    } finally {
      setLoading(false);
    }
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!isOpen) return null;

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

        {
          console.log(process)
        }

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

        <input
          type="text"
          name="process_name"
          placeholder="Escriba el nombre del proceso para continuar"
          maxLength={150}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00b2e3] focus:border-[#00b2e3] transition-all"
          required
        />


        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Confirmación */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
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