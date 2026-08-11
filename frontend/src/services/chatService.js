import { api } from "./api";

export async function sendMessage(message, sessionId = null) {
  const body = {
    question: message,
  }; 

  if (sessionId) {
    body.session_id = sessionId;
  }

  return api.post("/agent/ask", body);
}