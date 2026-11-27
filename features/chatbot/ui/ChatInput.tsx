"use client";

import { useState, type FormEvent, type KeyboardEvent } from "react";
import { useSpeechRecognition } from "../hooks/useSpeechRecognition";
import type { ChatInputType } from "../types/chat.types";

interface ChatInputProps {
  placeholder: string;
  primaryColor: string;
  // allow_voice (intranet) — además el navegador tiene que soportar la Web Speech API.
  allowVoice: boolean;
  disabled?: boolean;
  onSend: (content: string, inputType: ChatInputType) => void;
}

const MAX_LENGTH = 1000; // mismo límite que valida el backend

export default function ChatInput({ placeholder, primaryColor, allowVoice, disabled = false, onSend }: ChatInputProps) {
  const [value, setValue] = useState("");
  // Si el texto salió del micrófono se manda como "voice" (el intranet lo marca con un ícono).
  const [inputType, setInputType] = useState<ChatInputType>("text");

  const speech = useSpeechRecognition({
    onInterim: (text) => {
      setValue(text);
      setInputType("voice");
    },
    onFinal: (text) => {
      setValue(text);
      setInputType("voice");
    },
  });

  const showMic = allowVoice && speech.isSupported;
  const canSend = !disabled && value.trim().length > 0 && !speech.isListening;

  const submit = () => {
    if (!canSend) return;
    onSend(value.trim(), inputType);
    setValue("");
    setInputType("text");
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    submit();
  };

  // Enter envía; Shift+Enter hace salto de línea.
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="shrink-0 border-t border-gray-200 bg-white p-3">
      {speech.error && <p className="mb-2 text-xs text-red-600">{speech.error}</p>}

      <div className="flex items-end gap-2">
        <textarea
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            if (!e.target.value) setInputType("text");
          }}
          onKeyDown={handleKeyDown}
          placeholder={speech.isListening ? "Te escucho..." : placeholder}
          aria-label="Mensaje"
          rows={1}
          maxLength={MAX_LENGTH}
          disabled={disabled}
          className="max-h-28 min-h-[40px] min-w-0 flex-1 resize-none rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-gray-500 disabled:bg-gray-100"
        />

        {showMic && (
          <button
            type="button"
            onClick={speech.isListening ? speech.stop : speech.start}
            disabled={disabled}
            aria-label={speech.isListening ? "Detener dictado" : "Dictar mensaje por voz"}
            aria-pressed={speech.isListening}
            title={speech.isListening ? "Detener" : "Hablar"}
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition disabled:opacity-50 ${
              speech.isListening ? "animate-pulse border-red-500 bg-red-500 text-white" : "border-gray-300 text-gray-600 hover:bg-gray-100"
            }`}
          >
            <i className={`fa-solid ${speech.isListening ? "fa-stop" : "fa-microphone"}`} aria-hidden />
          </button>
        )}

        <button
          type="submit"
          disabled={!canSend}
          aria-label="Enviar mensaje"
          title="Enviar"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white transition hover:opacity-90 disabled:opacity-40"
          style={{ backgroundColor: primaryColor }}
        >
          <i className="fa-solid fa-paper-plane" aria-hidden />
        </button>
      </div>
    </form>
  );
}
