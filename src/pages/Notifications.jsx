import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"; 
import api from "../services/api";
import { AppHeader, AppFooter, SubHeading } from "../common";
import NotificationCard from "../components/NotificationCard";
import { Bell, Filter, Search } from "lucide-react";

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all'); // 'all', 'pinned', 'starred'
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const userRpe = localStorage.getItem('rpe');
  const navigate = useNavigate();

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

        setNotifications(response.data);
      } catch (error) {
        console.error("Error al obtener las notificaciones:", error);
      }
    };

    fetchNotifications();
  }, [userRpe]);

  const handlePin = async (id) => {
    try {  
      const currentNotif = notifications.find((notif) => notif.notification_id === id);
      if (!currentNotif) return;
  
      const newPinnedState = !currentNotif.pinned;
      
      const response = await api.put(
        "/api/Notificaciones/pinned",
        { notification_id: currentNotif.notification_id },
        {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      if (response.status !== 200) {
        throw new Error("Error al fijar la notificación");
      }
  
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.notification_id === id ? { ...notif, pinned: newPinnedState } : notif
        )
      );
  
    } catch (error) {
      console.error("Error en handlePin:", error);
    }
  };

  const handleStarred = async (id) => {
    try {  
      const currentNotif = notifications.find((notif) => notif.notification_id === id);
      if (!currentNotif) return;
      
      const response = await api.put(
        "/api/Notificaciones/favorite",
        { notification_id: currentNotif.notification_id },
        {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      if (response.status !== 200) {
        throw new Error("Error al fijar la notificación");
      }
  
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.notification_id === id ? { ...notif, starred: !notif.starred } : notif
        )
      );
  
    } catch (error) {
      console.error("Error en handleStarred:", error);
    }
  };

  const handleDelete = async (id) => {
    try {  
      const currentNotif = notifications.find((notif) => notif.notification_id === id);
      if (!currentNotif) return;
      
      const response = await api.put(
        "/api/Notificaciones/deleted",
        { notification_id: currentNotif.notification_id },
        {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      if (response.status !== 200) {
        throw new Error("Error al eliminar la notificación");
      }
  
      setNotifications((prev) => prev.filter((notif) => notif.notification_id !== id));
  
    } catch (error) {
      console.error("Error en handleDeleted:", error);
    }
  };

  const handleNotificationClick = (id) => {
    navigate(`/notification/${id}`, { state: { notificationId: id } });
  };

  const filteredNotifications = notifications
    .filter((notif) => {
      const matchesSearch =
        notif.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        notif.description.toLowerCase().includes(searchQuery.toLowerCase());

      switch (filter) {
        case 'pinned':
          return notif.pinned && matchesSearch;
        case 'starred':
          return notif.starred && matchesSearch;
        default:
          return matchesSearch;
      }
    })
    .sort((a, b) => {
      // Ordenar primero por si están fijadas
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;

      // Luego por fecha (más recientes primero)
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });


  return (
    <>
      <AppHeader />
      <SubHeading />
      <div
        className="min-h-screen p-10 pl-18"
        style={{ background: "linear-gradient(180deg, #e1e5eb 0%, #FFF 50%)" }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="bg-[#004A98] p-2 rounded-lg">
                <Bell className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-[34px] font-bold text-gray-800">
                Mis Notificaciones
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Buscar notificaciones..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004A98] focus:border-transparent"
                />
              </div>
              <div className="relative">
                <button
                  onClick={() => setFilter(filter === 'all' ? 'pinned' : filter === 'pinned' ? 'starred' : 'all')}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <Filter className="h-5 w-5 text-gray-600" />
                  <span className="text-gray-700">
                    {filter === 'all' ? 'Todas' : 
                     filter === 'pinned' ? 'Fijadas' : 'Favoritas'}
                  </span>
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((notif) => (
                <NotificationCard
                  key={notif.notification_id}
                  title={notif.title}
                  description={notif.description}
                  pinned={notif.pinned}
                  starred={notif.starred}
                  deleted={notif.seen}
                  notification_date={notif.notification_date}
                  onDeletedClick={() => handleDelete(notif.notification_id)}
                  onStarClick={() => handleStarred(notif.notification_id)}
                  onPinClick={() => handlePin(notif.notification_id)}
                />
              ))
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  No hay notificaciones
                </h3>
                <p className="text-gray-500">
                  {searchQuery ? 'No se encontraron notificaciones que coincidan con tu búsqueda.' :
                   filter !== 'all' ? 'No hay notificaciones en esta categoría.' :
                   'No tienes notificaciones pendientes.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <AppFooter />
    </>
  );
};

export default Notification;
