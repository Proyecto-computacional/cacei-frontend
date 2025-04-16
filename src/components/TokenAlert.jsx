import api from "../services/api"

function RefreshTokenModal({ hideModal, setToken, setExpiresAt }) {
  const handleRefresh = async () => { // Activado por botón
    try {
      const response = await api.post("api/refreshToken",
        {},
        {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem('token')}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Proceso de actualización de token
      const { token: newToken, expires_at: newExpiresAt } = response.data;

      if (newToken) {
        localStorage.setItem('token', newToken);
        setToken(newToken);
      }

      setExpiresAt(new Date(newExpiresAt).getTime());
    } catch (error) {
      console.error("No se logró actualizar el token:", error);
    } finally {
      hideModal();
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Session Expiring Soon</h2>
      <p>Your login session will expire in under a minute. Would you like to refresh your token?</p>
      <div className="mt-4 flex justify-end space-x-2">
        <button
          onClick={() => {
            hideModal();
            // optional: trigger a logout if desired.
          }}
          className="px-4 py-2 rounded-lg border"
        >
          Logout
        </button>
        <button
          onClick={handleRefresh}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white"
        >
          Refresh Now
        </button>
      </div>
    </div>
  );
}

export default RefreshTokenModal;
