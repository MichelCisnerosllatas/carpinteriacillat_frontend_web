// Endpoints públicos del chatbot (backend: routes/api/v1/public/chatbot). Limitados por el
// backend con throttle:30,1 (30 por minuto por IP): un 429 llega como HttpError con status 429.
export const CHATBOT_ENDPOINTS = {
  v1: {
    conversations: "/v1/public/chatbot/conversations",
    conversation: (uuid: string) => `/v1/public/chatbot/conversations/${encodeURIComponent(uuid)}`,
    messages: (uuid: string) => `/v1/public/chatbot/conversations/${encodeURIComponent(uuid)}/messages`,
    visitor: (token: string) => `/v1/public/chatbot/visitors/${encodeURIComponent(token)}`,
  },
};
