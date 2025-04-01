import React, { useState, useEffect } from "react";
import { Trash2, Pin, PinOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import '../app.css';

const NotificationsTable = () => {
    const [notifications, setNotifications] = useState([]);
    const navigate = useNavigate();
    const userRpe = localStorage.getItem('rpe')
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                if (!userRpe) {
                    console.error("userRpe no está disponible");
                    return;
                }

                const response = await api.post("/api/Notificaciones", 
                    { user_rpe: userRpe },
                    {
                        headers: {
                            "Authorization": `Bearer ${localStorage.getItem("token")}`
                        },
                    }
                );

                if (response.status !== 200) {
                    throw new Error("Error al obtener las notificaciones");
                }

                // Guardar las notificaciones ordenadas (fijados primero)
                setNotifications(response.data.sort((a, b) => b.pin - a.pin));

            } catch (error) {
                console.error("Error al obtener las notificaciones:", error);
            }
        };

        fetchNotifications();
    }, [userRpe]);  // Se ejecuta cuando cambia userRpe

    const pinNoti = (id) => {
        setNotifications((prev) => {
            const updated = prev.map((noti) =>
                noti.id === id ? { ...noti, pin: !noti.pin } : noti
            );

            // Mantener los fijados arriba
            return [...updated.filter(n => n.pin), ...updated.filter(n => !n.pin)];
        });
    };

    const deleteNoti = (id) => {
        setNotifications((prev) => prev.filter((noti) => noti.id !== id));
    };

    return (
        <div className="overflow-x-auto overflow-y-scroll max-h-75 w-120 text-center bg-neutral-400 p-2">
            <p className="my-3 text-2xl inline-block text-white">Notificaciones</p>
            <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
            <tbody>
                {notifications.length > 0 ? (
                    notifications
                    .filter((notif) => notif.seen === false)
                    .map((noti) => (
                        <tr key={noti.id} className="border-b hover:bg-gray-100">
                            {/* Contenedor de título y descripción */}
                            <td className="py-2 px-2 text-left">
                                <div className="flex flex-col">
                                    <span className="font-semibold">{noti.title}</span>
                                    <span className="text-gray-500 text-sm">
                                        {noti.description.length > 20 
                                            ? `${noti.description.slice(0, 20)}...`
                                            : noti.description}
                                    </span>
                                </div>
                            </td>

                            {/* Acciones */}
                            <td className="py-2 px-2 flex gap-4 justify-center items-center">
                                <button onClick={() => pinNoti(noti.id)}>
                                    {noti.pin ? <PinOff className="text-blue-500"/> : <Pin className="text-gray-500"/>}
                                </button>
                                <button onClick={() => deleteNoti(noti.id)}>
                                    <Trash2 className="text-red-500" />
                                </button>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="4" className="py-4 text-gray-500">No hay notificaciones disponibles</td>
                    </tr>
                )}
            </tbody>
            </table>
            <button className="w-full bg-primary1 text-white px-4 text-2xl sticky bottom-0"
                onClick={() => navigate("/notifications")}>
                Ver todo
            </button>
        </div>
    );
}

export default NotificationsTable;
