import React, { useEffect, useState } from "react";
import api from "../services/api";
import ModalAlert from "../components/ModalAlert";

const AssignTask = ({ onClose }) => {
  const [categories, setCategories] = useState([]);
  const [sections, setSections] = useState([]);
  const [standards, setStandards] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [selectedStandard, setSelectedStandard] = useState("");
  const [userRpe, setUserRpe] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [frame_id, setFrameId] = useState(null);
  const [process_id, setProcessId] = useState(null);
  const [isTransversal, setIsTransversal] = useState(false);
  const [processes, setProcesses] = useState([]);
  const storedFrameId = localStorage.getItem('frameId');
  const storedProcessId = localStorage.getItem('currentProcessId');
  const [modalAlertMessage, setModalAlertMessage] = useState(null);

  useEffect(() => {
    if (storedFrameId) {
      setFrameId(storedFrameId);
    }
    if (storedProcessId) {
      setProcessId(storedProcessId);
    }
  }, []);

  useEffect(() => {
    if (frame_id) {
      const response = api.post("/api/categories", { frame_id })
        .then(res => setCategories(res.data));
    }
  }, [frame_id]);

  useEffect(() => {
    if (selectedCategory) {
      api.post("/api/sections", { category_id: selectedCategory })
        .then(res => setSections(res.data));
    }
  }, [selectedCategory]);

  useEffect(() => {
    if (selectedSection) {
      api.post("/api/standards", { section_id: selectedSection })
        .then(res => setStandards(res.data));
    }
  }, [selectedSection]);

  useEffect(() => {
    if (selectedStandard) {
      // Buscar si el estándar seleccionado es transversal
      const selectedStd = standards.find(std => std.standard_id == selectedStandard);
      const isTransversalStd = selectedStd?.is_transversal || false;
      setIsTransversal(isTransversalStd);
      
      // Si es transversal, obtener todos los procesos con el mismo frame_id
      if (isTransversalStd && frame_id) {
        api.post("/api/processes-by-frame", { frame_id })
          .then(res => {
            // Filtrar para no incluir el proceso actual
            const otherProcesses = res.data.filter(p => p.process_id != storedProcessId);
            setProcesses(otherProcesses);
          });
      } else {
        setProcesses([]);
      }
    }
  }, [selectedStandard]);

  const validateUser = async (rpe) => {
    setIsValidating(true);
    setValidationError("");
    
    try {
      const response = await api.post("/api/validate-user", { rpe });
      const data = response.data;
  
      if (!data.correcto) {
        throw new Error("El RPE no es válido o no está registrado en el sistema");
      }
  
      return true;
    } catch (error) {
      setValidationError(error.message);
      return false;
    } finally {
      setIsValidating(false);
    }
  };

  const handleSave = async () => {
    if (!userRpe) {
      setValidationError("Por favor ingresa un RPE");
      return;
    }

    // Validar el RPE primero
    const isValid = await validateUser(userRpe);
    if (!isValid) return;

    try {
      let evidenceIds = [];
      
      // Siempre crear evidencia para el proceso actual
      if (!storedProcessId) {
        setValidationError("No se encontró el ID del proceso");
        return;
      }
      
      const currentEvidence = await api.post("/api/evidence", {
        standard_id: selectedStandard,
        user_rpe: userRpe,
        process_id: storedProcessId,
        due_date: dueDate
      });
      evidenceIds.push(currentEvidence.data.evidence.evidence_id);

      // Si es transversal, crear evidencias para los demás procesos
      if (isTransversal && processes.length > 0) {
        for (const process of processes) {
          const evidenceResponse = await api.post("/api/evidence", {
            standard_id: selectedStandard,
            user_rpe: userRpe,
            process_id: process.process_id,
            due_date: dueDate
          });
          evidenceIds.push(evidenceResponse.data.evidence.evidence_id);
        }
      }

      // Asignar revisor para cada evidencia creada
      for (const evidenceId of evidenceIds) {
        await api.post("/api/reviser", {
          user_rpe: userRpe,
          evidence_id: evidenceId,
        });
      }
      
     setModalAlertMessage(`Se crearon ${evidenceIds.length} evidencia(s) correctamente`);
     
    } catch (err) {
      setModalAlertMessage("Error al asignar: " + (err.response?.data?.message || err.message));
      
    }
  };

  // Mostrar información sobre la asignación transversal
  const renderTransversalInfo = () => {
    if (!isTransversal) return null;
    
    return (
      <div className="mb-4 p-3 bg-blue-50 rounded border border-blue-200">
        <p className="font-medium text-blue-800">Este estándar es transversal</p>
        {processes.length > 0 ? (
          <p className="text-sm text-blue-600">
            Se creará una evidencia para este proceso y para {processes.length} proceso(s) adicional(es) con el mismo marco de referencia.
          </p>
        ) : (
          <p className="text-sm text-blue-600">
            Se creará una evidencia solo para este proceso (no se encontraron otros procesos con el mismo marco de referencia).
          </p>
        )}
      </div>
    );
  };

  return (
    <>
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[99999]">
      <div className="w-96 bg-white p-6 rounded-2xl shadow-lg relative z-[99999]">
        <h2 className="text-xl font-bold text-center mb-4">Asignar tarea</h2>
  
        <div className="mb-4">
          <label className="block mb-1 font-medium">Categoría:</label>
          <select className="w-full p-2 border rounded" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
            <option value="">Selecciona una categoría</option>
            {categories.map(cat => (
              <option key={cat.category_id} value={cat.category_id}>{cat.category_name}</option>
            ))}
          </select>
        </div>
  
        <div className="mb-4">
          <label className="block mb-1 font-medium">Sección:</label>
          <select className="w-full p-2 border rounded" value={selectedSection} onChange={(e) => setSelectedSection(e.target.value)}>
            <option value="">Selecciona una sección</option>
            {sections.map(sec => (
              <option key={sec.section_id} value={sec.section_id}>{sec.section_name}</option>
            ))}
          </select>
        </div>
  
        <div className="mb-4">
          <label className="block mb-1 font-medium">Criterio:</label>
          <select className="w-full p-2 border rounded" value={selectedStandard} onChange={(e) => setSelectedStandard(e.target.value)}>
            <option value="">Selecciona un criterio</option>
            {standards.map(std => (
              <option key={std.standard_id} value={std.standard_id}>{std.standard_name}</option>
            ))}
          </select>
        </div>
  
        <div className="mb-4">
          <label className="block mb-1 font-medium">Fecha Límite:</label>
          <input
            type="date"
            className="w-full p-2 border rounded"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>

        {renderTransversalInfo()}
  
        <div className="mb-4">
          <label className="block mb-1 font-medium">Usuario (RPE):</label>
          <input
            type="text"
            placeholder="Usuario"
            className="w-full p-2 border rounded"
            value={userRpe}
            onChange={(e) => setUserRpe(e.target.value)}
          />
          {isValidating && <p className="text-blue-500 text-sm mt-1">Validando RPE...</p>}
          {validationError && <p className="text-red-500 text-sm mt-1">{validationError}</p>}
        </div>
  
        <div className="flex justify-between mt-4">
          <button 
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-blue-300" 
            onClick={handleSave}
            disabled={isValidating}
          >
            {isValidating ? "Validando..." : "Guardar"}
          </button>
          <button 
            className="px-4 py-2 border border-gray-300 rounded" 
            onClick={onClose}
            disabled={isValidating}
          >
            Cancelar
          </button>
           <ModalAlert
           isOpen={modalAlertMessage !== null}
          message={modalAlertMessage}
           onClose={() => {setModalAlertMessage(null); onClose();}}
       
         
        />
        </div>
      </div>
    </div>
     
      </>
  );
};

export default AssignTask;