import React from "react";
import { User, Calendar, MessageSquare } from "lucide-react";
import "../../app.css";

const CommentViewer = ({ comment, userData, date, onClose }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-[1000]">
            <div className="bg-white p-6 rounded-lg w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Comentarios del Estado</h2>
                
                {/* Sección de metadatos */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <p className="text-sm text-gray-500">Usuario</p>
                        <p className="font-medium">{userData || "N/A"}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Fecha</p>
                        <p className="font-medium">
                            {date || "N/A"}
                        </p>
                    </div>
                </div>
                
                {/* Comentario */}
                <div className="bg-gray-100 p-4 rounded mb-4">
                    <p className="whitespace-pre-wrap">{comment}</p>
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

export default CommentViewer;