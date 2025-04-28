import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../services/api"
import { AppHeader, AppFooter, SubHeading } from "../common";
import Card from "../components/Card";
const MainMenu = () => {
  const [cards, setCards] = useState([]);
  const location = useLocation();  // se usa useLocation para acceder al estado pasado
  const userRpe = localStorage.getItem('rpe');  // se obtiene el userRpe del estado
  const navigate = useNavigate(); // para navegar

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedUserRpe = localStorage.getItem('userRpe');
  
        if (!storedUserRpe) {
          console.error("userRpe no está disponible");
          return;
        }
  
        const response = await api.get("api/ProcesosUsuario", {
          params: { userRpe: storedUserRpe },
          headers: {
            "Authorization": `Bearer ${localStorage.getItem('token')}`,
          },
        });
  
        if (response.status !== 200) {
          throw new Error("Error al obtener los datos");
        }
  
        const data = response.data;
        setCards(data);
  
        if (data.processes.length === 0) {
          navigate("/personalInfo");
        }
        
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      }
    };
  
    fetchData();
  }, []);

  const handleCardClick = (processId) => {
    navigate(`/dash/${processId}`, { state: { processId } });
  };

  return (
    <>
      <AppHeader />
      <SubHeading />
      <div className="min-h-screen p-10 pl-18" style={{ background: "linear-gradient(180deg, #e1e5eb 0%, #FFF 50%)" }}>
        <h1 className="text-[34px] font-semibold text-black font-['Open_Sans'] mt-6 mb-5">
          Menú Principal
        </h1>
        <div className="flex gap-4 flex-wrap">
          {cards.length > 0 ? (
            cards.map((card, index) => (
              <Card
                title={card.frame_name}
                area={card.area_name}
                career={card.career_name}
                /*PLACEHOLDER*/
                percentage="15%"
                onClick={() => handleCardClick(card.process_id)} // Al hacer clic, navega a la página de detalles
              />
            ))
          ) : (
            <p>No se encontraron procesos</p>
          )}
        </div>
      </div>
      <AppFooter />
    </>
  );
};

export default MainMenu;
