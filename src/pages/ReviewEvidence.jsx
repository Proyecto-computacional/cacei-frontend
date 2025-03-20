import React from "react";
import { AppHeader, AppFooter, SubHeading } from "../common";
import EvidenceTable from "../components/EvidenceTable";
import '../app.css'

const ReviewEvidence = () => {
  return (
    <>
      <AppHeader />
      <SubHeading />
      <div className="min-h-screen p-10 pl-18" style={{ background: "linear-gradient(180deg, #e1e5eb 0%, #FFF 50%)" }}>
        <h1 className="text-[34px] font-semibold text-black font-['Open_Sans'] mt-2 mb-2">
          Revisar evidencias
        </h1>
        <EvidenceTable />
      </div>
      <AppFooter></AppFooter>
    </>
  );
};

export default ReviewEvidence;
