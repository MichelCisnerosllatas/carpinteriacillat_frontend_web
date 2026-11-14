
import type {
  ChatMessage as ChatMessageType,
} from "../types/chat.types";

interface ChatMessageProps {
  message: ChatMessageType;
}

export default function ChatMessage({message}: ChatMessageProps) {
  const isUser = message.role === "user";

  const time = new Date(
    message.createdAt
  ).toLocaleTimeString("es-PE", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className={`flex w-full ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`flex max-w-[90%] items-end gap-2 ${
          isUser ? "flex-row-reverse" : ""
        }`}
      >
        {/* Avatar */}
        <div
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
            isUser
              ? "bg-blue-100 text-blue-600"
              : "bg-gray-200 text-gray-600 dark:bg-zinc-700 dark:text-gray-200"
          }`}
        >
          <i
            className={`fa-solid ${
              isUser ? "fa-user" : "fa-robot"
            } text-xs`}
          />
        </div>

        {/* Contenido del mensaje */}
        <div
          className={`rounded-2xl px-3 py-2 shadow-sm ${
            isUser
              ? "rounded-br-sm bg-blue-600 text-white"
              : "rounded-bl-sm border border-gray-200 bg-white text-gray-800 dark:border-zinc-700 dark:bg-zinc-800 dark:text-gray-100"
          }`}
        >
          <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">
            {message.content}
          </p>

          <span
            className={`mt-1 block text-right text-[10px] ${
              isUser
                ? "text-blue-100"
                : "text-gray-400"
            }`}
          >
            {time}
          </span>
        </div>
      </div>
    </div>
  );
}
