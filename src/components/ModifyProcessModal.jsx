import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import api from "../services/api";

// # Proceso del modal
const ModifyProcessModal = ({ isOpen, onClose, onSuccess, process }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Información a enviar a Back
  const [formData, setFormData] = useState({
    process_id: "",
    process_name: "",
    start_date: "",
    end_date: "",
    due_date: ""
  });

  // Pone la info original en los campos
  useEffect(() => {
    if (process && isOpen) {
      setFormData({
        process_id: process.process_id,
        process_name: process.process_name ?? "",
        start_date: process.start_date ?? "",
        end_date: process.end_date ?? "",
        due_date: process.due_date ?? ""
      });
    }

    if (!isOpen) {
      setFormData({
        process_name: "",
        start_date: "",
        end_date: "",
        due_date: ""
      });
    }
  }, [process, isOpen]);


  if (!isOpen) return null;


  // # Realiza la modificación del proceso
  const handleSubmit = async (e) => {
    if (!process) return;
    e.preventDefault();
    setLoading(true);
    setError("");

    // Valida fechas (que tengan sentido con la de hoy)
    const startDate = new Date(formData.start_date);
    const endDate = new Date(formData.end_date);
    const dueDate = new Date(formData.due_date);

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
      const response = await api.put(`/api/accreditation-processes/${process.process_id}/modify`, {
        ...formData
      });
      
      if (response.status === 200) {
        onSuccess();
        onClose();
      }
    } catch (error) {
      console.error("Error al modificar el proceso:", error);
      if (error.response?.data?.errors) {
        const errorMessages = Object.values(error.response.data.errors).flat();
        setError(errorMessages.join(", "));
      } else {
        setError(error.response?.data?.message || "Error al modificar el proceso. Por favor, intente nuevamente.");
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

  // # HTML -------------------------------------------------------------------------------------------------------------------------
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[99999]">
      <div className="bg-white rounded-xl p-6 w-full max-w-md relative z-[99999]">
        <div className="flex justify-between items-center mb-4">
          {/* Titulo del modal */}
          <h2 className="text-xl font-semibold text-gray-800">Modificar Proceso</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <p className="text-sm text-gray-700 mb-4">
          Ingrese nuevo nombre y fechas para el proceso:
        </p>

        {/* Formato a subir (con opciones) */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Nombre del proceso a escribir */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre del Proceso *
            </label>
            <input
              type="text"
              name="process_name"
              value={formData.process_name}
              onChange={handleChange}
              maxLength={150}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00b2e3] focus:border-[#00b2e3] transition-all"
              required
            />
          </div>

          {/* Fecha inicio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha de Inicio *
            </label>
            <input
              type="date"
              name="start_date"
              value={formData.start_date}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00b2e3] focus:border-[#00b2e3] transition-all"
              required
            />
          </div>

          {/* Fecha fin */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha de Fin *
            </label>
            <input
              type="date"
              name="end_date"
              value={formData.end_date}
              onChange={handleChange}
              min={formData.start_date}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00b2e3] focus:border-[#00b2e3] transition-all"
              required
            />
          </div>

          {/* Fecha limite */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha Límite *
            </label>
            <input
              type="date"
              name="due_date"
              value={formData.due_date}
              onChange={handleChange}
              min={formData.start_date}
              max={formData.end_date}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00b2e3] focus:border-[#00b2e3] transition-all"
              required
            />
          </div>

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
              type="submit"
              disabled={loading}
              className="bg-[#00b2e3] text-white px-4 py-2 rounded-lg hover:bg-[#0096c3] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Modificando..." : "Modificar Proceso"}
            </button>
          </div>
        </form>


        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
            {error}
          </div>
        )}

      </div>
    </div>
  );
};

export default ModifyProcessModal; 