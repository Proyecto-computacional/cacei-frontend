import React from "react";
import { ChevronRight, CheckCircle } from "lucide-react";

const Card = ({ title, career, area, percentage, finished, onClick }) => {
  return (
    <div 
      className={`bg-white shadow-lg rounded-xl p-6 cursor-pointer hover:shadow-xl transition-all duration-300 border ${
        finished ? 'border-green-300' : 'border-gray-100'
      } relative`}
      onClick={onClick}
    >
      {finished && (
        <div className="absolute top-2 right-2 bg-green-100 text-green-600 p-1 rounded-full">
          <CheckCircle size={16} />
        </div>
      )}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-1">{title}</h3>
          <p className="text-gray-600 text-sm mb-1">{area}</p>
          <p className="text-gray-500 text-sm">{career}</p>
        </div>
        <ChevronRight className="text-gray-400" size={20} />
      </div>
      
      <div className="mt-4">
        <div className="flex items-center justify-between mb-2">
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
