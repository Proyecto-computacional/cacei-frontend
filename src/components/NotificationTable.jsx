import React, { useState } from "react";
import { Trash2, Pin, PinOff } from "lucide-react";
import '../app.css';

const deleteNoti = (id) => {
    console.log("Eliminar notificacion", id);
}

const pinNoti = (id) => {
    console.log("Anclar notificacion", id);
}

const listNotifications = [
    { id: 1, proceso: "Ingeniería en Computación", criterio: "Criterio 2.1", estatus: "No aprobada", comentario: "Formato incompleto", pin: false },
    { id: 2, proceso: "Ingeniería Civil", criterio: "Criterio 3.2", estatus: "Pendiente", comentario: "En revisión por el comité", pin: true },
    { id: 3, proceso: "Ingeniería Mecánica", criterio: "Criterio 1.3", estatus: "Aprobada", comentario: "Cumple con los requisitos", pin: false },
    { id: 4, proceso: "Ingeniería Eléctrica", criterio: "Criterio 4.1", estatus: "No aprobada", comentario: "Falta documentación", pin: false },
    { id: 5, proceso: "Ingeniería Industrial", criterio: "Criterio 2.4", estatus: "Pendiente", comentario: "Requiere correcciones menores", pin: true },
]

const NotificationsTable = () => {
    const [notifications] = useState([...listNotifications].sort((a, b) => b.pin - a.pin));


    const [nextPage, setNextPage] = useState(null);
    const [loading, setLoading] = useState(false);

    const loadMore = () => {
        if (!nextPage) return;
        setLoading(true);

        axios.get(nextPage).then(({ data }) => {
            console.log(data);
            setUsers((prev) => [...prev, ...data.usuarios.data]);
            setNextPage(data.usuarios.next_page_url);
            setLoading(false);
        });
    };


    return (
        <div className="overflow-x-auto overflow-y-scroll max-h-75 w-120 text-center bg-neutral-400 p-2" onScroll={(e) => {
            const bottom = e.target.scrollHeight - e.target.scrollTop <= e.target.clientHeight + 1;
            if (bottom && !loading) loadMore();
        }}>
            <p className="my-3 text-2xl inline-block text-white">Notificaciones</p>
            <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
                <tbody>
                    {notifications.map((noti) => (
                        <tr key={noti.id} className="border-b !hover:bg-gray-100">
                            <td className="py-2 px-2">{noti.proceso}</td>
                            <td className="py-2 px-2">{noti.criterio}</td>
                            <td className="py-2 px-2">{noti.estatus}</td>
                            <td className="py-2 px-2 h-full flex gap-4 justify-center align-middle">
                                <button onClick={() => pinNoti(noti.id)}>
                                    {noti.pin ? (
                                        <PinOff />
                                    ) : (
                                        <Pin />
                                    )}
                                </button>
                                <button onClick={() => deleteNoti(noti.id)}><Trash2 /></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button className=" w-full bg-primary1 text-white border-white px-4 text-2xl sticky bottom-0" >Ver todo</button>
        </div>
    );
}

export default NotificationsTable;