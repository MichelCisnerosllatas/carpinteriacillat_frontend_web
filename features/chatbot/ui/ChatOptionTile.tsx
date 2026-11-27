"use client";

import type { SiteChatbotOptionDto } from "@/shared/services/site_service/model/siteget.dto";

interface ChatOptionTileProps {
  option: SiteChatbotOptionDto;
  primaryColor: string;
  onSelect: (option: SiteChatbotOptionDto) => void;
}

// Ícono de la derecha según lo que hace la opción: chevron si abre el chat dentro del panel,
// "salir" si abre algo afuera (WhatsApp o una URL).
const TRAILING_ICON: Record<SiteChatbotOptionDto["action"], string> = {
  chat: "fa-solid fa-chevron-right",
  whatsapp: "fa-solid fa-arrow-up-right-from-square",
  url: "fa-solid fa-arrow-up-right-from-square",
};

// Estilo ListTile de Flutter: leading (ícono en círculo) + título/subtítulo + trailing.
// Las opciones (texto, ícono, acción, orden) se administran en el intranet:
// Sitio Web → ChatBot → Opciones de inicio.
export default function ChatOptionTile({ option, primaryColor, onSelect }: ChatOptionTileProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(option)}
      className="flex w-full items-center gap-3 rounded-xl border border-gray-200 bg-white px-3 py-3 text-left shadow-sm transition hover:border-gray-300 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
    >
      <span
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white"
        style={{ backgroundColor: primaryColor }}
      >
        <i className={`${option.icon || "fa-solid fa-comment"} text-base`} aria-hidden />
      </span>

      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-semibold text-gray-900">{option.title}</span>
        {option.subtitle && <span className="block text-xs leading-snug text-gray-500">{option.subtitle}</span>}
      </span>

      <i className={`${TRAILING_ICON[option.action] ?? TRAILING_ICON.chat} shrink-0 text-xs text-gray-400`} aria-hidden />
    </button>
  );
}
