import React from "react";
import Card from "../components/Card";

const cards = [
  { title: "I.C.", description: "Marco de Referencia", year: 2018, percentage: "82%" },
  { title: "T.C.", description: "Normativa General", year: 2019, percentage: "90%" },
  { title: "A.B.", description: "Guía de Estudio", year: 2020, percentage: "75%" },
];

const MainMenu = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-[34px] font-semibold text-black font-['Open_Sans']">
        Menú Principal
        </h1>
      <div className="flex gap-4 flex-wrap">
        {cards.map((card, index) => (
          <Card key={index} {...card} />
        ))}
      </div>
    </div>
  );
};

export default MainMenu;
