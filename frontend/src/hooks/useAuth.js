import { useState, useEffect } from "react";
import {
  login as loginService,
  register as registerService,
  getCurrentUser,
  logout as logoutService,
  isAuthenticated,
} from "../services/authService";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadUser() {
      if (isAuthenticated()) {
        try {
          const currentUser = await getCurrentUser();
          setUser(currentUser);
        } catch (err) {
          console.error(err);
          logoutService();
        }
      }
      setLoading(false);
    }
    loadUser();
  }, []);

  async function login({ email, password }) {
    setError(null);
    setLoading(true);
    try {
      await loginService(email, password);
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      return currentUser;
    } catch (err) {
      setError(err.message || "Email ou mot de passe incorrect");
      throw err;
    } finally {
      setLoading(false);
    }
  }

  async function register({ email, password, role }) {
    setError(null);
    setLoading(true);
    try {
      return await registerService(email, password, role);
    } catch (err) {
      setError(err.message || "Erreur lors de l'inscription");
      throw err;
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    logoutService();
    setUser(null);
  }

  return { user, loading, error, login, register, logout };
}