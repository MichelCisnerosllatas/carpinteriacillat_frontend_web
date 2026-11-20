"use client";

import { useEffect, useRef } from "react";
import ChatMessage from "./ChatMessage";
import type { ChatMessage as ChatMessageType } from "../types/chat.types";

interface ChatMessagesProps {
  messages: ChatMessageType[];
  isTyping: boolean;
  primaryColor: string;
}

export default function ChatMessages({ messages, isTyping, primaryColor }: ChatMessagesProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Baja solo al último mensaje cada vez que llega uno nuevo o aparece el "escribiendo...".
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isTyping]);

  return (
    <div
      role="log"
      aria-label="Conversación"
      aria-live="polite"
      className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain bg-gray-50 p-4"
    >
      {messages.map((message) => (
        <ChatMessage key={message.id} message={message} primaryColor={primaryColor} />
      ))}

      {/* Indicador de escritura mientras el backend arma la respuesta */}
      {isTyping && (
        <div role="status" aria-label="El asistente está escribiendo" className="flex items-end gap-2">
          <div
            className="flex h-7 w-7 items-center justify-center rounded-full text-white"
            style={{ backgroundColor: primaryColor }}
          >
            <i className="fa-solid fa-robot text-xs" aria-hidden />
          </div>
          <div className="flex gap-1 rounded-2xl border border-gray-200 bg-white px-4 py-3">
            {[0, 1, 2].map((index) => (
              <span
                key={index}
                className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
                style={{ animationDelay: `${index * 150}ms` }}
              />
            ))}
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
