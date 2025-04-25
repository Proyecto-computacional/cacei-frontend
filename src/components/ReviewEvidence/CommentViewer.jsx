import React from "react";
import "../../app.css";

const CommentViewer = ({ comment, onClose }) => (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white p-6 rounded-lg w-11/12 max-w-md">
        <h2 className="text-xl font-bold mb-3">Comentarios</h2>
        <div className="bg-gray-50 p-4 rounded border mb-4 min-h-20">
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
  
  export default CommentViewer;