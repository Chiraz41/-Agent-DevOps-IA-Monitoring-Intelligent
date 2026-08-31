import { api, setAuthToken, clearAuthToken, getAuthToken } from "./api";

export async function login(email, password) {
  const data = await api.post("/auth/login", { email, password });
  setAuthToken(data.access_token);
  return data;
}

export async function register(email, password, role) {
  return api.post("/auth/register", { email, password, role });
}

export async function getCurrentUser() {
  return api.get("/auth/me");
}

export function logout() {
  clearAuthToken();
}

export function isAuthenticated() {
  return !!getAuthToken();
}