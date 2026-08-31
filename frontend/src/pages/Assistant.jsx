import { useState } from "react";
import { Bot, Send, User } from "lucide-react";

import { useChat } from "../hooks/useChat";

export default function Assistant() {
  const [input, setInput] = useState("");

  const {
    messages,
    loading,
    send,
  } = useChat();

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const text = input.trim();

    setInput("");

    await send(text);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="assistant-page">

      <div className="page-header">
        <div>
          <h1>Assistant IA</h1>
          <p>
            Interrogez l'agent DevOps sur vos
            anomalies, métriques et logs.
          </p>
        </div>
      </div>
      <br/>
      <section className="chat-container">

        <div className="chat-header">
          <div className="chat-agent-icon">
            <Bot size={20} />
          </div>

          <div>
            <strong>Agent DevOps IA</strong>
            <span>Assistant de monitoring</span>
          </div>
        </div>

        <div className="chat-messages">

          {messages.map((message) => (
            <div
              key={message.id}
              className={`chat-message ${message.role}`}
            >
              <div className="message-icon">
                {message.role === "bot" ? (
                  <Bot size={15} />
                ) : (
                  <User size={15} />
                )}
              </div>

              <div className="message-bubble">
                {message.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="chat-message bot">
              <div className="message-icon">
                <Bot size={15} />
              </div>

              <div className="message-bubble typing">
                Réflexion en cours...
              </div>
            </div>
          )}

        </div>

        <div className="chat-input-container">

          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Posez votre question..."
            rows={1}
            disabled={loading}
          />

          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
          >
            <Send size={17} />
          </button>

        </div>

      </section>
    </div>
  );
}