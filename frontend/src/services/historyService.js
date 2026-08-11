import { api } from "./api";

export async function getHistory({
  limit = 20,
  anomaliesOnly = false,
} = {}) {
  return api.get(
    `/anomalies/history?limit=${limit}&anomalies_only=${anomaliesOnly}`
  );
}