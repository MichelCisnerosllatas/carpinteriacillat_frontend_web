
"use client";

import { useEffect, useRef } from "react";

import ChatMessage from "./ChatMessage";

import type {
  ChatMessage as ChatMessageType,
} from "../types/chat.types";

interface ChatMessagesProps {
  messages: ChatMessageType[];
  isTyping: boolean;
}

export default function ChatMessages({
  messages,
  isTyping,
}: ChatMessagesProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, isTyping]);

  return (
    <div
      role="log"
      aria-label="Conversación"
      aria-live="polite"
      className="chatbot-scroll min-h-0 flex-1 space-y-4 overflow-y-auto bg-gray-50 p-4 dark:bg-zinc-950"
    >
      {messages.map((message) => (
        <ChatMessage
          key={message.id}
          message={message}
        />
      ))}

      {/* Indicador de escritura */}
      {isTyping && (
        <div
          role="status"
          aria-label="El asistente está escribiendo"
          className="flex items-end gap-2"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-200 dark:bg-zinc-700">
            <i className="fa-solid fa-robot text-xs text-gray-600 dark:text-gray-200" />
          </div>

          <div className="flex gap-1 rounded-2xl border border-gray-200 bg-white px-4 py-3 dark:border-zinc-700 dark:bg-zinc-800">
            {[0, 1, 2].map((index) => (
              <span
                key={index}
                className="h-2 w-2 animate-pulse rounded-full bg-gray-400"
                style={{
                  animationDelay: `${index * 200}ms`,
                }}
              />
            ))}
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
