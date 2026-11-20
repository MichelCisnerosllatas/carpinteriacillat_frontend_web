// features/chatbot/store/chatbot.store.ts
//
// Estado del chatbot en el navegador del visitante. NO guarda el diseño (colores, textos,
// posición...): eso llega del backend en site.chatbot.settings y se lee de useSiteStore.
//
// Flujo:
//   1. home  → lista de opciones (ListTiles). openOption(opcion) pasa a "chat".
//   2. chat  → si esa opción ya tenía conversación (uuid en localStorage) la retoma con GET;
//              si no, la crea con POST. El backend devuelve el saludo como primer mensaje.
//   3. sendMessage → POST del mensaje; el backend responde con el mensaje guardado y la
//              respuesta del bot (hardcodeada hoy, IA mañana — eso vive en el backend).
//
// Modo preview (/preview, iframe del intranet): no llama al backend para no ensuciar las
// conversaciones reales con pruebas del admin — responde localmente con un texto de ejemplo.

import { create } from "zustand";
import { HttpError } from "@/shared/api/http/httpClient";
import type { SiteChatbotOptionDto } from "@/shared/services/site_service/model/siteget.dto";
import { chatService } from "../services/chat.service";
import { getStoredConversation, getVisitorToken, storeConversation } from "../lib/chatStorage";
import type {
  ChatConversationDto,
  ChatConversationStatus,
  ChatInputType,
  ChatMessage,
  ChatVisitor,
  UpdateVisitorRequestDto,
} from "../types/chat.types";

export type ChatView = "home" | "chat";

// Clave con la que se recuerda la conversación cuando el chatbot no tiene opciones.
const NO_OPTION_KEY = "default";

type OpenChatParams = {
  option: SiteChatbotOptionDto | null;
  welcomeMessage: string;
  requireContactData: boolean;
};

type ChatBotState = {
  isOpen: boolean;
  view: ChatView;
  isPreview: boolean;

  activeOption: SiteChatbotOptionDto | null;
  conversationUuid: string | null;
  conversationStatus: ChatConversationStatus | null;
  messages: ChatMessage[];
  visitor: ChatVisitor | null;

  // Cargando/creando la conversación al entrar a una opción.
  isLoading: boolean;
  // Esperando la respuesta del bot (indicador "escribiendo...").
  isTyping: boolean;
  error: string | null;

  // Formulario de datos de contacto (solo si require_contact_data está activo en el intranet).
  needsContact: boolean;
  isSavingContact: boolean;
  contactError: string | null;

  setPreview: (isPreview: boolean) => void;
  open: () => void;
  close: () => void;
  toggle: () => void;
  goHome: () => void;
  openChat: (params: OpenChatParams) => Promise<void>;
  sendMessage: (content: string, inputType?: ChatInputType) => Promise<void>;
  saveContact: (data: UpdateVisitorRequestDto) => Promise<boolean>;
  // Permite apagar el formulario de contacto en caliente si el admin lo desactiva en /preview.
  syncContactRequirement: (requireContactData: boolean) => void;
};

// Cada openChat incrementa este número: si el usuario cambia de opción mientras la anterior
// aún carga, la respuesta vieja se descarta en vez de pisar la conversación nueva.
let requestSeq = 0;
let tempSeq = 0;

function tempMessage(role: ChatMessage["role"], content: string, inputType: ChatInputType = "text"): ChatMessage {
  tempSeq += 1;
  return { id: `tmp-${tempSeq}`, role, content, input_type: inputType, created_at: new Date().toISOString() };
}

function errorMessage(err: unknown, fallback: string): string {
  if (err instanceof HttpError) {
    if (err.status === 429) return "Estás enviando mensajes muy rápido. Espera un momento e inténtalo de nuevo.";
    if (err.status === 409) return "Esta conversación ya fue cerrada. Vuelve al inicio para empezar una nueva.";
  }
  return fallback;
}

function needsContactFor(visitor: ChatVisitor | null, requireContactData: boolean): boolean {
  return requireContactData && !visitor?.has_contact_data;
}

export const useChatBotStore = create<ChatBotState>((set, get) => ({
  isOpen: false,
  view: "home",
  isPreview: false,

  activeOption: null,
  conversationUuid: null,
  conversationStatus: null,
  messages: [],
  visitor: null,

  isLoading: false,
  isTyping: false,
  error: null,

  needsContact: false,
  isSavingContact: false,
  contactError: null,

  setPreview: (isPreview) => set({ isPreview }),
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  toggle: () => set((s) => ({ isOpen: !s.isOpen })),

  // Volver NO borra la conversación del servidor ni de localStorage: si el cliente vuelve a
  // tocar la misma opción, la retoma donde la dejó.
  goHome: () => {
    requestSeq += 1;
    set({
      view: "home",
      activeOption: null,
      conversationUuid: null,
      conversationStatus: null,
      messages: [],
      isLoading: false,
      isTyping: false,
      error: null,
      needsContact: false,
      contactError: null,
    });
  },

  openChat: async ({ option, welcomeMessage, requireContactData }) => {
    const seq = ++requestSeq;
    set({
      view: "chat",
      activeOption: option,
      conversationUuid: null,
      conversationStatus: null,
      messages: [],
      isLoading: true,
      isTyping: false,
      error: null,
      contactError: null,
    });

    if (get().isPreview) {
      set({
        isLoading: false,
        conversationStatus: "open",
        messages: [tempMessage("assistant", welcomeMessage)],
        needsContact: requireContactData,
      });
      return;
    }

    const optionKey = option?.key ?? NO_OPTION_KEY;
    const visitorToken = getVisitorToken();

    const apply = (conversation: ChatConversationDto) => {
      if (seq !== requestSeq) return;
      storeConversation(optionKey, conversation.conversation_uuid);
      set({
        isLoading: false,
        conversationUuid: conversation.conversation_uuid,
        conversationStatus: conversation.status,
        messages: conversation.messages,
        visitor: conversation.visitor,
        needsContact: needsContactFor(conversation.visitor, requireContactData),
      });
    };

    try {
      // 1) Retomar la conversación anterior de esta opción, si existe y sigue abierta.
      const storedUuid = getStoredConversation(optionKey);
      if (storedUuid) {
        try {
          const { data } = await chatService.getConversation(storedUuid, visitorToken);
          if (data.status !== "closed") {
            apply(data);
            return;
          }
        } catch (err) {
          // 404 = ya no existe (la borraron desde el intranet) → se crea otra abajo.
          if (!(err instanceof HttpError && err.status === 404)) throw err;
        }
        storeConversation(optionKey, null);
      }

      // 2) Crear una nueva.
      const { data } = await chatService.startConversation({
        visitor_token: visitorToken,
        id_chatbot_option: option?.id ?? null,
        page_url: typeof window !== "undefined" ? window.location.pathname : null,
      });
      apply(data);
    } catch (err) {
      if (seq !== requestSeq) return;
      set({
        isLoading: false,
        error: errorMessage(err, "No pudimos iniciar el chat. Revisa tu conexión e inténtalo otra vez."),
      });
    }
  },

  sendMessage: async (content, inputType = "text") => {
    const text = content.trim();
    const state = get();
    if (!text || state.isTyping || state.isLoading || state.needsContact) return;

    const optimistic = tempMessage("user", text, inputType);
    set((s) => ({ messages: [...s.messages, optimistic], isTyping: true, error: null }));

    if (state.isPreview) {
      window.setTimeout(() => {
        set((s) => ({
          isTyping: false,
          messages: [
            ...s.messages,
            tempMessage("assistant", "(Vista previa) Aquí aparecerá la respuesta del asistente. Los mensajes de prueba no se guardan."),
          ],
        }));
      }, 600);
      return;
    }

    const uuid = state.conversationUuid;
    if (!uuid) {
      set((s) => ({
        isTyping: false,
        messages: s.messages.filter((m) => m.id !== optimistic.id),
        error: "El chat todavía no está listo. Inténtalo otra vez.",
      }));
      return;
    }

    const seq = requestSeq;
    try {
      const { data } = await chatService.sendMessage(uuid, {
        visitor_token: getVisitorToken(),
        content: text,
        input_type: inputType,
      });
      if (seq !== requestSeq) return;
      // Se reemplaza el mensaje optimista por el real (con su id y hora del servidor).
      set((s) => ({
        isTyping: false,
        messages: [...s.messages.map((m) => (m.id === optimistic.id ? data.user_message : m)), data.assistant_message],
      }));
    } catch (err) {
      if (seq !== requestSeq) return;
      // 422 por datos de contacto: el admin activó require_contact_data en el intranet
      // después de que este visitante abrió el chat → se le muestra el formulario.
      if (err instanceof HttpError && err.status === 422) {
        set((s) => ({
          isTyping: false,
          messages: s.messages.filter((m) => m.id !== optimistic.id),
          needsContact: true,
        }));
        return;
      }
      set((s) => ({
        isTyping: false,
        messages: s.messages.filter((m) => m.id !== optimistic.id),
        conversationStatus: err instanceof HttpError && err.status === 409 ? "closed" : s.conversationStatus,
        error: errorMessage(err, "No se pudo enviar el mensaje. Inténtalo otra vez."),
      }));
    }
  },

  saveContact: async (data) => {
    if (get().isPreview) {
      set({ needsContact: false });
      return true;
    }
    set({ isSavingContact: true, contactError: null });
    try {
      const response = await chatService.updateVisitor(getVisitorToken(), data);
      set({ isSavingContact: false, visitor: response.data, needsContact: !response.data.has_contact_data });
      return true;
    } catch (err) {
      set({
        isSavingContact: false,
        contactError:
          err instanceof HttpError && err.status === 422
            ? "Revisa los datos: el nombre y el teléfono son obligatorios, y el correo debe ser válido."
            : errorMessage(err, "No pudimos guardar tus datos. Inténtalo otra vez."),
      });
      return false;
    }
  },

  syncContactRequirement: (requireContactData) => {
    const { view, visitor, isPreview } = get();
    if (view !== "chat") return;
    if (!requireContactData) set({ needsContact: false });
    else if (isPreview || !visitor?.has_contact_data) set({ needsContact: true });
  },
}));
