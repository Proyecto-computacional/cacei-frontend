import React, { useState, useEffect } from 'react';
import { Check, X, ShieldUser, Loader2 } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';
import api from '../services/api';

const PermissionsTable = () => {
  // Estado inicial basado en el JSON proporcionado
  const [rolesData, setRolesData] = useState({});
  const [loadingStates, setLoadingStates] = useState({});
  const [loadingTable, setLoadingTable] = useState({});

  // Mapeo de permisos a columnas
  const permissionColumns = [
    { id: 3, name: 'Visualizar Archivos', key: 'Descargar archivos' },
    { id: 1, name: 'Subir Archivos', key: 'Subir archivos' },
    { id: 2, name: 'Actualizar Archivos', key: 'Actualizar archivos' },
  ];

  useEffect( () => {
  const fetchRolesPermissions = async () => {
    try {
      setLoadingTable(true);

      const response = await api.get("/api/roles-permissions", {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('token')}`,
          "Content-Type": "application/json",
        },
      });

      const mappedData = response.data.map(role => {
          let displayName = role.role_name;
          if (role.role_name === "PROFESOR") displayName = "PROFESOR RESPONSABLE";
          if (role.role_name === "DEPARTAMENTO UNIVERSITARIO") displayName = "DEPARTAMENTO DE APOYO";

          return { ...role, role_name: displayName };
        })

      setRolesData(mappedData);

    } catch (error) {
      if (error.response) {
        //alert de error al obtener roles
      }
    } finally {
      setLoadingTable(false);
    }
  };

  fetchRolesPermissions();
  }, []);

  // Función para actualizar permisos
  const updatePermission = async (roleId, permissionId, currentState) => {
    const loadingKey = `${roleId}-${permissionId}`;
    
    try {
      setLoadingStates(prev => ({ ...prev, [loadingKey]: true }));

      const response = api.put(`http://127.0.0.1:8000/api/roles/${roleId}/permissions/${permissionId}`,
        {is_enabled: Boolean(!currentState)},
        {
          headers: {
          "Authorization": `Bearer ${localStorage.getItem('token')}`,
          "Content-Type": "application/json",
          },
      }
    );

      const data = await response;

      if (data.status === 200) {
        // Actualizar el estado local
        setRolesData(prevRoles => 
          prevRoles.map(role => 
            role.role_id === roleId 
              ? {
                  ...role,
                  permissions: role.permissions.map(perm =>
                    perm.permission_id === permissionId
                      ? { ...perm, is_enabled: !currentState }
                      : perm
                  )
                }
              : role
          )
        );
          //alert de exito
      } else {
          //alert de error
      }
    } catch (error) {
        //alert de error
    } finally {
      setLoadingStates(prev => ({ ...prev, [loadingKey]: false }));
    }
  };

  // Función para obtener el estado de un permiso específico
  const getPermissionState = (role, permissionKey) => {
    const permission = role.permissions.find(p => p.permission_name === permissionKey);
    return permission ? permission.is_enabled : false;
  };

  return (
    <div className="container mx-auto mt-8">
      <div className="mx-auto">
        <div className="flex items-center gap-3">
          <div className="bg-[#004A98] p-2 rounded-lg">
            <ShieldUser className="h-6 w-6 text-white" />
            </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Administración de Permisos</h2>
        </div>
        
        <div className="overflow-x-auto w-fit mx-auto max-h-[600px] rounded-lg shadow-sm border border-gray-200">
          <table className="min-w-8/10 mx-auto bg-white">
            <thead className="sticky top-0 z-0">
              <tr className="bg-[#004A98] text-white">
                <th className="py-4 px-6 text-left font-semibold">Rol</th>
                {permissionColumns.map(col => (
                  <th key={col.id} className="py-4 px-6 text-left font-semibold">
                    {col.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loadingTable ? (
                 <tr>
                    <td colSpan="5" className="py-8">
                    <div className="flex justify-center">
                      <LoadingSpinner />
                    </div>
                  </td>
                </tr>
              ) : (
                rolesData.map((role, index) => (
                <tr 
                  key={role.role_id} 
                  className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-blue-50 transition-colors`}
                >
                  <td className="px-6 py-4 font-medium text-gray-800">
                    {role.role_name}
                  </td>
                  {permissionColumns.map(col => {
                    const isEnabled = getPermissionState(role, col.key);
                    const isLoading = loadingStates[`${role.role_id}-${col.id}`];
                    
                    return (
                      <td key={col.id} className="px-6 py-4 text-center">
                        <button
                          onClick={() => updatePermission(role.role_id, col.id, isEnabled)}
                          disabled={isLoading}
                          className={`w-8 h-8 mx-auto rounded-lg border-2 flex items-center justify-center transition-all duration-200 ${
                            isLoading
                              ? 'bg-gray-100 border-gray-300 cursor-not-allowed'
                              : isEnabled
                                ? 'bg-[#004A98] border-bg-[#004A98] hover:bg-blue-600 hover:border-blue-600'
                                : 'bg-white border-gray-300 hover:border-blue-400'
                          }`}
                        >
                          {isLoading ? (
                              <Loader2 className="w-4 h-4 text-primary1 animate-spin" />
                          ) : isEnabled ? (
                            <Check className="w-4 h-4 text-white" />
                          ) : (
                            <X className="w-4 h-4 text-gray-300" />
                          )}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PermissionsTable;