import { api } from "./api";

// Gestion des utilisateurs
export function getUsers() {
  return api.get("/admin/users");
}

export function createUser(user) {
  return api.post("/admin/users", user);
}

export function updateUser(id, patch) {
  return api.patch(`/admin/users/${id}`, patch);
}

export function deleteUser(id) {
  return api.delete(`/admin/users/${id}`);
}

// Seuils de détection par métrique
export function getThresholds() {
  return api.get("/admin/thresholds");
}

export function updateThresholds(thresholds) {
  return api.put("/admin/thresholds", thresholds);
}

// Paramètres de l'agent (sensibilité, fréquence d'analyse...)
export function getAgentSettings() {
  return api.get("/admin/agent-settings");
}

export function updateAgentSettings(settings) {
  return api.put("/admin/agent-settings", settings);
}
