import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../services/api"
import { AppHeader, AppFooter, SubHeading } from "../common";
import Card from "../components/Card";

const MainMenu = () => {
  const [cards, setCards] = useState([]);
  const [percentages, setPercentages] = useState({});
  const location = useLocation();
  const userRpe = localStorage.getItem('rpe');
  const navigate = useNavigate();
  const userRol = localStorage.getItem("role") || "Usuario";

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!userRpe) {
          console.error("userId no está disponible");
          return;
        }

        const response = await api.get("api/ProcesosUsuario", {
          params: { userRpe },
          headers: {
            "Authorization": `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (response.status !== 200) {
          throw new Error("Error al obtener los datos");
        }

        const data = response.data;
        setCards(data);

        // Ahora cargamos los porcentajes
        const percentagesMap = {};
        for (const card of data) {
          let estRes = {};
          try {
            if (userRol === "ADMINISTRADOR") {
              estRes = await api.get(`/estadisticas/${userRpe}/${card.frame_name}/${card.career_name}`);
            } else if (userRol === "PROFESOR" || userRol === "DEPARTAMENTO UNIVERSITARIO") {
              estRes = await api.get(`/estadisticas/por-autor/${userRpe}/${card.frame_name}/${card.career_name}`);
              console.log("estRes: ", estRes.data[0]?.aprobado, userRpe, card.frame_name, card.career_name);
            }
            

            percentagesMap[card.process_id] = estRes?.data[0]?.aprobado ?? 0;
          } catch (error) {
            console.warn(`Error obteniendo porcentaje para ${card.process_id}`, error);
            percentagesMap[card.process_id] = 0;
          }
        }
        setPercentages(percentagesMap);

      } catch (error) {
        console.error("Error al obtener los datos:", error);
      }
    };

    fetchData();
  }, []);

  const handleCardClick = (processId, frameName, careerName) => {
    localStorage.setItem("frameName", frameName);
    localStorage.setItem("careerName", careerName)
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
            cards.map((card) => (
              <Card
                key={card.process_id}
                title={card.frame_name}
                area={card.area_name}
                career={card.career_name}
                percentage={`${percentages[card.process_id] ?? 0}%`}
                onClick={() => handleCardClick(card.process_id, card.frame_name, card.career_name)}
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
