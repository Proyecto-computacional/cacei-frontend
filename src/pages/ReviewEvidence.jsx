import React from "react";
import { AppHeader, AppFooter, SubHeading } from "../common";
import EvidenceTable from "../components/ReviewEvidence/EvidenceTable";
import '../app.css'

const ReviewEvidence = () => {
  return (
    <>
      <AppHeader />
      <SubHeading />
      <div className="min-h-screen p-10 pl-18" style={{ background: "linear-gradient(180deg, #e1e5eb 0%, #FFF 50%)" }}>
        {/* Titulo de página */}
        <h1 className="text-[34px] font-semibold text-black font-['Open_Sans'] mt-2 mb-2">
          Revisión de evidencias
        </h1>
        <p className="text-gray-600 mt-6">
                Consulte y evalue las evidencias enviadas por los profesores.
          </p>
        <EvidenceTable />
      </div>
      <AppFooter></AppFooter>
    </>
  );
};

export default ReviewEvidence;
