import React from "react";
import "../../app.css";

// JustificationViewer.jsx
export default function JustificationViewer({ file, onClose }) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                <h2 className="text-lg font-semibold mb-4">Justificación</h2>

                <div
                    className="prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: file?.text || "<p>Sin justificación</p>" }}
                />
                <div className="mt-4 text-right">
                    <button
                        onClick={onClose}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
}



