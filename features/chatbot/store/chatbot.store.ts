import { create } from "zustand";

import type { ChatMessage } from "../types/chat.types";
import { chatService } from "../services/chat.service";

interface ChatBotState {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;

  sendMessage: (content: string) => Promise<void>;
  clearMessages: () => void;
}

export const useChatBotStore = create<ChatBotState>(
  (set, get) => ({
    messages: [],
    isLoading: false,
    error: null,

    sendMessage: async (content) => {
      const text = content.trim();

      if (!text || get().isLoading) return;

      const userMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "user",
        content: text,
        createdAt: new Date().toISOString(),
      };

      set((state) => ({
        messages: [...state.messages, userMessage],
        isLoading: true,
        error: null,
      }));

      try {
        const response = await chatService.sendMessage(text);

        const assistantMessage: ChatMessage = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: response.content,
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          messages: [...state.messages, assistantMessage],
        }));
      } catch {
        set({
          error: "No se pudo enviar el mensaje.",
        });
      } finally {
        set({ isLoading: false });
      }
    },

    clearMessages: () => {
      set({
        messages: [],
        error: null,
      });
    },
  })
);