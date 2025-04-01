import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/", // Ajusta la URL
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const login = async (rpe, password) => {
  try {
    //Peticion post a localhost/api/login
    const response = await api.post("api/login", { rpe, password });
    //Correct = login exitoso
    if (response.data.correct) {
      //Variables globales de usuario (no definitivas)
      localStorage.setItem("role", response.data.role);
      localStorage.setItem("name", response.data.name);
      localStorage.setItem("rpe", rpe);
      const token = response.data.token.plainTextToken;
      localStorage.setItem("token", token);
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      return response.data;
    }
    //retorna si el login no fue exitoso
    return { correct: false };
  } catch (error) {
    console.error("Error en login:", error.response?.data || error.message);
    throw error; // Lanza el error para que el componente lo maneje (pendiente de revisar)
  }
};

export const logout = async () => {
  const token = localStorage.getItem("token"); // se obtiene el token antes de hacer la petición
  if (!token) {
    console.error("No hay token disponible");
    return;
  }

  try {
    await api.post(
      "/logout",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`, // se envía el token en el header
          Accept: "application/json",
        },
      }
    );

    // si el logout fue exitoso, se elimina el token del almacenamiento local
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    delete api.defaults.headers.common["Authorization"];
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
  }
};

export default api;
