import { useEffect, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../services/api"
import { AppHeader, AppFooter, SubHeading } from "../common";
import Card from "../components/Card";
import { Plus, X } from "lucide-react";
import CreateProcessModal from "../components/CreateProcessModal";
import DeleteProcessModal from "../components/DeleteProcessModal";
import LoadingSpinner from "../components/LoadingSpinner";
import { Search } from "lucide-react";

const MainMenu = () => {
  const [processes, setProcesses] = useState([]);
  const [percentages, setPercentages] = useState({});
  const [userRole, setUserRole] = useState("");
  const location = useLocation();
  const userRpe = localStorage.getItem('rpe');
  const navigate = useNavigate();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [finishedStatus, setFinishedStatus] = useState({});
  const [loading, setLoading] = useState(true);

  const [selectedArea, setSelectedArea] = useState("-1");
  const [filteredProcesses, setFilteredProcesses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [areas, setAreas] = useState([]);

  // # Obtener rol de usuario
  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await api.get('/api/user');
        setUserRole(response.data.user_role);
      } catch (error) {
        console.error("Error al obtener el rol del usuario:", error);
      }
    };

    fetchUserRole();
  }, []);

  // # Función optimizada para cargar estadísticas en paralelo
  const fetchProcessesData = useCallback(async (processes, role, rpe) => {
    try {
      // Preparar todas las promesas para ejecución en paralelo
      const promises = processes.map(async (proc) => {
        try {
          console.log('rpe:', rpe);
          console.log('proc variable:', proc);            // si renombraste como proc (ver abajo)
          console.log('frame_name:', proc?.frame_name);
          console.log('career_name:', proc?.career_name);
          let estPromise;
          let processPromise;

          // Configurar llamadas según el rol
          if (role === "ADMINISTRADOR" || role === "JEFE DE AREA" || role === "COORDINADOR DE CARRERA" || role === "DIRECTIVO") {
            estPromise = api.get(`/estadisticas/${rpe}/${proc.frame_name}/${proc.career_name}`);
          } else if (role === "PROFESOR" || role === "DEPARTAMENTO UNIVERSITARIO") {
            estPromise = api.get(`/estadisticas/por-autor/${rpe}/${proc.frame_name}/${proc.career_name}`);
          }

          processPromise = api.get(`/api/processes/${proc.process_id}/find`);

          // Ejecutar en paralelo
          const [estRes, processRes] = await Promise.allSettled([estPromise, processPromise]);

          return {
            processId: proc.process_id,
            percentage: estRes.status === 'fulfilled' ? (estRes.value?.data[0]?.aprobado ?? 0) : 0,
            finished: processRes.status === 'fulfilled' ? processRes.value.data.finished : false
          };
        } catch (error) {
          console.warn(`Error obteniendo datos para ${proc.process_id}`, error);
          return {
            processId: proc.process_id,
            percentage: 0,
            finished: false
          };
        }
      });

      // Ejecutar TODAS las promesas en paralelo
      const results = await Promise.all(promises);
      
      // Convertir resultados a objetos
      const percentagesMap = {};
      const finishedStatusMap = {};
      
      results.forEach(result => {
        percentagesMap[result.processId] = result.percentage;
        finishedStatusMap[result.processId] = result.finished;
      });

      try {
          setLoading(true);
          const [responseAreas] = await Promise.all([
          api.get("/api/areas", { // <-- Aquí tu segunda consulta
              headers: {
                  Authorization: `Bearer ${localStorage.getItem('token')}`,
                  "Content-Type": "application/json",
              },
          })
      ]);
          setAreas(responseAreas.data);
      
      } catch (error) {
          if (error.response) {
              if (error.response.status === 403 ) {
                  setModalAlertMessage("No tienes permisos para acceder a esta sección.");
                  window.location.href = "/PersonalConfig";
              } else if (error.response.status === 401) {
                  setModalAlertMessage("Sesión expirada. Inicia sesión de nuevo.");
                  window.location.href = "/";
              } else {
                  setModalAlertMessage("Error desconocido al obtener los usuarios.");
              }
          } else {
              setModalAlertMessage("Error de conexión con el servidor.");
          }
          console.error("Error al obtener los usuarios:", error);
      } finally {
          setLoading(false);
      }

      return { percentagesMap, finishedStatusMap };
    } catch (error) {
      console.error("Error en fetchProcessesData:", error);
      return { percentagesMap: {}, finishedStatusMap: {} };
    }

    
  }, []);

  // # Cargar datos principales
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!userRpe) {
          console.error("userId no está disponible");
          setLoading(false);
          return;
        }

        // Redirigir CAPTURISTA inmediatamente
        if (userRole === "CAPTURISTA") {
          navigate("/framesAdmin");
          return;
        }

        let response;
        if (userRole === "ADMINISTRADOR" || userRole === "DIRECTIVO") {
          response = await api.get("api/processes", {
            headers: {
              "Authorization": `Bearer ${localStorage.getItem('token')}`
            },
          });
        } else {
          response = await api.get("api/ProcesosUsuario", {
            params: { userRpe },
            headers: {
              "Authorization": `Bearer ${localStorage.getItem('token')}`
            },
          });
        }

        if (response.status !== 200) {
          throw new Error("Error al obtener los datos");
        }

        const data = response.data;
        setProcesses(data);
        setFilteredProcesses(data)

        // Si no hay procesos, terminar aquí
        if (data.length === 0) {
          setLoading(false);
          return;
        }

        // Cargar estadísticas en paralelo
        const { percentagesMap, finishedStatusMap } = await fetchProcessesData(data, userRole, userRpe);
        
        setPercentages(percentagesMap);
        setFinishedStatus(finishedStatusMap);

      } catch (error) {
        console.error("Error al obtener los datos:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userRole) {
      fetchData();
    }
  }, [userRole, userRpe, navigate, fetchProcessesData]);

  // # Guarda datos del proceso, y los usa para cargar la página del proceso
  const handleCardClick = (processId, frameName, careerName, frameId, finished) => {
    localStorage.setItem("frameName", frameName);
    localStorage.setItem("careerName", careerName);
    localStorage.setItem("currentProcessId", processId);
    localStorage.setItem("frameId", frameId);
    localStorage.setItem("finished", finished);
    navigate(`/dash/${processId}`, { state: { processId } });
  };

  const handleCreateProcess = () => {
    setIsCreateModalOpen(true);
  };

  const handleDeleteProcess = () => {
    setIsDeleteModalOpen(true);
  };

  const handleProcessAlterated = () => {
    window.location.reload();
  };

  // # Funciones para búsqueda de procesos
  const handleSearch = () => {
      let filtered = processes;

      // Filtro por área
      if (selectedArea !== "-1") {
          filtered = filtered.filter(proc => proc.area_name === selectedArea);
      }

      // Filtro por término de búsqueda
      const trimmedSearch = searchTerm.trim().toLowerCase();
      if (trimmedSearch !== "") {
          filtered = filtered.filter(proc =>
              proc.area_name?.toLowerCase().includes(trimmedSearch.toLowerCase()) ||
              proc.career?.toLowerCase().includes(trimmedSearch.toLowerCase()) ||
              proc.frame_name?.toLowerCase().includes(trimmedSearch.toLowerCase())
          );
      }

      setFilteredProcesses(filtered);
  };

  useEffect(() => {
      handleSearch();
  }, [selectedArea, searchTerm]);

  // # HTML --------------------------------------------------------------------------------------------------------------------------
  return (
    <>
      <AppHeader />
      <SubHeading />
      <div className="min-h-screen p-10 pl-18" style={{ background: "linear-gradient(180deg, #e1e5eb 0%, #FFF 50%)" }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            {/* Titulo y descripción */}
            <div>
              <h1 className="text-[34px] font-semibold text-gray-800 font-['Open_Sans']">
                Menú Principal
              </h1>
              <p className="text-lg text-gray-700 leading-relaxed">
                Seleccione un proceso de acreditación para comenzar.
              </p>
            </div>
            {/* Crear proceso para el admin */}
            {userRole === "ADMINISTRADOR" && (
              <button
                onClick={handleCreateProcess}
                className="bg-primary1 text-white px-4 py-2 rounded-lg hover:bg-primary2 transition-colors duration-300 flex items-center gap-2 shadow-sm hover:shadow-md text-sm"
              >
                <Plus className="h-4 w-4" />
                Crear Nuevo Proceso
              </button>
            )}
          </div>

          {/* Búsqueda de procesos */}
          <div className="flex justify-between items-end mb-8">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                    type="text"
                    placeholder="Buscar por marco, área o carrera..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004A98] focus:border-transparent w-96"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
          </div>

          {/* Lista de procesos (fltrados) */}
          {loading ? (
            <div className="col-span-full flex justify-center py-12">
              <LoadingSpinner />
            </div>
            
          ) : filteredProcesses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {filteredProcesses.map((proc) => (
                <div
                  key={proc.process_id}
                  className="transform transition-all duration-300 hover:scale-105"
                >
                  <Card
                    title={proc.frame_name}
                    area={proc.area_name}
                    career={proc.career_name}
                    percentage={`${percentages[proc.process_id] ?? 0}%`}
                    finished={finishedStatus[proc.process_id]}
                    startDate={proc.start_date}
                    endDate={proc.end_date}
                    dueDate={proc.due_date}
                    onClick={() => handleCardClick(proc.process_id, proc.frame_name, proc.career_name, proc.frame_id, finishedStatus[proc.process_id])}
                  />

                  {userRole === "ADMINISTRADOR" && (
                  <div className="mt-2 flex justify-end">
                    <button
                      onClick={() => handleDeleteProcess(proc.process_id)}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-800 transition-colors duration-300 flex items-center gap-2 shadow-sm hover:shadow-md text-sm"
                    >
                      <X className="h-4 w-4" />
                      Eliminar proceso
                    </button>
                  </div>
                  )}

                </div>

              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <div className="text-gray-500 text-lg mb-2">No se encontraron procesos</div>
              <p className="text-gray-400 text-sm">
                {userRole === "ADMINISTRADOR" 
                  ? "No hay procesos de acreditación asignados actualmente."
                  : "No tienes procesos de acreditación asignados."}
              </p>
            </div>
          )}
        </div>
      </div>
      <AppFooter />

      {/* Modales */}
      <CreateProcessModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleProcessAlterated}
      />
      <DeleteProcessModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onSuccess={handleProcessAlterated}
      />
    </>
  );
};

export default MainMenu;