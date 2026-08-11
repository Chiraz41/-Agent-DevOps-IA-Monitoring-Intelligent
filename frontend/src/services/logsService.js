import { api } from "./api";

export async function getRecentLogs(minutes = 30) {
  return api.get(`/logs/recent?minutes=${minutes}`);
}