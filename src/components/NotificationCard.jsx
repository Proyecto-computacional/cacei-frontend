import React from "react";
import { Star, Trash, Pin } from "lucide-react";

const NotificationCard = ({ title, description, pinned, starred, deleted, onDeletedClick, onStarClick, onPinClick }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            {pinned && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                <Pin className="h-3 w-3 mr-1" />
                Fijada
              </span>
            )}
            {starred && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                <Star className="h-3 w-3 mr-1" />
                Favorita
              </span>
            )}
          </div>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">{title}</h2>
          <p className="text-gray-600 text-sm">{description}</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onStarClick}
            className={`p-2 rounded-lg transition-colors duration-200 ${
              starred ? "bg-yellow-100 text-yellow-600" : "hover:bg-gray-100 text-gray-400"
            }`}
          >
            <Star className="h-5 w-5" />
          </button>
          <button
            onClick={onPinClick}
            className={`p-2 rounded-lg transition-colors duration-200 ${
              pinned ? "bg-blue-100 text-blue-600" : "hover:bg-gray-100 text-gray-400"
            }`}
          >
            <Pin className="h-5 w-5" />
          </button>
          <button
            onClick={onDeletedClick}
            className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors duration-200"
          >
            <Trash className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationCard;
