import React from "react";
import { AppHeader, AppFooter, SubHeading } from "../common";
import UsersTable from "../components/UsersTable";
import '../app.css'

const UsersAdmin = () => {
  return (
    <>
      <AppHeader />
      <SubHeading />
      <div className="min-h-screen p-10 pl-18" style={{ background: "linear-gradient(180deg, #e1e5eb 0%, #FFF 50%)" }}>
        <h1 className="text-[34px] font-semibold text-black font-['Open_Sans'] mt-2 mb-2">
          Administración de Usuarios
        </h1>
        <UsersTable></UsersTable>
      </div>
      <AppFooter></AppFooter>
    </>
  );
};

export default UsersAdmin;
