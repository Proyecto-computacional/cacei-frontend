import { useState, useEffect } from "react";
import "../../app.css"
import { MessageCircle, Check, X } from "lucide-react";
import { use } from "react";
import Feedback from "./Feedback";
import HeaderSort from "./headerSort";
import cacei from "../../services/api";

export default function EvidenceTable() {


    const [evidences, setEvidences] = useState([]);
    const [nextPage, setNextPage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [openFeedback, setOpenFeedback] = useState(false);
    const [idEvidenceFeedback, setIdEvidenceFeedback] = useState(null);
    const [statusFeedback, setStatusFeedback] = useState(null)
    const [feedback, setFeedback] = useState(null)
    const [sortBy, setSortBy] = useState("name");
    const [order, setOrder] = useState("asc");
    const [searchTerm, setSearchTerm] = useState("");


    const handleSort = (column) => {
        const newOrder = sortBy === column && order === "asc" ? "desc" : "asc";
        setSortBy(column);
        setOrder(newOrder);
    };

    useEffect(() => {
        console.log("Evidencia :", idEvidenceFeedback,
            "\nStatus: ", statusFeedback,
            "\nFeedback: ", feedback);

        //Generar notificación
        /*axios.post(url).then(({ data }) => {
            setEvidences((prev) => [...prev, ...data.evidences.data]);
            setNextPage(data.evidence.next_page_url);
            setLoading(false);
            });
        });*/
    }, [feedback]
    );

    const handleFeedback = (id, status) => {
        setOpenFeedback(true);
        setIdEvidenceFeedback(id);
        setStatusFeedback(status);
    }

    useEffect(() => {
        let url = `api/ReviewEvidence?`;

        if (searchTerm) {
            url += `search=${searchTerm}`;
        }
        if (sortBy) {
            url += `&sort_by=${sortBy}`;
        }
        if (order) {
            url += `&order=${order}`;
        }

        console.log("consulta url", url);

        cacei.get(url).then(({ data }) => {
            setEvidences(() => [...data.evidencias.data]);
            setNextPage(data.evidencias.next_page_url);
            setLoading(false);
            console.log(data.evidencias.data);
        });

    }, [searchTerm, sortBy, order]);

    /*useEffect(() => {
        //console.log(`http://127.0.0.1:8000/api/evidences?sort_by=${sortBy}&order=${order}`);
        axios
            .get(`http://127.0.0.1:8000/api/evidences?sort_by=${sortBy}&order=${order}`)
            .then((response) => {
                setUsers(response.data.data);
                setPagination({
                    currentPage: response.data.current_page,
                    totalPages: response.data.last_page,
                });
            })
    }, [sortBy, order]);*/

    /*useEffect(() => {
        const url = searchTerm
            ? `http://127.0.0.1:8000/api/evidences?search=${searchTerm}`
            : `http://127.0.0.1:8000/api/evidences`;
    
        axios.get(url).then(({ data }) => {
            setEvidences(data.usuarios.data);
            setNextPage(data.usuarios.next_page_url);
        });
    }, [searchTerm]);*/

    const loadMore = () => {
        if (!nextPage) return;
        setLoading(true);

        axios.get(nextPage).then(({ data }) => {
            setUsers((prev) => [...prev, ...data.evidence.data]);
            setNextPage(data.evidence.next_page_url);
            setLoading(false);
        });
    };


    return (
        <>
            <div className="container mx-auto p-5 ">
                <input type="" placeholder="Usuario , proceso de acreditación, o criterio" className="bg-backgroundFrom text-2xl w-1/2 mb-3 p-1.5"
                    onChange={(e) => setSearchTerm(e.target.value)} />

                <div className="overflow-x-auto overflow-y-scroll max-h-300" onScroll={(e) => {
                    const bottom = e.target.scrollHeight - e.target.scrollTop <= e.target.clientHeight + 1;
                    if (bottom && !loading) loadMore();
                }}>
                    <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md table-fixed text-2xl">
                        <thead className="sticky top-0 z-0">
                            <tr className="bg-primary1 text-white">
                                <HeaderSort column="evidence_owner.user_name" text={"Nombre de usuario"} handleSort={handleSort} sortBy={sortBy} order={order} />
                                <HeaderSort column="process_name" text={"Proceso de acreditación"} handleSort={handleSort} sortBy={sortBy} order={order} />
                                <HeaderSort column="standard_name" text={"Criterio"} handleSort={handleSort} sortBy={sortBy} order={order} />
                                <HeaderSort column="file_id" text={"Archivo(s)"} handleSort={handleSort} sortBy={sortBy} order={order} />
                                <th className="w-3/10 py-3 px-4 text-left">Revisión</th>
                            </tr>
                        </thead>
                        <tbody>
                            {evidences !== null && evidences.length > 0 ? evidences.map((item) => (
                                <tr key={item.user_rpe} className="border-b hover:bg-gray-100">
                                    <td className="py-3 px-4">{item.evidence_owner_name}</td>
                                    <td className="py-3 px-4">{item.process_name}</td>
                                    <td className="py-3 px-4">{item.standard_name}</td>
                                    <td className="py-3 px-4">
                                        {item.files.length > 0 ? (
                                            item.files.map((file) => (
                                                <><a
                                                    href={file.file_url}
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
                                        <p className="text-2xl text-neutral-500 text-center width-max my-2">No se encontaron evidencias</p>
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
