import { useEffect, useState } from "react";
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!userRpe) {
          console.error("userId no está disponible");
          return;
        }

        let response;
        if (userRole === "ADMINISTRADOR" || userRole === "DIRECTIVO") {
          // Fetch all processes for administrators
          response = await api.get("api/processes", {
            headers: {
              "Authorization": `Bearer ${localStorage.getItem('token')}`
            },
          });
        } else {
          // Fetch only related processes for other roles
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

        const newFinishedStatus = {};

        // Load percentages for each process
        const percentagesMap = {};
        for (const card of data) {
          let estRes = {};
          try {
            if (userRole === "ADMINISTRADOR" || userRole === "JEFE DE AREA" || userRole === "COORDINADOR" || userRole === "DIRECTIVO") {
              estRes = await api.get(`/estadisticas/${userRpe}/${card.frame_name}/${card.career_name}`);
            } else if (userRole === "PROFESOR" || userRole === "DEPARTAMENTO UNIVERSITARIO") {
              estRes = await api.get(`/estadisticas/por-autor/${userRpe}/${card.frame_name}/${card.career_name}`);
            }
            
            percentagesMap[card.process_id] = estRes?.data[0]?.aprobado ?? 0;
            const processRes = await api.get(`/api/processes/${card.process_id}`);
            newFinishedStatus[card.process_id] = processRes.data.finished || false;
          } catch (error) {
            console.warn(`Error obteniendo porcentaje para ${card.process_id}`, error);
            percentagesMap[card.process_id] = 0;
            newFinishedStatus[card.process_id] = false;
          }
        }
        setPercentages(percentagesMap);
        setFinishedStatus(newFinishedStatus);

      } catch (error) {
        console.error("Error al obtener los datos:", error);
      } finally {
        setLoading(false);
      }
    };
  
    if (userRole) {
      fetchData();
    }
  }, [userRole]);

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
    // Refresh the page or update the process list
    window.location.reload();
  };

  return (
    <>
      <AppHeader />
      <SubHeading />
      <div className="min-h-screen p-10 pl-18" style={{ background: "linear-gradient(180deg, #e1e5eb 0%, #FFF 50%)" }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-[34px] font-semibold text-gray-800 font-['Open_Sans']">
                Menú Principal
              </h1>
              <p className="text-lg text-gray-700 leading-relaxed">
                Seleccione un proceso de acreditación para comenzar.
              </p>
            </div>
            {userRole === "ADMINISTRADOR" && (
              <button
                onClick={handleCreateProcess}
                className="bg-[#00b2e3] text-white px-4 py-2 rounded-lg hover:bg-[#003d7a] transition-colors duration-300 flex items-center gap-2 shadow-sm hover:shadow-md text-sm"
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
                    finished={finishedStatus[card.process_id] || false}
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

      <CreateProcessModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleProcessCreated}
      />
    </>
  );
};

export default MainMenu;
