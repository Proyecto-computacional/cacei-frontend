import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams, Link, resolvePath } from "react-router-dom";
import { AppHeader, AppFooter, SubHeading } from "../common";
import FeedbackModal from "../components/Feedback";
import CriteriaGuide from "../components/CriteriaGuide";
import '../app.css';
import api from "../services/api";
import { FileQuestion, Sheet, FileText, FolderArchive, X } from "lucide-react";
import EditorCacei from "../components/EditorCacei";
import LoadingSpinner from "../components/LoadingSpinner";
import ModalAlert from "../components/ModalAlert";

const UploadEvidence = () => {
  const [files, setFiles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [justification, setJustification] = useState(null);
  const [evidence, setEvidence] = useState(null);
  const [firstRevisor, setFirstRevisor] = useState(null);
  const [asignaciones, setAsignaciones] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const refInputFiles = useRef(null);
  const { evidence_id } = useParams();
  const [user, setUser] = useState(null);
  const [isLocked, setIsLocked] = useState(false);
  const [showCriteriaGuide, setShowCriteriaGuide] = useState(false);
  const Finished = localStorage.getItem('finished');
  const [isFinished, setIsFinished] = useState(false);
  const [relatedEvidences, setRelatedEvidences] = useState([]);
  const [modalAlertMessage, setModalAlertMessage] = useState(null);

  const navigate = useNavigate();

  // Obtener información del usuario
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

  // Obtener información de la evidencia
  useEffect(() => {
    if (evidence_id) {
      api.get(`api/evidences/${evidence_id}`).then(
        (response) => {
          setEvidence(response.data.evidence);
          setFirstRevisor(response.data.first_revisor);
          setUploadedFiles(response.data.evidence.files);
          setJustification(response.data.evidence.justification || "");

          // Ordena por fecha y hora más reciente
          if (response.data.evidence.status && response.data.evidence.status.length > 0) {
            response.data.evidence.status.sort((a, b) => {
              const dateA = new Date(a.created_at ?? a.status_date ?? 0);
              const dateB = new Date(b.created_at ?? b.status_date ?? 0);
              return dateB - dateA;
            });
          }

          if (response.data.evidence.status && response.data.evidence.status.length > 0) {
            const firstStatus = response.data.evidence.status[0];
            const adminStatus = response.data.evidence.status.find(
              (s) => s.user.user_role === "ADMINISTRADOR"
            );

            // Bloquea la evidencia si ha sido aprobada o está pendiente
            if (adminStatus) {
              if (adminStatus.status_description === "APROBADA" || adminStatus.status_description === "PENDIENTE") {
                setIsLocked(true);
              } else if (adminStatus.status_description === "NO APROBADA") {
                // Solo permite la edición si el usuario es el propietario de la evidencia
                const shouldLock = user?.user_rpe !== response.data.evidence.user_rpe;
                setIsLocked(shouldLock);
              }
            } else {
              if (firstStatus.status_description === "NO APROBADA") {
                // Solo permite la edición si el usuario es el propietario de la evidencia
                const shouldLock = user?.user_rpe !== response.data.evidence.user_rpe;
                setIsLocked(shouldLock);
              } else if (
                firstStatus.status_description === "APROBADA" ||
                firstStatus.status_description === "PENDIENTE"
              ) {
                setIsLocked(true);
              }
            }
          } else {
            if (response.data.evidence.files && response.data.evidence.files.length > 0) {
              setIsLocked(true);
            } else {
              setIsLocked(false);
            }
          }
        }).catch(error => {
          if (error.response && error.response.status === 401) {
            navigate("/mainmenu");
          }
        });
    }
  }, [evidence_id, user]);

  // ¿Revisa si el usuario tiene asignaciones?
  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const assignmentsResponse = await api.get('/api/my-assignments');
        setAsignaciones(assignmentsResponse.data);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          navigate("/mainmenu");
        }
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  // ¿Obtiene las evidencias transversales?
  useEffect(() => {
  if (evidence?.standard?.is_transversal) {
    const fetchRelatedEvidences = async () => {
      try {
        const response = await api.get(`/api/evidences/by-standard/${evidence.standard.standard_id}`);
        setRelatedEvidences(response.data.filter(e => e.evidence_id !== evidence.evidence_id));
      } catch (error) {
        console.error("Error fetching related evidences:", error);
      }
    };
    fetchRelatedEvidences();
  }
}, [evidence]);

  // Revisa la información del archivo a subir ¿¡¿Esto no lo hacía ya backend?!?!
  const handleFileChange = (event) => {
    const allowedExtensions = ['rar', 'zip', 'xls', 'xlsx', 'csv', 'pdf', 'doc', 'docx', 'csv'];
    const maxFileSize = 50 * 1024 * 1024;

    const selectedFiles = Array.from(event.target.files);

    const validFiles = [];

    selectedFiles.forEach((file) => {
      const ext = file.name.split('.').pop().toLowerCase();
      const sizeOk = file.size <= maxFileSize;
      const typeOk = allowedExtensions.includes(ext);
      const [modalAlertMessage, setModalAlertMessage] = useState(null);


      if (!typeOk) {
        setModalAlertMessage(`Archivo rechazado: ${file.name}. Solo se permiten archivos RAR, ZIP, Excel, PDF y Word.`);
      } else if (!sizeOk) {
        setModalAlertMessage(`Archivo rechazado: ${file.name}. El tamaño máximo permitido es 50 MB.`);
      } else {
        validFiles.push(file);
      }
    });

    if (validFiles.length > 0) {
      setFiles((prevFiles) => {
        const existingNames = new Set(prevFiles.map(f => f.name));
        const uniqueNewFiles = validFiles.filter(f => !existingNames.has(f.name));
        return [...prevFiles, ...uniqueNewFiles];
      });
    }

    refInputFiles.current.value = "";
  };

  // Sube los archivos y la justificación
  const handleUpload = async () => {
    if (isFinished) {
      setModalAlertMessage("No se pueden subir archivos porque el proceso ha finalizado");
      return;
    }
    setIsLocked(true);

    // Si no hay archivos nuevos y no hay archivos subidos previamente, mostrar error
    if (!files.length && (!uploadedFiles || uploadedFiles.length === 0)) {
      setModalAlertMessage("Por favor, selecciona al menos un archivo.");
      setIsLocked(false);
      return;
    }

    try {
      // Actualizar justificación en todas las evidencias relacionadas si es transversal
      if(evidence.standard.is_transversal && relatedEvidences.length>0){
        const allEvidences = [evidence, ...relatedEvidences];

        // Actualizar justificaciones en paralelo
        await Promise.all(
          allEvidences.map(ev =>
            api.put(`/api/evidences/${ev.evidence_id}`, {
              justification: justification
            }, {
              headers: {
                "Authorization": `Bearer ${localStorage.getItem('token')}`,
                "Content-Type": "application/json",
              },
            })
          )
        );
      } else {

      // Primero actualizar la justificación de la evidencia
      const response = await api.put(`/api/evidences/${evidence.evidence_id}`, {
        justification: justification
      }, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('token')}`,
          "Content-Type": "application/json",
        },
      });
    }

      

      if (files.length > 0) {
        // Subir archivos a la evidencia principal y a las relacionadas si es transversal
      if (evidence.standard.is_transversal && relatedEvidences.length > 0) {
        // Subir a todas las evidencias (incluyendo la principal)
        const allEvidences = [evidence, ...relatedEvidences];
        
        for (const targetEvidence of allEvidences) {
          const formData = new FormData();
          formData.append("evidence_id", targetEvidence.evidence_id);
          
          Array.from(files).forEach((file, index) => {
            formData.append(`files[${index}]`, file);
          });

          await api.post("/api/file", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
        }
      } else {
        const formData = new FormData();

        // Agregar evidence_id
        formData.append("evidence_id", evidence.evidence_id);

        // Agregar archivos - Modificar la forma de agregar archivos
        Array.from(files).forEach((file, index) => {
          // Usar 'files' en lugar de 'files[]' y agregar el índice
          formData.append(`files[${index}]`, file);
        });


        try {
          const response = await api.post("/api/file", formData, {
            headers: {
              "Authorization": `Bearer ${localStorage.getItem('token')}`,
              "Content-Type": "multipart/form-data",
            },
            // Agregar configuración para manejar archivos grandes
            maxContentLength: Infinity,
            maxBodyLength: Infinity,
            onUploadProgress: (progressEvent) => {
              const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            }
          });
        } catch (error) {
          // Log detallado del error
          console.error('UploadEvidence - Error detallado:', {
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            errors: error.response?.data?.errors,
            message: error.message,
            requestData: {
              evidenceId: evidence.evidence_id,
              files: Array.from(files).map(file => ({
                name: file.name,
                type: file.type,
                size: file.size
              }))
            }
          });
          // Mostrar mensaje de error más específico
          const errorMessage = error.response?.data?.message ||
            error.response?.data?.errors?.files?.[0] ||
            error.response?.data?.errors?.evidence_id?.[0] ||
            error.message;
          setModalAlertMessage(`Error al subir archivo: ${errorMessage}`);
          throw error;
        }
        }
      }

      for (const revisor of firstRevisor) {
        await api.post(`/api/RevisionEvidencias/pendiente`, {
          user_rpe: evidence.user_rpe,
          reviser_rpe: revisor,
          evidence_id: evidence.evidence_id,
          feedback: null
        }, {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem('token')}`,
          }
        });
      }

      setModalAlertMessage("Cambios guardados con éxito");

      await api.get(`api/evidences/${evidence_id}`).then(
        (response) => {
          setEvidence(response.data.evidence);
          setUploadedFiles(response.data.evidence.files);
          setJustification(response.data.evidence.justification || "");
        }
      );
      setFiles([]);

      // Bloquear la pantalla después de subir
      setIsLocked(true);

    } catch (error) {
      setIsLocked(false);
      console.error("Error al subir archivo", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        stack: error.stack
      });
      setModalAlertMessage(`Error al subir archivo: ${error.response?.data?.message || error.message}`);
    }
  };

  // Elimina un archivo subido
  const handleDeleteUploadedFile = async (fileId) => {
    if (!window.confirm("¿Seguro que quieres eliminar este archivo?")) return;
    setIsLocked(true);
    try {
      await api.delete(`/api/file/${fileId}`, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setModalAlertMessage("Archivo eliminado correctamente.");
      setUploadedFiles((prev) => prev.filter((f) => f.file_id !== fileId));
    } catch (error) {
      console.error(error);
      setModalAlertMessage("Error al eliminar archivo.");
    }
    setIsLocked(false);
  };

  // Elimina el archivo a subir
  const handleRemoveFile = (fileName) => {
    setFiles((prev) => prev.filter((file) => file.name !== fileName));
  };

  // Obtiene la clase CSS según el estado
  
  
  const getEstadoClass = (estado) => {
    switch (estado) {
      case "NO CARGADA":
        return "bg-gray-100 text-gray-600";
      case "PENDIENTE":
        return "bg-yellow-50 text-yellow-600";
      case "NO APROBADA":
        return "bg-red-50 text-red-600";
      case "APROBADA":
        return "bg-green-50 text-green-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  // Obtiene el ícono (del archivo a subir) según la extensión
  const getIcon = (name) => {
    const extension = name.split('.').pop();

    if (['rar', 'zip', '7z'].includes(extension)) return <FolderArchive />;
    if (extension === 'pdf') return <FileText />;
    if (['csv', 'xls', 'xlsx'].includes(extension)) return <Sheet />;

  };

  // Revisa si el usuario puede ver la página
  const canViewPage = () => {
    if (!user || !evidence) return false;

    const allowedRoles = ["ADMINISTRADOR", "DIRECTIVO"];
    if (allowedRoles.includes(user.user_role)) return true;

    if (user.user_rpe === evidence.user_rpe) return true; // responsable de la evidencia
    if (user.user_rpe === evidence.process.career.user_rpe) return true; // coordinador de carrera
    if (user.user_rpe === evidence.process.career.area.user_rpe) return true; // jefe de área

    return false;
  };

  // Revisa si actualmente el usuario puede ver la página
  useEffect(() => {
    if (user && evidence && !canViewPage()) {
      navigate("/mainmenu");
    }
  }, [user, evidence]);

  // Revisa si el proceso ha finalizado (y bloquear interacciones)
  useEffect(() => {
    if (Finished == 'true') {
      setIsFinished(true);
    }
  })

  // HTML ------------------------------------------------------------------------------------------------------------------------------
  return (
    <>
      <AppHeader />
      <SubHeading />

      
      <div className="min-h-screen p-10 pl-18" style={{ background: "linear-gradient(180deg, #e1e5eb 0%, #FFF 50%)" }}>
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 pt-4 pb-2 pl-8 pr-8 w-full">
            <div className="flex items-center gap-4 mb-6">
              <div>
                <h1 className="text-4xl font-bold text-gray-800 font-['Open_Sans'] tracking-tight mb-3">
                  Carga de evidencias
                </h1>
                <p className="text-lg text-gray-700 leading-relaxed">
                Consulte y cargue sus tareas asignadas en base a una categoría, indicador y criterios
              </p>
              </div>
            </div>
          </div>
        <div className="h-fit p-10 flex justify-around items-stretch relative gap-6" >
          

          {/* Cuadro de asignaciones */}
          <div className="w-1/4 bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
            <div className="bg-primary1 p-3">
              <h2 className="text-lg font-semibold text-white text-center">Mis asignaciones</h2>
            </div>
            {isLoading ? (
              <div className="relative min-h-[200px]" style={{ paddingTop: "10px" }}>
                <LoadingSpinner />
              </div>
            ) : asignaciones.length > 0 ? ( 
              <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
                {/* Lista de asignaciones */}
                {asignaciones.map((item, index) => (
                  <Link
                    key={index}
                    to={`/uploadEvidence/${item.evidence_id}`}
                    className={`block p-3 transition-colors duration-200 no-underline ${
                      evidence_id === item.evidence_id.toString()
                        ? 'bg-primary1/10 border-l-4 border-primary1'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className={`font-medium text-base flex-1 truncate ${
                        evidence_id === item.evidence_id.toString()
                          ? 'text-primary1'
                          : 'text-gray-800'
                      }`}>{item.criterio}</p>
                      <span className={`px-2 py-0.5 rounded-full text-sm font-medium whitespace-nowrap ${getEstadoClass(item.estado)}`}>
                        {item.estado}
                        {/*DEBUGGING*/}
                        <script>
                          console.log("item.estado:", item.estado);
                        </script>
                      </span>
                      
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center">
                <p className="text-gray-500 text-lg mb-2">No tienes asignaciones</p>
                <p className="text-gray-400 text-sm">
                  No hay evidencias asignadas para revisar en este momento.
                </p>
              </div>
            )}
          </div>
          {/* Cuadro donde interactúa con la evidencia */}
          {evidence_id && evidence ? (
            <div className="bg-white p-6 rounded-xl shadow-md flex flex-wrap flex-row w-3/4 min-h-[500px]">
              <div className="flex flex-col flex-1 mr-10 w-1/2">
                <h1 className="text-[40px] font-semibold text-black font-['Open_Sans'] mt-2 self-start">
                  Subir Evidencia
                </h1>
                {isFinished && (
                  <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
                    <p className="font-bold">Proceso finalizado</p>
                    <p>No se pueden subir más evidencias porque el proceso de evaluación ha concluido.</p>
                  </div>
                )}
                {/* Información de la evidencia */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-3 mt-4 mb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="bg-[#004A98] p-1.5 rounded">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <h2 className="text-lg font-bold text-gray-800">Información de la Evidencia</h2>
                  </div>
                  
                  <div className="space-y-3">
                    {/* Proceso */}
                    <div className="flex items-center gap-2 p-2 bg-blue-50 rounded border border-blue-200">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#004A98]" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <span className="text-s font-medium text-gray-600">Proceso:</span>
                        <span className="ml-1 font-semibold text-gray-900 text-sm">{evidence.process.process_name}</span>
                      </div>
                    </div>

                    {/* Jerarquía de la evidencia */}
                    <div>
                      <div className="flex items-center gap-1 text-s text-gray-600 mb-1.5">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="font-medium">Ubicación:</span>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-1.5">
                        <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-full px-2 py-1 shadow-sm">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-[#004A98]" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0h8v12H6V4z" clipRule="evenodd" />
                          </svg>
                          <span className="text-s text-gray-500">Categoría</span>
                          <span className="font-semibold text-gray-900 text-s">{evidence.standard.section.category.category_name}</span>
                        </div>
                        
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                        
                        <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-full px-2 py-1 shadow-sm">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-[#004A98]" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-s text-gray-500">Indicador</span>
                          <span className="font-semibold text-gray-900 text-s">{evidence.standard.section.section_name}</span>
                        </div>
                        
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                        
                        <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-full px-2 py-1 shadow-sm">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-[#004A98]" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span className="text-s text-gray-500">Criterio</span>
                          <span className="font-semibold text-gray-900 text-s">{evidence.standard.standard_name}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-black text-lg font-semibold">Justificación</p>
                {/* Editor integrado de CKEditor (en EditorCacei.jsx) */}
                <EditorCacei setJustification={setJustification} value={justification} readOnly={user?.user_rpe !== evidence.user_rpe || isLocked} />
                {user?.user_rpe === evidence.user_rpe && (
                  <div className="mt-4 flex">
                    <label className="w-9/10 p-2 border rounded bg-gray-100 text-gray-600 cursor-pointer flex justify-center items-center">
                      Ingresa el archivo aquí
                      <input
                        type="file"
                        className="hidden"
                        multiple
                        onChange={handleFileChange}
                        ref={refInputFiles}
                        disabled={isLocked || isFinished}
                      />
                    </label>
                    <div className="w-1/10"><FileQuestion size={50} onClick={() => { setShowCriteriaGuide(true) }} /></div>
                  </div>
                )}
                {/* Para subir archivos */}
                {files && files.map((file) => (
                  <div className="mt-4 flex items-center justify-between gap-2 p-2 border rounded bg-gray-100 text-gray-600">
                    <span className="text-2xl">{getIcon(file.name)}</span>
                    <p className="font-semibold text-left flex-grow">{file.name}</p>
                    {!isLocked && !isFinished && (<X className="cursor-pointer" onClick={() => { handleRemoveFile(file.name) }} />)}
                  </div>
                ))}
                {uploadedFiles && uploadedFiles.map((file) => (
                  <div className="mt-4 flex items-center justify-between gap-2 p-2 border rounded bg-gray-100 text-gray-600">
                    <span className="text-2xl">{getIcon(file.file_name)}</span>
                    <p className="font-semibold text-left flex-grow">{file.file_name}</p>
                    <p className="font-semibold text-left flex-grow">{file.upload_date}</p>
                    {!isLocked && !isFinished && (<X className="cursor-pointer" onClick={() => { handleDeleteUploadedFile(file.file_id) }} />)}
                  </div>
                ))}
                {user?.user_rpe === evidence.user_rpe && !isLocked && !isFinished && (
                  <button className="bg-[#004A98] text-white px-20 py-2 mt-5 mx-auto rounded-full" onClick={handleUpload} disabled={isLocked}>Guardar</button>
                )}
              </div>
              {/* Cuadro de revisión (la info del revisor, pues) */}
              <div className="w-1/2 overflow-y-auto max-h-[700px]">
                <h1 className="text-[40px] font-semibold text-black font-['Open_Sans'] mt-2 self-start">
                  Revisión
                </h1>
                {evidence.status.map((item, index) => (
                  <div key={index} className="border rounded-lg bg-white shadow-sm p-4 my-4">
                    <div className="border-b pb-3 mb-3">
                      <div className="flex items-center gap-2 mb-2">
                        <p className="text-sm text-gray-500">Revisor:</p>
                        <p className="text-gray-800 font-semibold">{item.user.user_name}</p>
                        <span className="px-2 py-0.5 text-xs font-medium bg-primary1/10 text-primary1 rounded-full">
                          {item.user.user_role}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-gray-500">Fecha y hora de revisión:</p>
                        <p className="text-gray-800">
                          {new Date(item.status_date).toLocaleDateString('es-MX', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: false,                 // <-- 24 horas
                            timeZone: 'America/Mexico_City' // <-- Zona horaria de Ciudad de México
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        {/* Obtiene el estado de la revisión */}
                        <p className="text-sm font-medium text-gray-600 mb-1">Estado de la revisión</p>
                        <p className={`inline-block px-4 py-1.5 rounded-full text-sm font-medium ${getEstadoClass(item.status_description)}`}>
                          {item.status_description}
                          {/*DEBUGGING*/}
                          <script>
                          console.log("item.status_description:", item.status_description);
                          </script>
                        </p>
                        
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">Retroalimentación</p>
                        <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                          <p className="text-gray-700 whitespace-pre-wrap">{item.feedback || "Sin retroalimentación"}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="w-7/10"></div>
          )}
        </div>
      </div>
      <AppFooter />
      {showCriteriaGuide && <CriteriaGuide onClose={() => setShowCriteriaGuide(false)} help={evidence?.standard?.help} />}
      <ModalAlert
        isOpen={modalAlertMessage !== null}
        message={modalAlertMessage}
        onClose={() => setModalAlertMessage(null)}
      />

    </>
  );
};

export default UploadEvidence;