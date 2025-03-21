import { useState, useEffect } from "react";
import axios from "axios";
import "../../app.css"
import { MessageCircle, Check, X } from "lucide-react";
import { use } from "react";
import Feedback from "./FeedBack";

export default function EvidenceTable() {


    //const [evidences, setEvidences] = useState([]);
    const [nextPage, setNextPage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [openFeedback, setOpenFeedback] = useState(false);
    const [idEvidenceFeedback, setIdEvidenceFeedback] = useState(null);
    const [statusFeedback, setStatusFeedback] = useState(null)
    const [feedback, setFeedback] = useState(null)

    useEffect(() => {
        console.log("Evidencia :", idEvidenceFeedback,
            "\nStatus: ", statusFeedback,
            "\nFeedback: ", feedback);
    }, [feedback]
    );

    const handleFeedback = (id, status) => {
        setOpenFeedback(true);
        setIdEvidenceFeedback(id);
        setStatusFeedback(status);
    }

    const evidences = [
        {
            id: 1,
            name: "Juan Pérez",
            user_rpe: 123456,
            responsable: "María López",
            process: "Ingeniería en Computación",
            criterio: "Criterio 2.1",
            archivo: [
                { file_name: "evidencia_luis.xlsx", file_path: "../evidences/evidencia_luis.xlsx" },
                { file_name: "evidencia_luis.xlsx", file_path: "../evidences/evidencia_luis.xlsx" }
            ],
        },
        {
            id: 2,
            name: "Ana Gómez",
            user_rpe: 789012,
            responsable: "Carlos Ramírez",
            process: "Ingeniería Civil",
            criterio: "Criterio 3.2",
            archivo: [],
        },
        {
            id: 3,
            name: "Luis Fernández",
            user_rpe: 345678,
            responsable: "Sofía Torres",
            process: "Ingeniería en Sistemas",
            criterio: "Criterio 1.4",
            archivo: [
                { file_name: "evidencia_luis.xlsx", file_path: "../evidences/evidencia_luis.xlsx" },
                { file_name: "evidencia_luis.xlsx", file_path: "../evidences/evidencia_luis.xlsx" }
            ],
        },
        {
            id: 4,
            name: "Marta Rodríguez",
            user_rpe: 901234,
            responsable: "José Martínez",
            process: "Ingeniería Química",
            criterio: "Criterio 5.3",
            archivo: [],
        },
        {
            id: 5,
            name: "Pedro Sánchez",
            user_rpe: 567890,
            responsable: "Elena Vargas",
            process: "Ingeniería Mecánica",
            criterio: "Criterio 4.1",
            archivo: [
                { file_name: "evidencia_luis.xlsx", file_path: "../evidences/evidencia_luis.xlsx" },
                { file_name: "evidencia_luis.xlsx", file_path: "../evidences/evidencia_luis.xlsx" }
            ],
        },
    ];


    /*useEffect(() => {
        const url = searchTerm
            ? `http://127.0.0.1:8000/api/usersadmin?search=${searchTerm}`
            : `http://127.0.0.1:8000/api/usersadmin`;

        axios.get(url).then(({ data }) => {
            setEvidences(data.usuarios.data);
            setNextPage(data.usuarios.next_page_url);
        });
    }, [searchTerm]);
*/

    const loadMore = () => {
        if (!nextPage) return;
        setLoading(true);

        axios.get(nextPage).then(({ data }) => {
            setUsers((prev) => [...prev, ...data.usuarios.data]);
            setNextPage(data.usuarios.next_page_url);
            setLoading(false);
        });
    };


    return (
        <>
            <div className="container mx-auto p-5 ">
                <input type="" placeholder="RPE o Correo" className="bg-backgroundFrom text-2xl w-1/2 mb-3 p-1.5"
                    onChange={(e) => setSearchTerm(e.target.value)} />

                <div className="overflow-x-auto overflow-y-scroll max-h-100" onScroll={(e) => {
                    const bottom = e.target.scrollHeight - e.target.scrollTop <= e.target.clientHeight + 1;
                    if (bottom && !loading) loadMore();
                }}>
                    <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md table-fixed">
                        <thead className="sticky top-0 z-0">
                            <tr className="bg-primary1 text-white">
                                <th className="w-3/10 py-3 px-4 text-left">Nombre evidencia</th>
                                <th className="w-4/10 py-3 px-4 text-left">Usuario</th>
                                <th className="w-3/10 py-3 px-4 text-left">Proceso de acreditación</th>
                                <th className="w-3/10 py-3 px-4 text-left">Criterio</th>
                                <th className="w-3/10 py-3 px-4 text-left">Archivo</th>
                                <th className="w-3/10 py-3 px-4 text-left">Revisión</th>
                            </tr>
                        </thead>
                        <tbody>
                            {evidences.length > 0 ? evidences.map((item) => (
                                <tr key={item.user_rpe} className="border-b hover:bg-gray-100">
                                    <td className="py-3 px-4">{item.name}</td>
                                    <td className="py-3 px-4">{item.user_rpe}</td>
                                    <td className="py-3 px-4">{item.process}</td>
                                    <td className="py-3 px-4">{item.criterio}</td>
                                    <td className="py-3 px-4">
                                        {item.archivo.length > 0 ? (
                                            item.archivo.map((file) => (
                                                <><a
                                                    href={file.file_path}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-500 hover:underline"
                                                >
                                                    {file.file_name}
                                                </a> <br />
                                                </>
                                            ))
                                        ) : (
                                            "Sin archivo"
                                        )}
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="flex gap-2">
                                            <button onClick={() => handleFeedback(item.id, 'approved')}>
                                                <Check color="green" size={40} strokeWidth={2} />
                                            </button>
                                            <button onClick={() => handleFeedback(item.id, 'not approved')}>
                                                <X color="red" size={40} strokeWidth={2} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) :
                                <tr>
                                    <td colSpan="4">
                                        <p className="text-2xl text-neutral-500 text-center width-max my-2">No se encontaron usuarios</p>
                                    </td>
                                </tr>
                            }
                        </tbody>
                    </table>
                </div>
            </div>
            {openFeedback && (
                <Feedback cerrar={() => setOpenFeedback(false)}
                    enviar={setFeedback} />
            )}
        </>
    );
}
