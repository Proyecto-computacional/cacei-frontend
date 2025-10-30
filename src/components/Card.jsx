import React from "react";
import { ChevronRight, CheckCircle, Calendar, Clock } from "lucide-react";

const Card = ({ title, frame, career, area, percentage, finished, startDate, endDate, dueDate, onClick }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'No definida';
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString().slice(-2);
    return `${day}/${month}/${year}`;
  };

  return (
    <div 
      className={`bg-white shadow-lg rounded-xl p-6 cursor-pointer hover:shadow-xl transition-all duration-300 border ${
        finished ? 'border-green-300' : 'border-gray-100'
      } relative`}
      onClick={onClick}
    >
      {finished && (
        <div className="absolute top-4 right-4 bg-green-100 text-green-600 p-2 rounded-full">
          <CheckCircle size={16} />
        </div>
      )}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-1">{title}</h3>
        </div>
        <ChevronRight className="text-gray-400" size={20} />
      </div>
      
      <div className="space-y-3">
        <div className="text-sm flex items-center gap-2 text-gray-500">
          <span>{frame}</span>
        </div>

        <div className="flex items-center gap-2 text-gray-600">
          <span>{area}</span>
        </div>
        
        <div className="flex items-center gap-2 text-gray-600">
          <span>{career}</span>
        </div>

        <div className="flex items-center gap-4 text-gray-600">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <div className="flex items-center gap-1 text-sm">
              <span className="font-medium">Inicio:</span>
              <span>{(startDate)}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <div className="flex items-center gap-1 text-sm">
              <span className="font-medium">Fin:</span>
              <span>{(endDate)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium text-gray-600">Progreso</span>
          <span className={`text-sm font-semibold ${
            finished ? 'text-green-600' : 'text-blue-600'
          }`}>{percentage}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${
              finished ? 'bg-green-500' : 'bg-blue-600'
            }`}
            style={{ width: percentage }}
          />
        </div>
      </div>
      {finished && (
        <div className="mt-2 text-right">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Completado
          </span>
        </div>
      )}
    </div>
  );
};

export default Card;
