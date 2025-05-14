import React, { useState, useEffect } from "react";
import { AppHeader, AppFooter, SubHeading } from "../common";
import { useLocation } from "react-router-dom";
import DashboardWidgets from "../components/DashboardWidgets";
import { useNavigate } from 'react-router-dom';
import api from "../services/api";
import { Link } from "lucide-react";

const ProgressBar = ({ approved, rejected, pending, notUploaded }) => {
  // Calculate total for percentage normalization (excluding notUploaded)
  const total = approved + rejected + pending;
  
  // Calculate percentages
  const approvedPercent = (approved / total) * 100;
  const rejectedPercent = (rejected / total) * 100;
  const pendingPercent = (pending / total) * 100;

  return (
    <div className="relative w-full h-6 rounded-full bg-gray-300 overflow-hidden">
      <div className="absolute h-full bg-green-500" style={{ width: `${approvedPercent}%` }}></div>
      <div className="absolute h-full bg-red-500" style={{ left: `${approvedPercent}%`, width: `${rejectedPercent}%` }}></div>
      <div className="absolute h-full bg-yellow-400" style={{ left: `${approvedPercent + rejectedPercent}%`, width: `${pendingPercent}%` }}></div>
    </div>
  );
};

const CategoryProgress = ({ title, approved, rejected, pending, notUploaded, evidences = [] }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Ensure evidences is always an array
  const safeEvidences = Array.isArray(evidences) ? evidences : [];

  const getStatusColor = (status) => {
    switch (status) {
      case 'APROBADA':
        return 'text-green-600';
      case 'NO APROBADA':
        return 'text-red-600';
      case 'PENDIENTE':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="bg-gray-100 p-4 rounded-lg mb-2">
      <div className="flex justify-between items-center cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        <span className="text-lg font-semibold">{title}</span>
        <button className="text-xl">{isOpen ? "▲" : "▼"}</button>
      </div>
      <ProgressBar approved={approved} rejected={rejected} pending={pending} notUploaded={notUploaded} />
      {isOpen && (
        <div className="mt-4 bg-white p-4 rounded-lg shadow-md">
          <table className="w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-blue-500 text-white">
                <th className="p-2">Nombre evidencia</th>
                <th className="p-2">Responsable</th>
                <th className="p-2">Info. Básica</th>
                <th className="p-2">Verificado</th>
              </tr>
            </thead>
            <tbody>
              {safeEvidences.length > 0 ? (
                safeEvidences.map((evidence, index) => (
                  <tr key={index} className="border-t">
                    <td className="p-2">{evidence.name || '-'}</td>
                    <td className="p-2">{evidence.responsible || '-'}</td>
                    <td className="p-2">{evidence.info || '-'}</td>
                    <td className={`p-2 font-medium ${getStatusColor(evidence.verified)}`}>
                      {evidence.verified || '-'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="p-2 text-center text-gray-500">
                    No hay evidencias disponibles
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const Dashboard = () => {
  const location = useLocation();
  const processId = location.state?.processId;
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processInfo, setProcessInfo] = useState({
    frameName: '',
    area: '',
    career: ''
  });
  const [isFinished, setIsFinished] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    const fetchProcessInfo = async () => {
      try {
        const processId = localStorage.getItem("currentProcessId");
        if (!processId) {
          throw new Error("No process ID found");
        }
        const response = await api.get(`/api/processes/${processId}`);
        console.log('response.data', response.data);
        setProcessInfo({
          frameName: response.data.frame_name || '',
          area: response.data.area_name || '',
          career: response.data.career_name || ''
        });
      } catch (error) {
        console.error("Error fetching process info:", error);
      }
    };

    fetchProcessInfo();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const processId = localStorage.getItem("currentProcessId");
        if (!processId) {
          throw new Error("No process ID found");
        }
        console.log('Fetching data for processId:', processId);
        const response = await api.get(`/api/categories/progress/${processId}`);
        console.log('API Response:', response.data);
        
        // Validate the response data
        if (!Array.isArray(response.data)) {
          throw new Error("Invalid response format");
        }

        // Ensure each category has the required properties
        const validatedCategories = response.data.map(category => {
          console.log('Processing category:', category);
          
          // Handle evidences that might be a string or already an object
          let evidencesArray = [];
          if (typeof category.evidences === 'string') {
            try {
              evidencesArray = JSON.parse(category.evidences);
            } catch (e) {
              console.error('Error parsing evidences string:', e);
            }
          } else if (Array.isArray(category.evidences)) {
            evidencesArray = category.evidences;
          } else if (typeof category.evidences === 'object' && category.evidences !== null) {
            evidencesArray = [category.evidences];
          }

          return {
            category_name: category.category_name || 'Sin nombre',
            approved: Number(category.approved) || 0,
            rejected: Number(category.rejected) || 0,
            pending: Number(category.pending) || 0,
            not_uploaded: Number(category.not_uploaded) || 0,
            evidences: evidencesArray
          };
        });
        console.log('Validated Categories:', validatedCategories);

        setCategories(validatedCategories);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleClick = () => {
    navigate('/EvidencesCompilation', { state: { processId } }); 
  };

  useEffect(() => {
    const checkProcessStatus = async () => {
      try {
        const processId = localStorage.getItem("currentProcessId");
        if (!processId) return;
        
        const response = await api.get(`/api/processes/${processId}`);
        setIsFinished(response.data.finished || false);
      } catch (error) {
        console.error("Error checking process status:", error);
      }
    };

    checkProcessStatus();
  }, []);

  const toggleProcessFinished = async () => {
    try {
      const processId = localStorage.getItem("currentProcessId");
      if (!processId) return;
      
      await api.put('/api/processes/finished', { process_id: processId });
      setIsFinished(!isFinished);
      setShowConfirmation(false);
    } catch (error) {
      console.error("Error toggling process status:", error);
    }
  };

  if (loading) {
    return (
      <>
        <AppHeader />
        <SubHeading />
        <div className="min-h-screen p-10 pl-18 flex items-center justify-center" style={{ background: "linear-gradient(180deg, #e1e5eb 0%, #FFF 50%)" }}>
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#004A98] mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando datos...</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <AppHeader />
        <SubHeading />
        <div className="min-h-screen p-10 pl-18 flex items-center justify-center" style={{ background: "linear-gradient(180deg, #e1e5eb 0%, #FFF 50%)" }}>
          <div className="text-center">
            <p className="text-red-600 mb-4">Error al cargar los datos: {error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-[#004A98] text-white px-4 py-2 rounded-lg hover:bg-[#003d7a] transition-colors"
            >
              Reintentar
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <AppHeader />
      <SubHeading />
      <div className="min-h-screen p-10 pl-18" style={{ background: "linear-gradient(180deg, #e1e5eb 0%, #FFF 50%)" }}>
        <div className="mb-8">
          <h1 className="text-[40px] font-bold text-[#004A98] font-['Open_Sans']">
            Dashboard
          </h1>
          <div className="mt-2 space-y-2">
            <h2 className="text-[28px] font-bold text-gray-700">
              {processInfo.frameName}
            </h2>
            <div className="flex gap-4 text-lg text-gray-600">
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#004A98]" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0h8v12H6V4z" clipRule="evenodd" />
                </svg>
                <span>{processInfo.area}</span>
              </div>
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#004A98]" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                </svg>
                <span>{processInfo.career}</span>
              </div>
            </div>
          </div>
        </div>
        <DashboardWidgets />

        <div className="mt-12 mb-6">
          <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#004A98]" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Progreso por Categoría
          </h3>
        </div>

        <div className="mt-6">
          {categories.length > 0 ? (
            categories.map((category, index) => (
              <CategoryProgress 
                key={index}
                title={category.category_name}
                approved={category.approved}
                rejected={category.rejected}
                pending={category.pending}
                notUploaded={category.not_uploaded}
                evidences={category.evidences}
              />
            ))
          ) : (
            <div className="text-center text-gray-500 py-4">
              No hay categorías disponibles
            </div>
          )}
        </div>

        <div className="mt-12 mb-6">
          <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#004A98]" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
            </svg>
            Finalización del Proceso
          </h3>
        </div>

        <div className="mt-8 flex justify-start">
          <div className="bg-white rounded-xl shadow-lg p-6 w-96">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-[#004A98] p-2 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800">Compilación Final</h3>
            </div>
            <p className="text-gray-600 mb-4 text-sm">
              Finaliza el proceso de acreditación y genera la compilación de evidencias aprobadas.
            </p>
            <button 
              onClick={handleClick}
              className="w-full bg-[#004A98] text-white py-2.5 px-4 rounded-lg text-base font-semibold hover:bg-[#003d7a] transition-colors duration-300 flex items-center justify-center gap-2"
            >
              Compilar Evidencias
            </button>
          </div>
        </div>
        <div className="mt-8 flex justify-start gap-4">
          <div className="bg-white rounded-xl shadow-lg p-6 w-96">
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2 rounded-lg ${isFinished ? 'bg-green-500' : 'bg-gray-500'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800">
                {isFinished ? 'Proceso Finalizado' : 'Proceso en Curso'}
              </h3>
            </div>
            <p className="text-gray-600 mb-4 text-sm">
              {isFinished 
                ? 'Este proceso ha sido marcado como finalizado.' 
                : 'Marca este proceso como finalizado cuando hayas completado todas las evidencias.'}
            </p>
            <button 
              onClick={() => setShowConfirmation(true)}
              className={`w-full py-2.5 px-4 rounded-lg text-base font-semibold transition-colors duration-300 flex items-center justify-center gap-2 ${
                isFinished 
                  ? 'bg-green-500 hover:bg-green-600 text-white' 
                  : 'bg-[#004A98] hover:bg-[#003d7a] text-white'
              }`}
            >
              {isFinished ? 'Reabrir Proceso' : 'Finalizar Proceso'}
            </button>
          </div>

          {showConfirmation && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl p-6 w-96">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  {isFinished ? 'Reabrir Proceso' : 'Finalizar Proceso'}
                </h3>
                <p className="text-gray-600 mb-6">
                  {isFinished 
                    ? '¿Estás seguro que deseas reabrir este proceso? Esto permitirá realizar cambios adicionales.' 
                    : '¿Estás seguro que deseas finalizar este proceso? No podrás realizar cambios después.'}
                </p>
                <div className="flex justify-end gap-3">
                  <button 
                    onClick={() => setShowConfirmation(false)}
                    className="px-4 py-2 text-gray-600 rounded-lg border border-gray-300 hover:bg-gray-100"
                  >
                    Cancelar
                  </button>
                  <button 
                    onClick={toggleProcessFinished}
                    className={`px-4 py-2 text-white rounded-lg ${
                      isFinished ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'
                    }`}
                  >
                    {isFinished ? 'Reabrir' : 'Finalizar'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="mb-12"></div>
      </div>
      <AppFooter />
    </>
  );
};

export default Dashboard;
