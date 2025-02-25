import React from "react";
import Card from "../components/Card";
import { AppHeader } from "../common";
import { AppFooter } from "../common";

const cards = [
  { title: "I.C.", description: "Marco de Referencia", year: 2018, percentage: "82%" },
  { title: "T.C.", description: "Normativa General", year: 2019, percentage: "90%" },
  { title: "A.B.", description: "Guía de Estudio", year: 2020, percentage: "75%" },
];

const MainMenu = () => {
  return (
    <>
      <AppHeader></AppHeader>
      <div className="min-h-screen p-10 pl-18" style={{ background: "linear-gradient(180deg, #BEC7D3 0%, #FFF 50%)" }}>
        <h1 className="text-[34px] font-semibold text-black font-['Open_Sans'] mt-6 mb-5">
          Menú Principal
          </h1>
        <div className="flex gap-4 flex-wrap">
          {cards.map((card, index) => (
            <Card key={index} {...card} />
          ))}
        </div>
      </div>
      <AppFooter></AppFooter>
    </>
  );
};

export default MainMenu;
