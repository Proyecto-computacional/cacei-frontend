import React from "react";
import "../../app.css";
import { FileText } from "lucide-react";

// FilesViewer.jsx
export default function FilesViewer({ files, onClose }) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                <h2 className="text-lg font-semibold mb-4">Archivos</h2>

                {files.files.map((file, index) => (
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
                }

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


