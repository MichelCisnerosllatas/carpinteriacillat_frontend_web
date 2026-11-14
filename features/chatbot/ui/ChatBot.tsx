
"use client";

import { useState } from "react";
import {
  Bot,
  MessageCircle,
  Minus,
  Send,
  X,
} from "lucide-react";

type Message = {
  id: number;
  role: "user" | "assistant";
  content: string;
};

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "assistant",
      content: "¡Hola! 👋 ¿En qué puedo ayudarte?",
    },
  ]);

  const sendMessage = () => {
    if (!input.trim()) return;

    const newMessage: Message = {
      id: Date.now(),
      role: "user",
      content: input.trim(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput("");

    // Respuesta simulada (sin API)
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          role: "assistant",
          content:
            "Gracias por tu mensaje. Pronto podré responder utilizando inteligencia artificial.",
        },
      ]);
    }, 700);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <div className="mb-4 flex h-[500px] w-[350px] max-w-[calc(100vw-3rem)] flex-col overflow-hidden rounded-2xl border bg-white shadow-2xl dark:border-zinc-700 dark:bg-zinc-900">
          {/* CABECERA */}
          <div className="flex items-center justify-between bg-blue-600 p-4 text-white">
            <div className="flex items-center gap-3">
              <Bot size={25} />
              <div>
                <h3 className="font-semibold">
                  Asistente virtual
                </h3>
                <p className="text-xs text-blue-100">
                  En línea
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Minimizar chat"
              >
                <Minus size={20} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Cerrar chat"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* MENSAJES */}
          <div className="flex-1 space-y-3 overflow-y-auto bg-gray-50 p-4 dark:bg-zinc-950">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${
                    message.role === "user"
                      ? "bg-blue-600 text-white"
                      : "border bg-white text-gray-800 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
          </div>

          {/* ENTRADA */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
            className="flex gap-2 border-t p-3 dark:border-zinc-700"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe tu mensaje..."
              aria-label="Mensaje"
              className="min-w-0 flex-1 rounded-lg border px-3 py-2 text-sm outline-none focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-800"
            />

            <button
              type="submit"
              disabled={!input.trim()}
              aria-label="Enviar mensaje"
              className="rounded-lg bg-blue-600 p-2 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              <Send size={20} />
            </button>
          </form>
        </div>
      )}

      {/* BOTÓN FLOTANTE */}
      <div className="flex justify-end">
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Cerrar chat" : "Abrir chat"}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition hover:scale-105 hover:bg-blue-700"
        >
          {isOpen ? <X size={26} /> : <MessageCircle size={26} />}
        </button>
      </div>
    </div>
  );
}
