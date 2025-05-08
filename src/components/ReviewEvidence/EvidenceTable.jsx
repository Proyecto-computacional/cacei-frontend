import { useState, useEffect } from "react";
import "../../app.css"
import { Filter, Check, X } from "lucide-react";
import Feedback from "./Feedback";
import HeaderSort from "./headerSort";
import CommentViewer from "./CommentViewer";
import api from "../../services/api";

export default function EvidenceTable() {


    const [evidences, setEvidences] = useState([]);
    const [filteredEvidences, setFilteredEvidences] = useState([]);
    const [nextPage, setNextPage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [openFeedback, setOpenFeedback] = useState(false);
    const [idEvidenceFeedback, setIdEvidenceFeedback] = useState(null);
    const [statusFeedback, setStatusFeedback] = useState(null)
    const [statusUserRPE, setstatusUserRPE] = useState(null)
    const [sortBy, setSortBy] = useState(null);
    const [order, setOrder] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [user, setUser] = useState(null);
    const [refresh, setRefresh] = useState(false);


    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await api.get('/api/user');
                setUser(response.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchUser();
    }, []);

    const [showCommentModal, setShowCommentModal] = useState(false);
    const [currentComment, setCurrentComment] = useState("");

    const [filters, setFilters] = useState({
        category: '',
        section: '',
        standard: '',
        user: ''
    });

    const categories = [...new Set(evidences.map(item => item.category_name))].filter(Boolean);
    const sections = [...new Set(evidences.map(item => item.section_name))].filter(Boolean);
    const standards = [...new Set(evidences.map(item => item.standard_name))].filter(Boolean);
    const users = [...new Set(evidences.map(item => item.evidence_owner_name))].filter(Boolean);

    const handleSort = (column) => {
        const newOrder = sortBy === column && order === "asc" ? "desc" : "asc";
        setSortBy(column);
        setOrder(newOrder);
    };

    const sendFeedback = async (feedbackText) => {
        try {
            const url = statusFeedback ? 'api/RevisionEvidencias/aprobar' : 'api/RevisionEvidencias/desaprobar';

            const respuesta = await api.post(url, {
                evidence_id: parseInt(idEvidenceFeedback),
                user_rpe: statusUserRPE,
                feedback: feedbackText
            });
            if (respuesta.status === 200) {
                alert(respuesta.data?.message || 'Feedback enviado con éxito');
                setRefresh(prev => !prev)
            }
        } catch (e) {
            console.error(e);
            alert('Error en el servidor');
        }
    };

    const userRole = 'ADMINISTRADOR'; // Esto debería venir de tu contexto/auth
    const isAdmin = userRole === 'ADMINISTRADOR';

    const handleFeedback = (id, userRpe, status, evidence) => {
        setOpenFeedback(true);
        setIdEvidenceFeedback(id);
        setstatusUserRPE(userRpe);
        setStatusFeedback(status);
    }

    useEffect(() => {
        let url = `api/ReviewEvidence?`;
        api.get(url).then(({ data }) => {
            console.log(data);
            setEvidences(() => [...data.evidencias]);
            //setNextPage(data.evidencias.next_page_url);
            //setLoading(false);
        });
    }, [refresh]);

    useEffect(() => {
        let result = evidences;

        if (filters.category) {
            result = result.filter(item => item.category_name === filters.category);
        }

        if (filters.section) {
            result = result.filter(item => item.section_name === filters.section);
        }

        if (filters.standard) {
            result = result.filter(item => item.standard_name === filters.standard);
        }

        if (filters.user) {
            result = result.filter(item => item.evidence_owner_name === filters.user);
        }

        setFilteredEvidences(result);
    }, [filters, evidences]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const resetFilters = () => {
        setFilters({
            category: '',
            section: '',
            standard: '',
            user: ''
        });
    };

    /*const loadMore = () => {
        if (!nextPage) return;
        setLoading(true);

        api.get(nextPage).then(({ data }) => {
            setUsers((prev) => [...prev, ...data.evidence.data]);
            setNextPage(data.evidence.next_page_url);
            setLoading(false);
        });
    };*/
    const canReview = (statuses) => {

        if (user.user_role === "ADMINISTRADOR") {
            return !statuses.some(
                (s) => {
                    return s.status_description === "APROBADA" && s.user_rpe === user.user_rpe
                }
            );
        } else {
            return statuses.some(
                (s) => {
                    return s.status_description === "PENDIENTE" && s.user_rpe === user.user_rpe
                }
            ) && !statuses.some(
                (s) => {
                    return s.status_description === "APROBADA" && s.user_rpe === user.user_rpe
                });
        }

    };

    // Función modificada para manejar cualquier estado
    const handleStatusClick = (statusObj) => {
        // Determinar el texto del comentario
        let comentario = "Sin comentarios";
        if (statusObj && ["Aprobado", "Desaprobado"].includes(statusObj.status_description)) {
            comentario = statusObj.feedback || "Sin comentarios";
        }

        // Mostrar modal para CUALQUIER estado
        setCurrentComment({
            text: comentario,
            user: statusObj?.user_name,
            date: statusObj?.status_date
        });
        setShowCommentModal(true);
    };

    /*const hasDecision = (evidence) => {
        return evidence.statuses?.some(s =>
            ['Aprobado', 'Desaprobado'].includes(s.status_description)
        );
    };*/

    const isFullyApproved = (evidenceId) => {
        const evidence = evidences.find(ev => ev.evidence_id === evidenceId);
        if (!evidence) return false;

        const requiredApprovals = [
            'ADMINISTRADOR',
            'JEFE DE AREA',
            'COORDINADOR DE CARRERA',
            'PROFESOR'
        ].map(role =>
            users.find(u => u.user_role === role)?.user_rpe
        ).filter(Boolean);

        return requiredApprovals.every(rpe =>
            evidence.statuses?.some(s =>
                s.user_rpe === rpe &&
                s.status_description === 'Aprobado'
            )
        );
    };

    return (
        <>
            <div className="container mx-auto p-5 ">
                <div className="mb-6 p-4 bg-white rounded-lg shadow">
                    <div className="flex items-center mb-4">
                        <Filter className="mr-2" size={20} />
                        <h3 className="text-lg font-medium">Filtros de búsqueda</h3>
                        <button
                            onClick={resetFilters}
                            className="ml-auto flex items-center text-sm text-gray-600 hover:text-gray-900"
                        >
                            <X size={16} className="mr-1" />
                            Limpiar filtros
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                            <select
                                name="category"
                                value={filters.category}
                                onChange={handleFilterChange}
                                className="w-full p-2 border border-gray-300 rounded"
                            >
                                <option value="">Todas las categorías</option>
                                {categories.map((category, index) => (
                                    <option key={`cat-${index}`} value={category}>{category}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Sección</label>
                            <select
                                name="section"
                                value={filters.section}
                                onChange={handleFilterChange}
                                className="w-full p-2 border border-gray-300 rounded"
                            >
                                <option value="">Todas las secciones</option>
                                {sections.map((section, index) => (
                                    <option key={`sec-${index}`} value={section}>{section}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Criterio</label>
                            <select
                                name="standard"
                                value={filters.standard}
                                onChange={handleFilterChange}
                                className="w-full p-2 border border-gray-300 rounded"
                            >
                                <option value="">Todos los criterios</option>
                                {standards.map((standard, index) => (
                                    <option key={`std-${index}`} value={standard}>{standard}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Usuario</label>
                            <select
                                name="user"
                                value={filters.user}
                                onChange={handleFilterChange}
                                className="w-full p-2 border border-gray-300 rounded"
                            >
                                <option value="">Todos los usuarios</option>
                                {users.map((user, index) => (
                                    <option key={`usr-${index}`} value={user}>{user}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto overflow-y-scroll max-h-300">
                    <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md table-fixed text-base">
                        <thead className="sticky top-0 z-0">
                            <tr className="bg-primary1 text-white">
                                <HeaderSort column="evidence_owner.user_name" text={"Nombre de usuario"} handleSort={handleSort} sortBy={sortBy} order={order} className="w-[15%]" />
                                <HeaderSort column="process_name" text={"Proceso de acreditación"} handleSort={handleSort} sortBy={sortBy} order={order} className="w-[15%]" />
                                <HeaderSort column="category_name" text={"Categoría"} handleSort={handleSort} sortBy={sortBy} order={order} className="w-[10%]" />
                                <HeaderSort column="section_name" text={"Sección"} handleSort={handleSort} sortBy={sortBy} order={order} className="w-[10%]" />
                                <HeaderSort column="standard_name" text={"Criterio"} handleSort={handleSort} sortBy={sortBy} order={order} className="w-[15%]" />
                                <HeaderSort column="file_id" text={"Archivo(s)"} handleSort={handleSort} sortBy={sortBy} order={order} className="w-[15%]" />
                                <th className="w-[10%] py-2 px-2 text-center text-sm" colSpan={3}>Estatus</th>
                                <th className="w-[10%] py-2 px-2 text-left text-sm" rowSpan={2}>Revisión</th>
                            </tr>
                            <tr className="bg-primary1 text-white">
                                <th className="py-2 px-2 text-sm">Administrador</th>
                                <th className="py-2 px-2 text-sm">Jefe de Área</th>
                                <th className="py-2 px-2 text-sm">Coordinador de Carrera</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredEvidences.length > 0 ? filteredEvidences.map((item) => (
                                <tr key={item.user_rpe} className="border-b hover:bg-gray-100">
                                    <td className="py-2 px-2 truncate text-sm">{item.evidence_owner_name}</td>
                                    <td className="py-2 px-2 truncate text-sm">{item.process_name}</td>
                                    <td className="py-2 px-2 truncate text-sm">{item.category_name}</td>
                                    <td className="py-2 px-2 truncate text-sm">{item.section_name}</td>
                                    <td className="py-2 px-2 truncate text-sm">{item.standard_name}</td>
                                    <td className="py-2 px-2">
                                        {item.files.length > 0 ? (
                                            item.files.map((file, index) => (
                                                <div key={index} className="truncate">
                                                    <a
                                                        href={file.file_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-500 hover:underline truncate text-sm"
                                                    >
                                                        {file.file_name}
                                                    </a>
                                                </div>
                                            ))
                                        ) : (
                                            <span className="text-sm">Sin archivo</span>
                                        )}
                                    </td>
                                    {["ADMINISTRADOR", "JEFE DE AREA", "COORDINADOR"].map((rol) => {
                                        const statusObj = item.statuses.find(s => s.user_role?.toUpperCase() === rol);
                                        const status = statusObj ? statusObj.status_description : "PENDIENTE";
                                        const color = status === "APROBADA" ? "text-green-600"
                                            : status === "NO APROBADA" ? "text-red-600"
                                                : "text-yellow-600";

                                        return (
                                            <td
                                                key={rol}
                                                className={`py-2 px-2 font-semibold ${color} cursor-pointer hover:underline text-sm`}
                                                onClick={() => handleStatusClick(statusObj)}
                                            >
                                                {status}
                                            </td>
                                        );
                                    })}

                                    <td className="py-2 px-2">
                                        {canReview(item.statuses) ? (
                                            <div className="flex gap-2">
                                                <button onClick={() => handleFeedback(item.evidence_id, item.user_rpe, true)}>
                                                    <Check color="green" size={24} strokeWidth={2} />
                                                </button>
                                                <button onClick={() => handleFeedback(item.evidence_id, item.user_rpe, false)}>
                                                    <X color="red" size={24} strokeWidth={2} />
                                                </button>
                                            </div>
                                        ) : (
                                            <p className="text-gray-500 italic text-xs">Ya revisado o aun falta aprobacion de otro usuario</p>
                                        )}
                                    </td>
                                </tr>
                            )) :
                                <tr>
                                    <td colSpan="8" className="py-4 text-center text-gray-500 text-sm">
                                        No se encontraron evidencias con los filtros aplicados
                                    </td>
                                </tr>
                            }
                        </tbody>
                    </table>
                </div>
            </div >
            {showCommentModal && (
                <CommentViewer
                    comment={currentComment.text}
                    userData={currentComment.user}
                    date={currentComment.date}
                    onClose={() => setShowCommentModal(false)}
                />
            )
            }
            {openFeedback && (
                <Feedback
                    cerrar={() => setOpenFeedback(false)}
                    enviar={sendFeedback}
                    statusFeedback={statusFeedback} // Pasamos el estado (aprobación/rechazo)
                />
            )
            }
        </>
    );
}
