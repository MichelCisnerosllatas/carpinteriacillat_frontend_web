// features/chatbot/lib/chatStorage.ts
//
// Lo único que el chatbot guarda en el navegador:
//   - visitor_token: uuid ANÓNIMO que identifica a este navegador ante el backend
//     (tabla chatbot_visitor). No es un dato personal: si el cliente borra sus datos del sitio,
//     simplemente se crea un visitante nuevo.
//   - el uuid de la conversación de cada opción, para retomarla al volver a entrar.
// Todo va en try/catch: en modo incógnito o con el almacenamiento bloqueado el chatbot sigue
// funcionando, solo que sin recordar nada entre recargas.

const VISITOR_KEY = "cillat_chatbot_visitor_token";
const CONVERSATION_KEY_PREFIX = "cillat_chatbot_conversation_";
const AUTO_OPENED_KEY = "cillat_chatbot_auto_opened";

// Token en memoria por si localStorage no está disponible (se mantiene mientras dure la página).
let memoryVisitorToken: string | null = null;

// crypto.randomUUID solo existe en contextos seguros (https o localhost). Si el sitio se abre
// por IP en la red local (http://192.168...), no existe — por eso el respaldo manual (uuid v4).
function generateUuid(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  const bytes = new Uint8Array(16);
  if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") {
    crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < 16; i++) bytes[i] = Math.floor(Math.random() * 256);
  }
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

export function getVisitorToken(): string {
  try {
    const stored = window.localStorage.getItem(VISITOR_KEY);
    if (stored) return stored;
    const token = generateUuid();
    window.localStorage.setItem(VISITOR_KEY, token);
    return token;
  } catch {
    memoryVisitorToken ??= generateUuid();
    return memoryVisitorToken;
  }
}

// `optionKey` = chatbot_option.option_key, o "default" si el chatbot no tiene opciones.
export function getStoredConversation(optionKey: string): string | null {
  try {
    return window.localStorage.getItem(CONVERSATION_KEY_PREFIX + optionKey);
  } catch {
    return null;
  }
}

export function storeConversation(optionKey: string, uuid: string | null): void {
  try {
    if (uuid) window.localStorage.setItem(CONVERSATION_KEY_PREFIX + optionKey, uuid);
    else window.localStorage.removeItem(CONVERSATION_KEY_PREFIX + optionKey);
  } catch {
    // sin almacenamiento: no se podrá retomar tras recargar, nada más
  }
}

// auto_open_seconds: el chatbot se abre solo UNA vez por sesión del navegador, no en cada página.
export function wasAutoOpened(): boolean {
  try {
    return window.sessionStorage.getItem(AUTO_OPENED_KEY) === "1";
  } catch {
    return false;
  }
}

export function markAutoOpened(): void {
  try {
    window.sessionStorage.setItem(AUTO_OPENED_KEY, "1");
  } catch {
    // ignorar
  }
}
