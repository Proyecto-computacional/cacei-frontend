import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, FileUser, Search } from "lucide-react";

const UserCVTable = ({ users }) => {
    const [sortOrder, setSortOrder] = useState('asc');
    const [searchTerm, setSearchTerm] = useState('');

    // Función para alternar orden
    const toggleSort = () => {
        setSortOrder(prevOrder => prevOrder === 'asc' ? 'desc' : 'asc');
    };

    // Filtrar usuarios por término de búsqueda
    const filteredUsers = users.filter(user =>
        user.user_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Ordenar usuarios filtrados
    const sortedUsers = [...filteredUsers].sort((a, b) => {
        const nameA = (a.user_name || '').toLowerCase();
        const nameB = (b.user_name || '').toLowerCase();
        
        if (sortOrder === 'asc') {
            return nameA.localeCompare(nameB);
        } else {
            return nameB.localeCompare(nameA);
        }
    });
    
    return (
        <div className="space-y-4">
            {/* Barra de búsqueda */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                    type="text"
                    placeholder="Buscar profesor por nombre..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004A98] focus:border-transparent w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Tabla */}
            <div className="overflow-x-auto overflow-y-scroll max-h-[500px] rounded-lg shadow-sm border border-gray-200">
                <table className="min-w-full bg-white">
                    <thead className="sticky top-0 z-0">
                        <tr className="bg-primary1 text-white">
                            <th 
                                className="py-4 px-6 text-left font-semibold w-3/5 cursor-pointer hover:bg-blue-700 transition-colors duration-200" 
                                onClick={toggleSort}
                            >
                                <div className="flex items-center gap-2">
                                    Profesor(a) 
                                    <span className="text-sm">
                                        {sortOrder === 'asc' ? '↑' : '↓'}
                                    </span>
                                </div>
                            </th>
                            <th className="py-4 px-6 text-center font-semibold w-2/5">CV</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(sortedUsers && sortedUsers.length > 0) ? sortedUsers.map((item, index) => (
                            <tr key={`${item.user_rpe || 'null'}-${index}`} className="border-b hover:bg-gray-50 transition-colors duration-200">
                                <td className="py-2 px-4 font-medium">{item.user_name}</td>
                                {item.user_rpe ? 
                                (                                
                                    <td className="py-2 px-4">
                                        <Link to={`/personalInfo/${item.user_rpe}`}>
                                            <div className="bg-[#004A98] p-2 rounded-lg w-fit mx-auto cursor-pointer">
                                                <FileUser className="h-6 w-6 mx-a text-white"/>
                                            </div>
                                        </Link>
                                    </td>
                                )
                                :
                                (
                                    <td className="py-2 px-2">
                                        <div className="p-2 text-sm text-yellow-800 rounded-lg bg-yellow-50 dark:bg-gray-800 dark:text-yellow-300 text-center" role="alert">
                                            No existe CV del profesor en la base de datos
                                        </div>
                                    </td>
                                )}
                            </tr>
                        )) :
                        <tr>
                            <td colSpan="2" className="py-8 text-center">
                                <div className="flex flex-col items-center text-gray-500">
                                    <Users className="h-12 w-12 mb-3 text-gray-400" />
                                    <p className="text-lg font-medium">
                                        {searchTerm ? 'No se encontraron profesores con ese nombre' : 'No se encontró ningún CV para esta área'}
                                    </p>
                                    {searchTerm && (
                                        <p className="text-sm">Intenta con otros términos de búsqueda</p>
                                    )}
                                </div>
                            </td>
                        </tr>
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default UserCVTable;