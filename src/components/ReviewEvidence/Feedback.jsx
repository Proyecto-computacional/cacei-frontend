import { useState } from "react";
import "../../app.css"
import { AlertTriangle, CheckCircle, XCircle } from "lucide-react";

const Feedback = ({ enviar, cerrar, statusFeedback }) => {
    const [feedback, setFeedback] = useState("");
    const [confirmacionAbierta, setConfirmacionAbierta] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleConfirmacion = async () => {
        if (!feedback.trim()) {
            alert("La justificación no puede estar en blanco");
            return;
        }
        setError("");
        setLoading(true);
        try {
            // Sanitizar el feedback eliminando caracteres especiales y scripts
            const sanitizedFeedback = feedback
                .replace(/<[^>]*>/g, '') // Elimina etiquetas HTML
                .replace(/[<>]/g, '') // Elimina < y >
                .trim(); // Elimina espacios al inicio y final

            await enviar(sanitizedFeedback);
            cerrar();
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Modal de Feedback Principal */}
            <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
                <div className="bg-white p-6 rounded-lg w-full max-w-md">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        {statusFeedback ? (
                            <CheckCircle className="text-green-500" />
                        ) : (
                            <XCircle className="text-red-500" />
                        )}
                        Retroalimentación
                    </h2>

                    <textarea
                        value={feedback}
                        onChange={(e) => {
                            setFeedback(e.target.value);
                            setError("");
                        }}
                        placeholder="Escribe tus comentarios..."
                        className={`w-full p-3 border rounded mb-2 min-h-[120px] ${error ? 'border-red-500' : ''}`}
                    />
                    {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                    <div className="flex justify-end gap-2">
                        <button
                            onClick={cerrar}
                            className="px-4 py-2 bg-gray-300 rounded"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={() => setConfirmacionAbierta(true)}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Enviar
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal de Confirmación */}
            {confirmacionAbierta && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md">
                        <div className="flex items-center gap-3 mb-4">
                            <AlertTriangle className="text-yellow-500" size={24} />
                            <h3 className="text-lg font-bold">Confirmar acción</h3>
                        </div>

                        <p className="mb-4">
                            ¿Estás seguro que deseas {statusFeedback ? "aprobar" : "rechazar"} esta evidencia?
                            <br />
                            <span className="font-semibold">Esta acción no se puede deshacer.</span>
                        </p>

                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setConfirmacionAbierta(false)}
                                className="px-4 py-2 bg-gray-300 rounded"
                                disabled={loading}
                            >
                                Volver
                            </button>
                            <button
                                onClick={handleConfirmacion}
                                className={`px-4 py-2 ${statusFeedback
                                    ? "bg-green-500 hover:bg-green-600"
                                    : "bg-red-500 hover:bg-red-600"
                                    } text-white rounded`}
                                disabled={loading}
                            >
                                {loading ? (
                                    <span className="inline-block animate-spin">↻</span>
                                ) : statusFeedback ? (
                                    "Sí, aprobar"
                                ) : (
                                    "Sí, rechazar"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Feedback;