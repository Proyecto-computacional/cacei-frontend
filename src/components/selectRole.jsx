import { useState } from "react";
import axios from "axios";

const SelectRol = ({ userId, initialRole, AllRoles }) => {
    const [role, setRole] = useState(initialRole);
    const handleChange = async (event) => {
        const newRole = event.target.value;
        setRole(newRole);

        try {
            await axios.post(`http://localhost:8000/api/usersadmin/actualizar-rol`, { user_id: userId, rol: newRole });
            alert("Rol actualizado correctamente");
        } catch (error) {
            console.error("Error al actualizar el rol", error);
            alert("Hubo un error al actualizar el rol");
        }
    };

    return (
        <select value={role} onChange={handleChange}>
            {AllRoles.map((rol) => {
                console.log(rol.name, initialRole);
                if (rol.name == initialRole) {
                    return (<option value={rol.name} selected>{rol.name}</option>)
                } else {
                    return (<option value={rol.name}>{rol.name}</option>)
                }
            })}
        </select>
    );
};

export default SelectRol;
