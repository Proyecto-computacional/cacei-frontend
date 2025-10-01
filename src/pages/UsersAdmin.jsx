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
        {/* Header Card */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 pt-4 pb-2 pl-8 pr-8">
          <div className="flex items-center gap-4 mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 font-['Open_Sans'] tracking-tight mb-3">
                Administración de Usuarios
              </h1>
              <p className="text-lg text-gray-700 leading-relaxed">
            Gestione eficientemente todos los usuarios del sistema. Consulte perfiles, 
            modifique roles, visualice currículums y administre permisos de manera centralizada.
            </p>
            </div>
          </div>
        </div>
        <UsersTable></UsersTable>
      </div>
      <AppFooter></AppFooter>
    </>
  );
};

export default UsersAdmin;
