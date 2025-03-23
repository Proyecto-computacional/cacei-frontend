import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"; 
import api from "../services/api";
import { AppHeader, AppFooter, SubHeading } from "../common";
import NotificationCard from "../components/NotificationCard"; 

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const location = useLocation();  // Obtener la ubicación para extraer parámetros
  const userRpe = location.state?.rpe;  // Obtener el RPE del usuario desde el estado
  const navigate = useNavigate(); // Usado para navegar a otras rutas

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        if (!userRpe) {
          console.error("userRpe no está disponible");
          return;  // Si no está disponible, no hacemos la solicitud
        }

        // Hacemos la solicitud a la API pasando el `userRpe` y el token en los headers
        const response = await api.post("/Notificaciones", 
          { user_rpe: userRpe },
          {
            headers: {
              "Authorization": `Bearer ${localStorage.getItem("token")}` // Obtención del token del localStorage
            },
          }
        );

        if (response.status !== 200) {
          throw new Error("Error al obtener las notificaciones");
        }

        // Aquí se almacenan las notificaciones en el estado
        const data = response.data;
        setNotifications(data);  
      } catch (error) {
        console.error("Error al obtener las notificaciones:", error);
      }
    };

    fetchNotifications();
  }, [userRpe]); // Solo se ejecuta cuando `userRpe` cambie

  const handlePin = (id) => {
    setNotifications((prev) => {
      const updated = prev.map((notif) =>
        notif.id === id ? { ...notif, pinned: !notif.pinned } : notif
      );

      // Mueve las notificaciones fijadas al inicio
      return [...updated.filter(n => n.pinned), ...updated.filter(n => !n.pinned)];
    });
  };

  const handleNotificationClick = (id) => {
    navigate(`/notification/${id}`, { state: { notificationId: id } });
  };

  return (
    <>
      <AppHeader />
      <SubHeading />
      <div
        className="min-h-screen p-10 pl-18"
        style={{ background: "linear-gradient(180deg, #e1e5eb 0%, #FFF 50%)" }}
      >
        <h1 className="text-[34px] font-semibold text-black mt-6 mb-5">
          Mis Notificaciones
        </h1>
        <div className="space-y-4">
          {notifications.length > 0 ? (
            notifications.map((notif) => (
              <NotificationCard
                key={notif.id}
                title={notif.title}
                description={notif.description}
                pinned={notif.pinned}
                onPinClick={() => handlePin(notif.id)}
                onClick={() => handleNotificationClick(notif.id)} // Navegar a la página de la notificación
              />
            ))
          ) : (
            <p>No se encontraron notificaciones</p>
          )}
        </div>
      </div>
      <AppFooter />
    </>
  );
};

export default Notification;
