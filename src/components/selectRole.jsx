import { useState } from "react";
import axios from "axios";

const normalizeRol = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();
}

const SelectRol = ({ userId, initialRole, AllRoles }) => {
    const [role, setRole] = useState(initialRole);
    const handleChange = async (event) => {
        const newRole = event.target.value;
        setRole(newRole);

        try {
            await axios.post(`http://localhost:8000/api/usersadmin/actualizar-rol`, { user_id: userId, rol: normalizeRol(newRole) });
            alert("Rol actualizado correctamente");
        } catch (error) {
            console.error("Error al actualizar el rol", error);
            alert("Hubo un error al actualizar el rol");
        }
    };

    return (
        <select value={normalizeRol(role)} onChange={handleChange}>
            {AllRoles.map((rol) => {
                console.log(normalizeRol(role), normalizeRol(rol.name));
                return (<option value={normalizeRol(rol.name)}>{rol.name}</option>)
            })}
        </select>
    );
};

export default SelectRol;
