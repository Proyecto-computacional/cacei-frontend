import React from "react";

const Card = ({ title, description, year, percentage }) => {
  return (
    <div className="bg-white shadow-md rounded-xl p-4 w-64">
      <h3 className="text-blue-700 font-semibold text-lg">{title}</h3>
      <p className="text-gray-700">{description}</p>
      <p className="text-gray-500">{year}</p>
      <p className="text-black font-bold">{percentage}</p>
    </div>
  );
};

export default Card;
