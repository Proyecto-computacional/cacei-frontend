import React from "react";
import { AppHeader, AppFooter, SubHeading } from "../common";
import CV from "../components/cv";

const PersonalConfig = () => {
    return (
      <>
        <AppHeader/>
        <SubHeading />
        <div className="min-h-screen p-10 pl-18" style={{ background: "linear-gradient(180deg, #e1e5eb 0%, #FFF 50%)" }}>
          <h1 className="text-[34px] font-semibold text-black font-['Open_Sans'] mt-6 mb-5">
            Información Personal
          </h1>
          <h1 className="text-[34px] font-semibold text-black font-['Open_Sans'] mt-6 mb-5">
            Curriculum Vitae
          </h1>
          <CV />
        </div>
        <AppFooter></AppFooter>
      </>
    );
  };
  
  export default PersonalConfig;
  