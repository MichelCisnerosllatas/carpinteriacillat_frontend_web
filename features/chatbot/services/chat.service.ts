import { httpClient } from "@/shared/api/http/httpClient";
import { coreUrl } from "@/shared/api/core/core.url";
import { CHATBOT_ENDPOINTS } from "./chat.endpoint";
import type {
  ApiEnvelope,
  ChatConversationDto,
  ChatVisitor,
  SendMessageRequestDto,
  SendMessageResponseDto,
  StartConversationRequestDto,
  UpdateVisitorRequestDto,
} from "../types/chat.types";

// La web SOLO manda el texto y recibe la respuesta ya armada. Quién responde (palabras
// hardcodeadas hoy, una API de IA mañana) se decide 100% en el backend
// (app/Services/Chatbot → ChatbotResponder, con CHATBOT_DRIVER en su .env). Nunca llames a una
// API de IA desde acá: expondrías la API key en el navegador.
export const chatService = {
  startConversation: (body: StartConversationRequestDto) =>
    httpClient.post<ApiEnvelope<ChatConversationDto>>(coreUrl(CHATBOT_ENDPOINTS.v1.conversations), body),

  getConversation: (uuid: string, visitorToken: string) =>
    httpClient.get<ApiEnvelope<ChatConversationDto>>(coreUrl(CHATBOT_ENDPOINTS.v1.conversation(uuid)), {
      params: { visitor_token: visitorToken },
    }),

  sendMessage: (uuid: string, body: SendMessageRequestDto) =>
    httpClient.post<ApiEnvelope<SendMessageResponseDto>>(coreUrl(CHATBOT_ENDPOINTS.v1.messages(uuid)), body),

  updateVisitor: (visitorToken: string, body: UpdateVisitorRequestDto) =>
    httpClient.patch<ApiEnvelope<ChatVisitor>>(coreUrl(CHATBOT_ENDPOINTS.v1.visitor(visitorToken)), body),
};
