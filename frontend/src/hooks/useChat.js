import { useState } from "react";
import { sendMessage } from "../services/chatService";

export function useChat() {
  const [messages, setMessages] = useState(() => [
    {
      id: crypto.randomUUID(),
      role: "bot",
      text: "Bonjour ! Comment puis-je vous aider ?",
    },
  ]);

  const [sessionId, setSessionId] = useState(null);
  const [loading, setLoading] = useState(false);

  const send = async (text) => {
    const message = text.trim();

    if (!message || loading) return;

    // Ajouter le message de l'utilisateur
    setMessages((previous) => [
      ...previous,
      {
        id: crypto.randomUUID(),
        role: "user",
        text: message,
      },
    ]);

    setLoading(true);

    try {
      // Appel vers le backend FastAPI
      const data = await sendMessage(message, sessionId);

      // Sauvegarder l'identifiant de session
      if (data.session_id) {
        setSessionId(data.session_id);
      }

      // Ajouter la réponse de l'agent
      setMessages((previous) => [
        ...previous,
        {
          id: crypto.randomUUID(),
          role: "bot",
          text: data.answer || "Aucune réponse reçue.",
        },
      ]);
    } catch (error) {
      console.error("Erreur agent IA :", error);

      setMessages((previous) => [
        ...previous,
        {
          id: crypto.randomUUID(),
          role: "bot",
          text: "Erreur : impossible de contacter l'agent IA.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return {
    messages,
    loading,
    send,
  };
}