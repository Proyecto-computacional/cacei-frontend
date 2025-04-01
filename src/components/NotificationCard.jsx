import React from "react";
import { Star, Trash, Pin } from "lucide-react";

const NotificationCard = ({ title, description, pinned, starred, deleted, onDeletedClick, onStarClick, onPinClick }) => {
  return (
    <div className="bg-white p-4 shadow-md rounded-lg flex justify-between items-center">
      <div>
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-gray-600 italic">{description}</p>
      </div>
      <div className="flex space-x-3">
        <Star 
          className={`cursor-pointer ${
            starred ? "text-yellow-500" : "text-gray-500" 
          } hover:text-yellow-500`}
          onClick={(e) => {
            e.stopPropagation();
            onStarClick();
          }}
          />
        <Trash className={`cursor-pointer ${
          deleted ? "text-red-500" : "text-gray-500"
        } hover:text-red-500`}
          onClick={(e) => {
            e.stopPropagation();
            onDeletedClick();
          }}
          />
        <Pin
          className={`cursor-pointer ${
            pinned ? "text-blue-500" : "text-gray-500"
          } hover:text-blue-500`}
          onClick={(e) => {
            e.stopPropagation(); 
            onPinClick();
          }}
        />
      </div>
    </div>
  );
};

export default NotificationCard;
