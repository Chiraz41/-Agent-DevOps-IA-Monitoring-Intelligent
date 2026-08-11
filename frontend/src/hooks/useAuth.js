import { useCallback, useState } from "react";
import { loginRequest, logoutRequest } from "../services/authService";

// Passez à false une fois le backend d'authentification réellement branché.
// En mode démo, si l'appel au backend échoue (pas encore développé),
// la connexion se fait quand même avec les informations saisies dans le
// formulaire, pour ne pas bloquer le travail sur le frontend.
const DEMO_MODE = true;

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = useCallback(async ({ name, email, password, role }) => {
    setLoading(true);
    setError(null);

    try {
      const realUser = await loginRequest(email, password);
      setUser(realUser);
    } catch (err) {
      if (DEMO_MODE) {
        setUser({ name, email, role });
      } else {
        setError(
          err instanceof Error ? err.message : "Erreur de connexion"
        );
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    logoutRequest();
    setUser(null);
  }, []);

  return {
    user,
    loading,
    error,
    login,
    logout,
  };
}
