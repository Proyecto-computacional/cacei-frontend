import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import api from "../services/api";

const MAJORS = [
  { career_id: "1", career_name: "Ingeniería Agroindustrial" },
  { career_id: "2", career_name: "Ingeniería Ambiental" },
  { career_id: "3", career_name: "Ingeniería Civil" },
  { career_id: "4", career_name: "Ingeniería en Computación" },
  { career_id: "5", career_name: "Ingeniería en Electricidad y Automatización" },
  { career_id: "6", career_name: "Ingeniería en Geología" },
  { career_id: "7", career_name: "Ingeniería en Sistemas Inteligentes" },
  { career_id: "8", career_name: "Ingeniería en Topografía y Construcción" },
  { career_id: "9", career_name: "Ingeniería Mecánica" },
  { career_id: "10", career_name: "Ingeniería Mecánica Administrativa" },
  { career_id: "11", career_name: "Ingeniería Mecánica Eléctrica" },
  { career_id: "12", career_name: "Ingeniería Mecatrónica" },
  { career_id: "13", career_name: "Ingeniería Metalúrgica y de Materiales" }
];

// # Proceso del modal
const CreateProcessModal = ({ isOpen, onClose, onSuccess }) => {
  // Información a enviar a Back
  const [formData, setFormData] = useState({
    career_id: "",
    frame_id: "",
    process_name: "",
    start_date: "",
    end_date: "",
    due_date: ""
  });
  const [loading, setLoading] = useState(false);
  const [frames, setFrames] = useState([]);
  const [error, setError] = useState("");

  // # Busca los marcos de referencia disponibles
  useEffect(() => {
    const fetchFrames = async () => {
      try {
        const framesRes = await api.get('/api/frames-of-references');
        setFrames(framesRes.data);
      } catch (error) {
        console.error('Error fetching frames:', error);
        setError('Error al cargar los marcos de referencia');
      }
    };

    if (isOpen) {
      fetchFrames();
    }
  }, [isOpen]);

  // # Realiza la creación del proceso
  const handleSubmit = async (e) => {
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
          <h2 className="text-xl font-semibold text-gray-800">Crear Nuevo Proceso</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Formato a subir (con opciones) */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Carreras disponibles */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Carrera *
            </label>
            <select
              name="career_id"
              value={formData.career_id}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00b2e3] focus:border-[#00b2e3] transition-all"
            >
              <option value="">Seleccionar carrera</option>
              {MAJORS.map(major => (
                <option key={major.career_id} value={major.career_id}>
                  {major.career_name}
                </option>
              ))}
            </select>
          </div>

          {/* Marcos disponibles */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Marco de Referencia
            </label>
            <select
              name="frame_id"
              value={formData.frame_id}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00b2e3] focus:border-[#00b2e3] transition-all"
            >
              <option value="">Seleccionar marco de referencia</option>
              {frames.map(frame => (
                <option key={frame.frame_id} value={frame.frame_id}>
                  {frame.frame_name}
                </option>
              ))}
            </select>
          </div>

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
              {loading ? "Creando..." : "Crear Proceso"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProcessModal; 