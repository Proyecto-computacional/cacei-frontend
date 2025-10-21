import { useEffect, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../services/api"
import { AppHeader, AppFooter, SubHeading } from "../common";
import Card from "../components/Card";
import { Plus } from "lucide-react";
import CreateProcessModal from "../components/CreateProcessModal";
import LoadingSpinner from "../components/LoadingSpinner";

const MainMenu = () => {
  const [cards, setCards] = useState([]);
  const [percentages, setPercentages] = useState({});
  const [userRole, setUserRole] = useState("");
  const location = useLocation();
  const userRpe = localStorage.getItem('rpe');
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [finishedStatus, setFinishedStatus] = useState({});
  const [loading, setLoading] = useState(true);

  // Obtener rol de usuario
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
      const promises = processes.map(async (card) => {
        try {
          let estPromise;
          let processPromise;

          // Configurar llamadas según el rol
          if (role === "ADMINISTRADOR" || role === "JEFE DE AREA" || role === "COORDINADOR DE CARRERA" || role === "DIRECTIVO") {
            estPromise = api.get(`/estadisticas/${rpe}/${card.frame_name}/${card.career_name}`);
          } else if (role === "PROFESOR" || role === "DEPARTAMENTO UNIVERSITARIO") {
            estPromise = api.get(`/estadisticas/por-autor/${rpe}/${card.frame_name}/${card.career_name}`);
          }

          processPromise = api.get(`/api/processes/${card.process_id}/find`);

          // Ejecutar en paralelo
          const [estRes, processRes] = await Promise.allSettled([estPromise, processPromise]);

          return {
            processId: card.process_id,
            percentage: estRes.status === 'fulfilled' ? (estRes.value?.data[0]?.aprobado ?? 0) : 0,
            finished: processRes.status === 'fulfilled' ? processRes.value.data.finished : false
          };
        } catch (error) {
          console.warn(`Error obteniendo datos para ${card.process_id}`, error);
          return {
            processId: card.process_id,
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
        setCards(data);

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
    setIsModalOpen(true);
  };

  const handleProcessCreated = () => {
    window.location.reload();
  };

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

          {loading ? (
            <div className="col-span-full flex justify-center py-12">
              <LoadingSpinner />
            </div>
          ) : cards.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cards.map((card) => (
                <div
                  key={card.process_id}
                  className="transform transition-all duration-300 hover:scale-105"
                >
                  <Card
                    title={card.frame_name}
                    area={card.area_name}
                    career={card.career_name}
                    percentage={`${percentages[card.process_id] ?? 0}%`}
                    finished={finishedStatus[card.process_id]}
                    startDate={card.start_date}
                    endDate={card.end_date}
                    dueDate={card.due_date}
                    onClick={() => handleCardClick(card.process_id, card.frame_name, card.career_name, card.frame_id, finishedStatus[card.process_id])}
                  />
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
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleProcessCreated}
      />
    </>
  );
};

export default MainMenu;