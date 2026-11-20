"use client";

import type { ChatMessage as ChatMessageType } from "../types/chat.types";

interface ChatMessageProps {
  message: ChatMessageType;
  primaryColor: string;
}

// "agent" = una persona del equipo respondiendo (a futuro, desde el intranet). Hoy solo
// existen "user" y "assistant" (el bot).
const AVATAR_ICON: Record<ChatMessageType["role"], string> = {
  user: "fa-user",
  assistant: "fa-robot",
  agent: "fa-headset",
};

function formatTime(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" });
}

export default function ChatMessage({ message, primaryColor }: ChatMessageProps) {
  const isUser = message.role === "user";
  const time = formatTime(message.created_at);

  return (
    <div className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`flex max-w-[90%] items-end gap-2 ${isUser ? "flex-row-reverse" : ""}`}>
        {/* Avatar */}
        <div
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
            isUser ? "bg-gray-200 text-gray-600" : "text-white"
          }`}
          style={isUser ? undefined : { backgroundColor: primaryColor }}
        >
          <i className={`fa-solid ${AVATAR_ICON[message.role]} text-xs`} aria-hidden />
        </div>

        {/* Burbuja (el color del usuario es el color principal configurado en el intranet) */}
        <div
          className={`rounded-2xl px-3 py-2 shadow-sm ${
            isUser ? "rounded-br-sm text-white" : "rounded-bl-sm border border-gray-200 bg-white text-gray-800"
          }`}
          style={isUser ? { backgroundColor: primaryColor } : undefined}
        >
          <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">{message.content}</p>

          <span className={`mt-1 flex items-center justify-end gap-1 text-[10px] ${isUser ? "text-white/75" : "text-gray-400"}`}>
            {message.input_type === "voice" && <i className="fa-solid fa-microphone" aria-label="Dictado por voz" />}
            {time}
          </span>
        </div>
      </div>
    </div>
  );
}
