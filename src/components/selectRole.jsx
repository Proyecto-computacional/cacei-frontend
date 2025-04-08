import { useState } from "react";
import api from "../services/api";

const normalizeRol = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();
}

const SelectRol = ({ userId, initialRole, AllRoles }) => {
    const [role, setRole] = useState(initialRole);
    const handleChange = async (event) => {
        const newRole = event.target.value;
        setRole(newRole);

        try {
            await api.post("/api/usersadmin/actualizar-rol", 
                { user_id: userId, rol: normalizeRol(newRole) }, 
                {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem('token')}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            alert("Rol actualizado correctamente");
        } catch (error) {
            console.error("Error al actualizar el rol", error);
            alert("Hubo un error al actualizar el rol");
        }
    };

    return (
        <select value={normalizeRol(role)} onChange={handleChange}>
            {AllRoles.map((rol) => {
                return (<option value={normalizeRol(rol.name)} key={normalizeRol(rol.name)}>{rol.name}</option>)
            })}
        </select>
    );
};

export default SelectRol;
