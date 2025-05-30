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

  const navigate = useNavigate();

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

  useEffect(() => {
    if (evidence_id) {
      api.get(`api/evidences/${evidence_id}`).then(
        (response) => {
          setEvidence(response.data.evidence);
          setFirstRevisor(response.data.first_revisor);
          setUploadedFiles(response.data.evidence.files);
          setJustification(response.data.evidence.justification || "");

          // Sort statuses by date and time
          if (response.data.evidence.status && response.data.evidence.status.length > 0) {
            response.data.evidence.status.sort((a, b) => {
              const dateA = new Date(a.created_at);
              const dateB = new Date(b.created_at);
              return dateB - dateA; // Sort in descending order (newest first)
            });
          }

          if (response.data.evidence.status && response.data.evidence.status.length > 0) {
            const firstStatus = response.data.evidence.status[0];
            const adminStatus = response.data.evidence.status.find(
              (s) => s.user.user_role === "ADMINISTRADOR"
            );

            // Lock the evidence if it has been approved or is pending
            if (adminStatus) {
              if (adminStatus.status_description === "APROBADA" || adminStatus.status_description === "PENDIENTE") {
                setIsLocked(true);
              } else if (adminStatus.status_description === "NO APROBADA") {
                // Only allow editing if the user is the evidence owner
                const shouldLock = user?.user_rpe !== response.data.evidence.user_rpe;
                setIsLocked(shouldLock);
              }
            } else {
              if (firstStatus.status_description === "NO APROBADA") {
                // Only allow editing if the user is the evidence owner
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

  const handleFileChange = (event) => {
    const allowedExtensions = ['rar', 'zip', 'xls', 'xlsx', 'csv', 'pdf', 'doc', 'docx', 'csv'];
    const maxFileSize = 50 * 1024 * 1024;

    const selectedFiles = Array.from(event.target.files);

    const validFiles = [];

    selectedFiles.forEach((file) => {
      const ext = file.name.split('.').pop().toLowerCase();
      const sizeOk = file.size <= maxFileSize;
      const typeOk = allowedExtensions.includes(ext);

      if (!typeOk) {
        alert(`Archivo rechazado: ${file.name}. Solo se permiten archivos RAR, ZIP, Excel, PDF y Word.`);
      } else if (!sizeOk) {
        alert(`Archivo rechazado: ${file.name}. El tamaño máximo permitido es 50 MB.`);
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

  const handleUpload = async () => {
    if (isFinished) {
      alert("No se pueden subir archivos porque el proceso ha finalizado");
      return;
    }
    setIsLocked(true);

    // Si no hay archivos nuevos y no hay archivos subidos previamente, mostrar error
    if (!files.length && (!uploadedFiles || uploadedFiles.length === 0)) {
      alert("Por favor, selecciona al menos un archivo.");
      setIsLocked(false);
      return;
    }

    try {
      console.log('UploadEvidence - Intentando actualizar justificación:', {
        evidenceId: evidence.evidence_id,
        justification: justification
      });

      // Primero actualizar la justificación de la evidencia
      const response = await api.put(`/api/evidences/${evidence.evidence_id}`, {
        justification: justification
      }, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('token')}`,
          "Content-Type": "application/json",
        },
      });

      console.log('UploadEvidence - Respuesta de actualización de justificación:', response.data);

      if (files.length > 0) {
        const formData = new FormData();
        
        // Agregar evidence_id
        formData.append("evidence_id", evidence.evidence_id);
        
        // Agregar archivos - Modificar la forma de agregar archivos
        Array.from(files).forEach((file, index) => {
          // Usar 'files' en lugar de 'files[]' y agregar el índice
          formData.append(`files[${index}]`, file);
        });

        // Log detallado del FormData
        console.log('UploadEvidence - FormData completo:', {
          evidenceId: evidence.evidence_id,
          files: Array.from(files).map(file => ({
            name: file.name,
            type: file.type,
            size: file.size,
            lastModified: file.lastModified
          })),
          formDataEntries: Array.from(formData.entries()).map(([key, value]) => ({
            key,
            value: value instanceof File ? {
              name: value.name,
              type: value.type,
              size: value.size,
              lastModified: value.lastModified
            } : value
          }))
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
              console.log(`UploadProgress: ${percentCompleted}%`);
            }
          });
          console.log('UploadEvidence - Respuesta de subida de archivos:', response.data);
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

          // Mostrar el contenido completo del error en la consola
          console.log('UploadEvidence - Contenido completo del error:', {
            response: error.response,
            request: error.request,
            config: error.config,
            data: error.response?.data,
            errors: error.response?.data?.errors
          });
          
          // Mostrar mensaje de error más específico
          const errorMessage = error.response?.data?.message || 
                             error.response?.data?.errors?.files?.[0] || 
                             error.response?.data?.errors?.evidence_id?.[0] ||
                             error.message;
          alert(`Error al subir archivo: ${errorMessage}`);
          throw error;
        }
      }

      // Crear status para el primer revisor
      console.log('UploadEvidence - Creando status para revisores:', {
        firstRevisor,
        evidenceId: evidence.evidence_id,
        userRpe: evidence.user_rpe
      });

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

      alert("Cambios guardados con éxito");

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
      alert(`Error al subir archivo: ${error.response?.data?.message || error.message}`);
    }
  };
  const handleDeleteUploadedFile = async (fileId) => {
    if (!window.confirm("¿Seguro que quieres eliminar este archivo?")) return;
    setIsLocked(true);
    try {
      await api.delete(`/api/file/${fileId}`, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('token')}`,
        },
      });
      alert("Archivo eliminado correctamente.");
      setUploadedFiles((prev) => prev.filter((f) => f.file_id !== fileId));
    } catch (error) {
      console.error(error);
      alert("Error al eliminar archivo.");
    }
    setIsLocked(false);
  };

  const handleRemoveFile = (fileName) => {
    setFiles((prev) => prev.filter((file) => file.name !== fileName));
  };

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

  const getIcon = (name) => {
    const extension = name.split('.').pop();

    if (['rar', 'zip', '7z'].includes(extension)) return <FolderArchive />;
    if (extension === 'pdf') return <FileText />;
    if (['csv', 'xls', 'xlsx'].includes(extension)) return <Sheet />;

  };

  const canViewPage = () => {
    if (!user || !evidence) return false;

    const allowedRoles = ["ADMINISTRADOR", "DIRECTIVO"];
    if (allowedRoles.includes(user.user_role)) return true;

    if (user.user_rpe === evidence.user_rpe) return true; // responsable de la evidencia
    if (user.user_rpe === evidence.process.career.user_rpe) return true; // coordinador de carrera
    if (user.user_rpe === evidence.process.career.area.user_rpe) return true; // jefe de área

    return false;
  };

  useEffect(() => {
    if (user && evidence && !canViewPage()) {
      navigate("/mainmenu");
    }
  }, [user, evidence]);

  useEffect(() => {
    if (Finished == 'true'){
      setIsFinished(true);
    }
  })

  return (
    <>
      <AppHeader />
      <SubHeading />
      <div className="h-fit p-10 flex justify-around items-stretch relative gap-6" style={{ background: "linear-gradient(180deg, #e1e5eb 0%, #FFF 50%)" }}>
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
              <h2 className="text-[25px] font-light text-black font-['Open_Sans'] mb-4 self-start">
                Proceso: {evidence.process.process_name}
              </h2>
              <h2 className="text-[25px] font-light text-black font-['Open_Sans'] mb-4 self-start">
                {evidence.standard.section.category.category_name}/
                {evidence.standard.section.section_name}/
                {evidence.standard.standard_name}
              </h2>
              <p className="text-black text-lg font-semibold">Justificación</p>
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
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">Estado de la revisión</p>
                      <p className={`inline-block px-4 py-1.5 rounded-full text-sm font-medium ${getEstadoClass(item.status_description)}`}>
                        {item.status_description}
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
      <AppFooter />
      {showCriteriaGuide && <CriteriaGuide onClose={() => setShowCriteriaGuide(false)} help={evidence?.standard?.help} />}
    </>
  );
};

export default UploadEvidence;