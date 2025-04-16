// Import your API instance—this could be an Axios instance you’ve already configured
import api from '../api'; // adjust the import path as needed

function RefreshTokenModal({ hideModal, setToken, setExpiresAt }) {
  // Handler for the Refresh button click
  const handleRefresh = async () => {
    try {
      // Make the refresh token API call with headers similar to your example.
      const response = await api.post(
        "/api/refreshToken", // adjust the endpoint path to match your backend route
        {},
        {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem('token')}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Destructure the token and new expiration date from the response.
      // Note: Depending on your backend response, these property names might differ.
      const { token: newToken, expires_at: newExpiresAt } = response.data;

      // Optionally update the token in localStorage if the refresh endpoint issues a new token.
      if (newToken) {
        localStorage.setItem('token', newToken);
        setToken(newToken);
      }

      // Update expiration; parsing the new expiration if it is a string:
      setExpiresAt(new Date(newExpiresAt).getTime());
    } catch (error) {
      console.error("Error refreshing the token:", error);
      // Optionally: add error handling logic (e.g., notify user, force logout)
    } finally {
      // Finally, hide the modal regardless of success or error.
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
