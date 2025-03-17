import React, { useState } from "react";
import { AppHeader, AppFooter, SubHeading } from "../common";
import NotificationCard from "../components/NotificationCard";

const initialNotifications = [
  { id: 1, title: "Sección 2.3.4 pendiente", description: "Están pendientes las evidencias de la sección 2.3.4.", pinned: false },
  { id: 2, title: "Sección 6.4.8 aprobada", description: "Se aprobaron las evidencias subidas a la sección 6.4.8.", pinned: false },
  { id: 3, title: "Sección 1.5.7 denegada", description: "Se negaron las evidencias subidas a la sección 1.5.7. Favor de checar la sección de retroalimentación para generar las correcciones pedidas.", pinned: false },
  { id: 4, title: "Sección 5.1.1 Cambios en los criterios de la sección", description: "Se realizaron cambios a los criterios de la sección 5.1.1. Puede observarlos en la guía de ayuda.", pinned: false },
];

const Notification = () => {
  const [notifications, setNotifications] = useState(initialNotifications);

  const handlePin = (id) => {
    setNotifications((prev) => {
      const updated = prev.map((notif) =>
        notif.id === id ? { ...notif, pinned: !notif.pinned } : notif
      );

      // Mueve las notificadas fijadas al inicio
      return [...updated.filter(n => n.pinned), ...updated.filter(n => !n.pinned)];
    });
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
          {notifications.map((notif) => (
            <NotificationCard
              key={notif.id}
              title={notif.title}
              description={notif.description}
              pinned={notif.pinned}
              onPinClick={() => handlePin(notif.id)}
            />
          ))}
        </div>
      </div>
      <AppFooter />
    </>
  );
};

export default Notification;
