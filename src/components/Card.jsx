import React from "react";

const Card = ({ title, career, area, percentage, onClick }) => {
  return (
    <div className="bg-white shadow-md rounded-xl p-4 w-64"
    onClick={onClick}
    >
      <h3 className="text-blue-700 font-semibold text-lg">{title}</h3>
      <p className="text-gray-700">{area}</p>
      <p className="text-gray-500">{career}</p>
      <p className="text-black font-bold">{percentage}</p>
    </div>
  );
};

export default Card;
