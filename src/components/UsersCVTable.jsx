import { Link } from 'react-router-dom';
import { Users, FileUser } from "lucide-react";

const UserCVTable =  ({users}) => {

    users = users.sort((a, b) => {
        if (a.user_rpe === null && b.user_rpe !== null) return 1;   // a va después
        if (a.user_rpe !== null && b.user_rpe === null) return -1;  // a va antes
        return 0; // si los dos son null o los dos tienen valor, se quedan igual
    });
    
    return(
        <div className="overflow-x-auto overflow-y-scroll max-h-[500px] rounded-lg shadow-sm border border-gray-200">
                <table className="min-w-full bg-white">
                    <thead className="sticky top-0 z-0">
                        <tr className="bg-primary1 text-white">
                            <th className="py-4 px-6 text-left font-semibold w-3/5">Profesor(a)</th>
                            <th className="py-4 px-6 text-center font-semibold w-2/5">CV</th>
                        </tr>
                    </thead>
                    <tbody>
                        {( users && users.length > 0 )? users.map((item, index) => (
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
                            <td colSpan="6" className="py-8 text-center">
                                <div className="flex flex-col items-center text-gray-500">
                                    <Users className="h-12 w-12 mb-3 text-gray-400" />
                                    <p className="text-lg font-medium">No se encontró ningún CV para esta área</p>
                                </div>
                            </td>
                        </tr>
                        }
                    </tbody>
                </table>
            </div>
    )
}

export default UserCVTable;