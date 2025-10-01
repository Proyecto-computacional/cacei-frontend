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
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 pt-4 pb-2 pl-8 pr-8 w-full">
            <div className="flex items-center gap-4 mb-6">
              <div>
                <h1 className="text-4xl font-bold text-gray-800 font-['Open_Sans'] tracking-tight mb-3">
                  Revisión de evidencias
                </h1>
                <p className="text-lg text-gray-700 leading-relaxed">
                Revise y gestione las evidencias registradas en el sistema. Consulte información básica, y apruebe o rechace según corresponda.
                </p>
              </div>
            </div>
          </div>
        <EvidenceTable />
      </div>
      <AppFooter></AppFooter>
    </>
  );
};

export default ReviewEvidence;
