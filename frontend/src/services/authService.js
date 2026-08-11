import { api, setAuthToken, clearAuthToken } from "./api";

// Le backend doit exposer POST /auth/login et renvoyer
// { token: string, user: { name, email, role } }
export async function loginRequest(email, password) {
  const data = await api.post("/auth/login", { email, password });

  setAuthToken(data.token);

  return data.user;
}

export function logoutRequest() {
  clearAuthToken();
}

// Optionnel : à appeler au chargement de l'app pour restaurer
// la session si un token valide est déjà stocké.
export function fetchCurrentUser() {
  return api.get("/auth/me");
}
