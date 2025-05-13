import React, { useState, useEffect } from "react";
import { Trash2, Pin, PinOff, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const NotificationsTable = () => {
    const [notifications, setNotifications] = useState([]);
    const navigate = useNavigate();
    const userRpe = localStorage.getItem('rpe');
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
    }, [userRpe]);

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

    const unreadNotifications = notifications.filter(notif => !notif.seen);

    return (
        <div className="w-96 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-800">Notificaciones</h3>
                </div>
            </div>

            <div className="max-h-96 overflow-y-auto">
                {unreadNotifications.length > 0 ? (
                    unreadNotifications.map((noti) => (
                        <div 
                            key={noti.id} 
                            className="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors"
                        >
                            <div className="flex justify-between items-start gap-3">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        {noti.pin && (
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                                <Pin className="h-3 w-3 mr-1" />
                                                Fijada
                                            </span>
                                        )}
                                    </div>
                                    <h4 className="font-medium text-gray-900 mb-1">{noti.title}</h4>
                                    <p className="text-sm text-gray-600 line-clamp-2">
                                        {noti.description}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button 
                                        onClick={() => pinNoti(noti.id)}
                                        className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                                    >
                                        {noti.pin ? (
                                            <PinOff className="w-4 h-4 text-blue-500" />
                                        ) : (
                                            <Pin className="w-4 h-4 text-gray-400" />
                                        )}
                                    </button>
                                    <button 
                                        onClick={() => deleteNoti(noti.id)}
                                        className="p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="p-8 text-center">
                        <p className="text-gray-500">No hay notificaciones nuevas</p>
                    </div>
                )}
            </div>

            <div className="p-3 bg-gray-50 border-t border-gray-200">
                <button 
                    onClick={() => navigate("/notifications")}
                    className="w-full py-2 px-4 bg-[#004A98] text-white rounded-lg hover:bg-[#003d7a] transition-colors text-sm font-medium"
                >
                    Ver todas las notificaciones
                </button>
            </div>
        </div>
    );
};

export default NotificationsTable;
