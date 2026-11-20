// shared/services/site_service/lib/chatbotDefaults.ts
//
// Mismos defaults que el modelo `Chatbot_setting` del backend. Se usan solo cuando el backend
// todavía no manda `site.chatbot` (backend viejo) — en ese caso el chatbot queda APAGADO
// (`chatbot_state: false`): sin backend no hay a dónde mandar los mensajes.
//
// Si quieres cambiar algo del chatbot NO lo cambies acá: se edita desde el intranet
// (Sitio Web → ChatBot → Configuración) y llega en `site.chatbot.settings`.

import type { SiteChatbotDto, SiteChatbotSettingsDto } from "../model/siteget.dto";

export const DEFAULT_CHATBOT_SETTINGS: SiteChatbotSettingsDto = {
  chatbot_state: false,
  show_on_mobile: true,
  position: "bottom-right",
  offset_x: 24,
  offset_y: 24,
  primary_color: "#2563eb",
  header_title: "Asistente virtual",
  header_subtitle: "Te respondemos al instante",
  launcher_icon: "fa-solid fa-comments",
  launcher_animation: "pulse",
  welcome_message: "¡Hola! 👋 ¿En qué podemos ayudarte hoy?",
  input_placeholder: "Escribe tu mensaje...",
  allow_voice: true,
  auto_open_seconds: null,
  require_contact_data: false,
};

export const DEFAULT_CHATBOT: SiteChatbotDto = {
  settings: DEFAULT_CHATBOT_SETTINGS,
  options: [],
};
