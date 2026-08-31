import { api } from "./api";

export async function getHistory({
  limit = 20,
} = {}) {
  return api.get(
    `/api/history?limit=${limit}`
  );
}