// features/chatbot/types/chat.types.ts
//
// Espejo de las respuestas de los endpoints públicos del chatbot en el backend
// (/v1/public/chatbot/*). Si el backend cambia un nombre, se cambia acá.

export type ChatRole = "user" | "assistant" | "agent";

// "voice" = el cliente lo dictó con el micrófono (se transcribe a texto en el navegador, ver
// hooks/useSpeechRecognition.ts). El backend solo lo guarda para que el intranet lo marque.
export type ChatInputType = "text" | "voice";

export type ChatConversationStatus = "open" | "attended" | "closed";

export type ChatMessage = {
  // Número = id real del backend. String = mensaje optimista todavía sin confirmar ("tmp-...").
  id: number | string;
  role: ChatRole;
  content: string;
  input_type: ChatInputType;
  created_at: string;
};

export type ChatVisitor = {
  name: string | null;
  phone: string | null;
  email: string | null;
  // name && phone — lo calcula el backend.
  has_contact_data: boolean;
};

export type ApiEnvelope<T> = {
  success: boolean;
  status: number;
  message: string;
  data: T;
};

// ─── Requests ────────────────────────────────────────────────────────────────

export type StartConversationRequestDto = {
  visitor_token: string;
  id_chatbot_option?: number | null;
  page_url?: string | null;
};

export type SendMessageRequestDto = {
  visitor_token: string;
  content: string;
  input_type: ChatInputType;
};

export type UpdateVisitorRequestDto = {
  name?: string;
  phone?: string;
  email?: string;
};

// ─── Responses ───────────────────────────────────────────────────────────────

export type ChatConversationDto = {
  conversation_uuid: string;
  status: ChatConversationStatus;
  option: { id: number; key: string; title: string } | null;
  visitor: ChatVisitor;
  messages: ChatMessage[];
};

export type SendMessageResponseDto = {
  user_message: ChatMessage;
  assistant_message: ChatMessage;
};
