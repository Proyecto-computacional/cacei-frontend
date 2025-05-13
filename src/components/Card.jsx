import React from "react";
import { ChevronRight } from "lucide-react";

const Card = ({ title, career, area, percentage, onClick }) => {
  return (
    <div 
      className="bg-white shadow-lg rounded-xl p-6 cursor-pointer hover:shadow-xl transition-all duration-300 border border-gray-100"
      onClick={onClick}
    >
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
          <span className="text-sm font-semibold text-blue-600">{percentage}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: percentage }}
          />
        </div>
      </div>
    </div>
  );
};

export default Card;
