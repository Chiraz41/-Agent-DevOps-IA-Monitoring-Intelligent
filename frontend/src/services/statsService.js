import { api } from "./api";

export async function getStats() {
  return api.get("/stats");
}