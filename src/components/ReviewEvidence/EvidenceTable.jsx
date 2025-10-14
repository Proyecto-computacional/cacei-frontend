import { useState, useEffect } from "react";
import "../../app.css"
import { Filter, Check, X, FileText } from "lucide-react";
import Feedback from "./Feedback";
import HeaderSort from "./headerSort";
import CommentViewer from "./CommentViewer";
import JustificationViewer from "./JustificationViewer";
import api from "../../services/api";
import LoadingSpinner from "../LoadingSpinner";
import ModalAlert from "../ModalAlert";

export default function EvidenceTable() {


    const [evidences, setEvidences] = useState([]);
    const [filteredEvidences, setFilteredEvidences] = useState([]);
    const [openFeedback, setOpenFeedback] = useState(false);
    const [idEvidenceFeedback, setIdEvidenceFeedback] = useState(null);
    const [statusFeedback, setStatusFeedback] = useState(null)
    const [statusUserRPE, setstatusUserRPE] = useState(null)
    const [sortBy, setSortBy] = useState(null);
    const [order, setOrder] = useState(null);
    const [user, setUser] = useState(null);
    const [refresh, setRefresh] = useState(false);
    const [showJustificationModal, setShowJustificationModal] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [modalAlertMessage, setModalAlertMessage] = useState(null);


    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await api.get('/api/user');
                setUser(response.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    const [showCommentModal, setShowCommentModal] = useState(false);
    const [currentComment, setCurrentComment] = useState("");

    const [filters, setFilters] = useState({
        process: '',
        category: '',
        section: '',
        standard: '',
        user: ''
    });

    const process = [...new Set(evidences.map(item => item.process_name))].filter(Boolean);
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
        
            // 1. Obtener la evidencia actual
            const currentEvidence = evidences.find(ev => ev.evidence_id == idEvidenceFeedback);
            const isTransversal = currentEvidence?.is_transversal || false;
        
            // 2. Si es transversal, obtener todas las evidencias del mismo criterio
            let evidencesToProcess = [currentEvidence];
        
            if (isTransversal) {
                const transversalEvidences = evidences.filter(ev => 
                    ev.standard_id === currentEvidence.standard_id && 
                    ev.evidence_id !== currentEvidence.evidence_id
                );
                evidencesToProcess = [...evidencesToProcess, ...transversalEvidences];
            }

            // 3. Procesar cada evidencia individualmente
            const results = [];
            for (const evidence of evidencesToProcess) {
                try {
                    const response = await api.post(url, {
                        evidence_id: parseInt(evidence.evidence_id),
                        user_rpe: statusUserRPE,
                        feedback: feedbackText
                    });
                    results.push({
                        success: true,
                        evidenceId: evidence.evidence_id,
                        message: response.data?.message
                    });
                } catch (error) {
                    results.push({
                        success: false,
                        evidenceId: evidence.evidence_id,
                        message: error.response?.data?.message || error.message
                    });
                }
            }

            // 4. Mostrar resumen al usuario
            const successful = results.filter(r => r.success).length;
            const failed = results.filter(r => !r.success).length;
            
            if (failed === 0) {
                setModalAlertMessage(isTransversal 
                    ? `Se ${statusFeedback ? 'aprobaron' : 'rechazaron'} ${successful} evidencias correctamente` 
                    : 'Operación realizada con éxito');
            } else {
                setModalAlertMessage(`Se completaron ${successful} operaciones, pero fallaron ${failed}.`);
            }
            
            setRefresh(prev => !prev);
        } catch (e) {
            console.error(e);
            setModalAlertMessage('Error en el servidor: ' + (e.response?.data?.message || e.message));
        } finally {
            setOpenFeedback(false);
        }
    };



    const handleFeedback = (id, userRpe, status, evidence) => {
        setOpenFeedback(true);
        setIdEvidenceFeedback(id);
        setstatusUserRPE(userRpe);
        setStatusFeedback(status);
    }

    useEffect(() => {
        let url = `api/ReviewEvidence?`;
        api.get(url).then(({ data }) => {
            // Process file URLs to ensure they have the correct base URL
            const processedEvidences = data.evidencias.map(evidence => ({
                ...evidence,
                files: evidence.files.map(file => ({
                    ...file,
                    file_url: file.file_url.startsWith('http') ? file.file_url : `${window.location.origin}/storage/${file.file_url}`
                }))
            }));
            setEvidences(() => [...processedEvidences]);
        });
    }, [refresh]);

    useEffect(() => {
        let result = evidences;

        if (filters.process) {
            result = result.filter(item => item.process_name === filters.process);
        }

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
            process: '',
            category: '',
            section: '',
            standard: '',
            user: ''
        });
    };







    const canReview = (statuses) => {
        if (!user) return false;

        // Get the most recent status for each role
        const getMostRecentStatus = (role) => {
            return statuses
                .filter(s => s.user_role?.toUpperCase() === role)
                .sort((a, b) => {
                    const dateA = new Date(a.status_date).getTime();
                    const dateB = new Date(b.status_date).getTime();
                    if (dateA === dateB) {
                        const indexA = statuses.findIndex(s => s === a);
                        const indexB = statuses.findIndex(s => s === b);
                        return indexB - indexA;
                    }
                    return dateB - dateA;
                })[0];
        };

        if (user.user_role === "ADMINISTRADOR") {
            const adminStatus = getMostRecentStatus("ADMINISTRADOR");
            return !adminStatus || adminStatus.status_description !== "APROBADA" || adminStatus.user_rpe !== user.user_rpe;
        } else {
            const userRoleStatus = getMostRecentStatus(user.user_role);
            return userRoleStatus &&
                userRoleStatus.status_description === "PENDIENTE" &&
                userRoleStatus.user_rpe === user.user_rpe;
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
            text: statusObj?.feedback || "Sin comentarios",
            status: statusObj?.status_description || "Sin estado", // Añade esto
            user: statusObj?.user_name,
            date: statusObj?.status_date
        });
        setShowCommentModal(true);


    };

    const handleJustificationClick = (justification) => {
        setSelectedFile({
            text: justification || "Sin justificación"
        });
        setShowJustificationModal(true);
    }
    const handleJustificationClose = () => {
        setShowJustificationModal(false);
    };

    return (
        <>
            <div className="container mx-auto p-5 ">
                {loading}  {/* Pantalla de carga poco elegante ¿la tienen todas las páginas? */}

                {/* Cuadro de filtros */}
                <div className="mb-8 p-6 bg-white rounded-xl shadow-md border border-gray-100">
                    <div className="flex items-center mb-6">
                        <Filter className="mr-3 text-primary1" size={24} />
                        <h3 className="text-xl font-semibold text-gray-800">Filtros de búsqueda</h3>
                        <button
                            onClick={resetFilters}
                            className="ml-auto flex items-center text-sm text-gray-600 hover:text-primary1 transition-colors duration-200"
                        >
                            <X size={18} className="mr-2" />
                            Limpiar filtros
                        </button>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Proceso</label>
                        <select
                            name="process"
                            value={filters.process}
                            onChange={handleFilterChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary1 focus:border-primary1 transition-all duration-200"
                        >
                            <option value="">Todos los procesos</option>
                            {process.map((process, index) => (
                                <option key={`sec-${index}`} value={process}>{process}</option>
                            ))}
                        </select>
                    </div>
                    <tr>
                        <td colSpan="8" className="h-6"></td>
                    </tr>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
                            <select
                                name="category"
                                value={filters.category}
                                onChange={handleFilterChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary1 focus:border-primary1 transition-all duration-200"
                            >
                                <option value="">Todas las categorías</option>
                                {categories.map((category, index) => (
                                    <option key={`cat-${index}`} value={category}>{category}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Indicador</label>
                            <select
                                name="section"
                                value={filters.section}
                                onChange={handleFilterChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary1 focus:border-primary1 transition-all duration-200"
                            >
                                <option value="">Todos los indicadores</option>
                                {sections.map((section, index) => (
                                    <option key={`sec-${index}`} value={section}>{section}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Criterio</label>
                            <select
                                name="standard"
                                value={filters.standard}
                                onChange={handleFilterChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary1 focus:border-primary1 transition-all duration-200"
                            >
                                <option value="">Todos los criterios</option>
                                {standards.map((standard, index) => (
                                    <option key={`std-${index}`} value={standard}>{standard}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Usuario</label>
                            <select
                                name="user"
                                value={filters.user}
                                onChange={handleFilterChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary1 focus:border-primary1 transition-all duration-200"
                            >
                                <option value="">Todos los usuarios</option>
                                {users.map((user, index) => (
                                    <option key={`usr-${index}`} value={user}>{user}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {!user ? (
                    <div className="text-center py-12 bg-white rounded-xl shadow-md">
                        <LoadingSpinner />
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-primary1">
                                    <tr>
                                        <HeaderSort column="evidence_owner.user_name" text={"Nombre de usuario"} handleSort={handleSort} sortBy={sortBy} order={order} className="w-[15%] py-4 px-6 text-left text-sm font-semibold text-white" />
                                        <HeaderSort column="process_name" text={"Proceso de acreditación"} handleSort={handleSort} sortBy={sortBy} order={order} className="w-[15%] py-4 px-6 text-left text-sm font-semibold text-white" />
                                        <HeaderSort column="category_name" text={"Categoría"} handleSort={handleSort} sortBy={sortBy} order={order} className="w-[10%] py-4 px-6 text-left text-sm font-semibold text-white" />
                                        <HeaderSort column="section_name" text={"Indicador"} handleSort={handleSort} sortBy={sortBy} order={order} className="w-[10%] py-4 px-6 text-left text-sm font-semibold text-white" />
                                        <HeaderSort column="standard_name" text={"Criterio"} handleSort={handleSort} sortBy={sortBy} order={order} className="w-[15%] py-4 px-6 text-left text-sm font-semibold text-white" />
                                        <HeaderSort column="file_id" text={"Archivo(s)"} handleSort={handleSort} sortBy={sortBy} order={order} className="w-[15%] py-4 px-6 text-left text-sm font-semibold text-white" />
                                        <HeaderSort column="Justificacion" text={"Justificacion de evidencia"} handleSort={handleSort} sortBy={sortBy} order={order} className="w-[15%] py-4 px-6 text-center text-sm font-semibold text-white" />

                                        <th className="w-[10%] py-4 px-6 text-center text-sm font-semibold text-white" colSpan={3}>Estatus</th>
                                        <th className="w-[10%] py-4 px-6 text-left text-sm font-semibold text-white" rowSpan={2}>Revisión</th>


                                    </tr>
                                    <tr className="bg-primary1/90">
                                        <th className="py-3 px-6 text-sm font-medium text-white">Administrador</th>
                                        <th className="py-3 px-6 text-sm font-medium text-white">Jefe de área</th>
                                        <th className="py-3 px-6 text-sm font-medium text-white">Coordinador de Carrera</th>

                                    </tr>

                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredEvidences.length > 0 ? filteredEvidences.map((item) => (
                                        <tr key={`${item.evidence_id}-${item.statuses[0]?.status_date}`} className="hover:bg-gray-50 transition-colors duration-200">
                                            <td className="py-4 px-6 text-sm text-gray-900">{item.evidence_owner_name}</td>
                                            <td className="py-4 px-6 text-sm text-gray-900">{item.process_name}</td>
                                            <td className="py-4 px-6 text-sm text-gray-900">{item.category_name}</td>
                                            <td className="py-4 px-6 text-sm text-gray-900">{item.section_name}</td>
                                            <td className="py-4 px-6 text-sm text-gray-900">
                                                <div className="flex flex-col items-center justify-center gap-1">  {/* Centrado vertical y horizontal */}
                                                    <span>{item.standard_name}</span>
                                                    {item.is_transversal && (
                                                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 w-fit">
                                                            Transversal
                                                        </span>
                                                    )}
                                                </div>
                                            </td>

                                            <td className="py-4 px-6">
                                                {item.files.length > 0 ? (
                                                    item.files.map((file, index) => (
                                                        <div key={index} className="mb-1">
                                                            <a
                                                                href={file.file_url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-primary1 hover:text-primary1/80 hover:underline text-sm flex items-center"
                                                            >
                                                                <FileText size={16} className="mr-2" />
                                                                {file.file_name}
                                                            </a>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <span className="text-sm text-gray-500 italic">Sin archivo</span>
                                                )}
                                            </td>
                                            <td className="py-4 px-6 text-sm text-gray-900">
                                                {item.justification ? (
                                                    <button
                                                        onClick={() => handleJustificationClick(item.justification)}
                                                        className="text-blue-500 hover:underline"
                                                    >
                                                        Ver justificación
                                                    </button>
                                                ) : (
                                                    <span className="text-sm text-gray-500 italic">Sin justificación</span>
                                                )}
                                            </td>
                                            {["ADMINISTRADOR", "JEFE DE AREA", "COORDINADOR DE CARRERA"].map((rol) => {
                                                // Get all statuses for this role, sorted by date and preserving original order
                                                const roleStatuses = item.statuses
                                                    .filter(s => s.user_role?.toUpperCase() === rol)
                                                    .sort((a, b) => {
                                                        // First try to sort by date
                                                        const dateA = new Date(a.status_date).getTime();
                                                        const dateB = new Date(b.status_date).getTime();

                                                        // If dates are the same, use the original array order
                                                        if (dateA === dateB) {
                                                            // Find the original indices in the full statuses array
                                                            const indexA = item.statuses.findIndex(s => s === a);
                                                            const indexB = item.statuses.findIndex(s => s === b);
                                                            return indexB - indexA; // Later in array = more recent
                                                        }

                                                        return dateB - dateA;
                                                    });

                                                // Count only final statuses (APROBADA or NO APROBADA)
                                                const finalStatuses = roleStatuses.filter(s =>
                                                    s.status_description === "APROBADA" ||
                                                    s.status_description === "NO APROBADA"
                                                );

                                                // Get the most recent status
                                                const statusObj = roleStatuses[0];
                                                const status = statusObj ? statusObj.status_description : "PENDIENTE";
                                                const color = status === "APROBADA" ? "text-green-600 bg-green-50"
                                                    : status === "NO APROBADA" ? "text-red-600 bg-red-50"
                                                        : "text-yellow-600 bg-yellow-50";

                                                return (
                                                    <td
                                                        key={rol}
                                                        className={`py-4 px-6 text-sm font-medium ${color} cursor-pointer hover:opacity-80 transition-opacity duration-200 rounded-md`}
                                                        onClick={() => handleStatusClick(statusObj)}
                                                    >
                                                        {status}
                                                    </td>
                                                );
                                            })}

                                            <td className="py-4 px-6">
                                                {canReview(item.statuses) ? (
                                                    <div className="flex gap-3">
                                                        <button
                                                            onClick={() => handleFeedback(item.evidence_id, item.user_rpe, true)}
                                                            className="p-2 rounded-full hover:bg-green-50 transition-colors duration-200"
                                                        >
                                                            <Check color="green" size={24} strokeWidth={2} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleFeedback(item.evidence_id, item.user_rpe, false)}
                                                            className="p-2 rounded-full hover:bg-red-50 transition-colors duration-200"
                                                        >
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
                                            <td colSpan="8" className="py-8 text-center text-gray-500 text-sm">
                                                No se encontraron evidencias con los filtros aplicados
                                            </td>
                                        </tr>
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
            {showCommentModal && (
                <CommentViewer
                    comment={currentComment.text}
                    userData={currentComment.user}
                    date={currentComment.date}
                    onClose={() => setShowCommentModal(false)}
                />
            )}
            {openFeedback && (
                <Feedback
                    cerrar={() => setOpenFeedback(false)}
                    enviar={sendFeedback}
                    statusFeedback={statusFeedback}
                />
            )}
            {showJustificationModal && (
                <JustificationViewer
                    file={selectedFile}
                    onClose={handleJustificationClose}
                />
            )}
            <ModalAlert
                isOpen={modalAlertMessage !== null}
                message={modalAlertMessage}
                onClose={() => setModalAlertMessage(null)}
            />
        </>
    );
}
