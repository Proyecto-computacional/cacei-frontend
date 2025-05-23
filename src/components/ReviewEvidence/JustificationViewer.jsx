import React from "react";
import "../../app.css";

const JustificationViewer = ({ comment, onClose }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-[1000]">
            <div className="bg-white p-6 rounded-lg w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Justificacion de la evidencia</h2>
                
               
                
                {/* Comentario */}
                <div className="bg-gray-100 p-4 rounded mb-4">
                   <p className="whitespace-pre-wrap">{comment || "Sin justificación."}</p>

                </div>
                
                <button
                    onClick={onClose}
                    className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Cerrar
                </button>
            </div>
        </div>
    );
};


export default JustificationViewer;