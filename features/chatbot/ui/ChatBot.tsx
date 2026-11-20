"use client";

// features/chatbot/ui/ChatBot.tsx
//
// Chatbot flotante de TODO el sitio (se monta una sola vez en app/layout.tsx).
//
// ¿De dónde sale cada cosa?
//   - Diseño, comportamiento, visibilidad y posición → site.chatbot.settings, editable en el
//     intranet: Sitio Web → ChatBot → Configuración. Se lee de useSiteStore (no de una prop)
//     para que el panel de vista previa del intranet (/preview) pueda cambiarlo en caliente.
//   - Opciones de la pantalla inicial (ListTiles) → site.chatbot.options, editables en
//     Sitio Web → ChatBot → Opciones de inicio.
//   - Conversaciones y visitantes → se guardan en el backend y se ven en el intranet en
//     Sitio Web → ChatBot → Conversaciones / Visitantes.
//   - Las RESPUESTAS del bot → las arma el backend (hoy palabras clave hardcodeadas; mañana
//     una API de IA). Esta web nunca decide qué responder.
//
// Navegación del panel:
//   home (ListTiles) → tocar una opción "chat" → chat. El botón ← solo aparece en el chat y
//   solo si hay pantalla de inicio a la cual volver: si hay UNA sola opción de chat (o
//   ninguna), se entra directo al chat y no se muestra la pantalla de inicio.

import { useCallback, useEffect, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { useSiteStore } from "@/shared/store/site/useSiteStore";
import { floatingAnimationClass, resolveFloatingAnimation } from "@/shared/lib/floatingAnimation";
import { DEFAULT_CHATBOT } from "@/shared/services/site_service/lib/chatbotDefaults";
import { findFloatingWhatsapp } from "@/shared/services/site_service/lib/findFloatingWhatsapp";
import { buildWhatsappHref } from "@/shared/services/site_service/lib/whatsappLink";
import type { SiteChatbotOptionDto } from "@/shared/services/site_service/model/siteget.dto";
import { useChatBotStore } from "../store/chatbot.store";
import { markAutoOpened, wasAutoOpened } from "../lib/chatStorage";
import ChatHeader from "./ChatHeader";
import ChatHome from "./ChatHome";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
import ChatContactForm from "./ChatContactForm";

// Mismas medidas que widget/floating-actions/floating.constants.ts (FLOATING_BUTTON_SIZE /
// FLOATING_GAP) — duplicadas a propósito para no importar un widget desde un feature.
const LAUNCHER_SIZE = 60;
const GAP = 14;

type ChatBotProps = {
  // Lo que va apilado DEBAJO del botón del chat, en la misma esquina (hoy: el botón de WhatsApp
  // cuando comparte esquina). Lo decide widget/floating-actions/FloatingActions.tsx.
  stackBelow?: ReactNode;
  // Alto en px de `stackBelow` + su espacio, para ubicar el panel encima de todo.
  stackBelowHeight?: number;
};

export default function ChatBot({ stackBelow = null, stackBelowHeight = 0 }: ChatBotProps) {
  const pathname = usePathname();
  const isPreview = pathname?.startsWith("/preview") ?? false;

  const site = useSiteStore((s) => s.site);
  const previewTick = useSiteStore((s) => s.chatbotPreviewTick);
  const chatbot = site?.chatbot ?? DEFAULT_CHATBOT;
  const { settings, options } = chatbot;

  const store = useChatBotStore();
  const { isOpen, view, open, close, toggle, goHome, openChat, setPreview, syncContactRequirement } = store;

  // Si hay una sola opción de chat (o ninguna), no hay nada que elegir: se entra directo.
  const skipHome = options.length === 0 || (options.length === 1 && options[0].action === "chat");
  const directOption = options.length === 1 ? options[0] : null;

  useEffect(() => {
    setPreview(isPreview);
  }, [isPreview, setPreview]);

  // /preview: cada cambio que manda el intranet sube el tick → se abre el panel para verlo.
  useEffect(() => {
    if (previewTick > 0) open();
  }, [previewTick, open]);

  // auto_open_seconds (intranet): se abre solo, una vez por sesión. Nunca en /preview.
  useEffect(() => {
    if (isPreview || !settings.chatbot_state || settings.auto_open_seconds == null) return;
    if (wasAutoOpened()) return;
    const timer = window.setTimeout(() => {
      markAutoOpened();
      if (!useChatBotStore.getState().isOpen) open();
    }, Math.max(0, settings.auto_open_seconds) * 1000);
    return () => window.clearTimeout(timer);
  }, [isPreview, settings.chatbot_state, settings.auto_open_seconds, open]);

  const startChat = useCallback(
    (option: SiteChatbotOptionDto | null) =>
      openChat({ option, welcomeMessage: settings.welcome_message, requireContactData: settings.require_contact_data }),
    [openChat, settings.welcome_message, settings.require_contact_data]
  );

  // Entrada directa al chat cuando no hay pantalla de inicio.
  useEffect(() => {
    if (isOpen && view === "home" && skipHome) void startChat(directOption);
  }, [isOpen, view, skipHome, directOption, startChat]);

  // Si el admin prende/apaga "pedir datos de contacto" (en /preview), se refleja al instante.
  useEffect(() => {
    syncContactRequirement(settings.require_contact_data);
  }, [settings.require_contact_data, syncContactRequirement]);

  // Escape cierra el panel.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, close]);

  const handleSelect = (option: SiteChatbotOptionDto) => {
    if (option.action === "chat") {
      void startChat(option);
      return;
    }
    if (option.action === "whatsapp") {
      // Sin número propio en la opción → usa el del botón flotante de WhatsApp.
      const phone = option.value || findFloatingWhatsapp(site)?.phone || "";
      window.open(buildWhatsappHref(phone), "_blank", "noopener,noreferrer");
      return;
    }
    if (option.action === "url" && option.value) {
      window.open(option.value, "_blank", "noopener,noreferrer");
    }
  };

  // chatbot_state apagado en el intranet → no se pinta (salvo en /preview, con una marca).
  if (!settings.chatbot_state && !isPreview) return null;

  // ─── Posición ──────────────────────────────────────────────────────────────
  // Un contenedor fijo en la esquina (offset_x / offset_y del intranet) con los botones en
  // columna y centrados: arriba el del chat, abajo lo que venga en `stackBelow` (WhatsApp).
  // El panel va encima de toda la columna.
  const side = settings.position === "bottom-left" ? "left" : "right";
  const panelBottom = settings.offset_y + stackBelowHeight + LAUNCHER_SIZE + GAP;
  const color = settings.primary_color || DEFAULT_CHATBOT.settings.primary_color;
  // Sin animación mientras el panel está abierto (distrae y el botón pasa a ser "cerrar").
  const animation = isOpen ? "none" : resolveFloatingAnimation(settings.launcher_animation, "pulse");
  // show_on_mobile apagado → se oculta SOLO lo del chat; WhatsApp (stackBelow) sigue visible.
  const displayClass = settings.show_on_mobile ? "flex" : "hidden md:flex";

  const showBack = view === "chat" && !skipHome;
  const headerTitle = view === "chat" && store.activeOption ? store.activeOption.title : settings.header_title;

  return (
    <>
      {isOpen && (
        <div
          role="dialog"
          aria-label={settings.header_title}
          className={`fixed z-[60] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl ${displayClass}`}
          style={{
            [side]: settings.offset_x,
            bottom: panelBottom,
            width: `min(360px, calc(100vw - ${settings.offset_x * 2}px))`,
            height: `min(540px, calc(100dvh - ${panelBottom + 16}px))`,
          }}
        >
          <ChatHeader
            title={headerTitle}
            subtitle={settings.header_subtitle}
            primaryColor={color}
            onBack={showBack ? goHome : undefined}
            onClose={close}
          />

          {view === "home" && !skipHome ? (
            <ChatHome welcomeMessage={settings.welcome_message} options={options} primaryColor={color} onSelect={handleSelect} />
          ) : (
            <ChatBody
              color={color}
              placeholder={settings.input_placeholder}
              allowVoice={settings.allow_voice}
              onRetry={() => void startChat(store.activeOption ?? directOption)}
            />
          )}
        </div>
      )}

      {/* Columna de botones flotantes de esta esquina */}
      <div className="fixed z-[60] flex flex-col items-center" style={{ [side]: settings.offset_x, bottom: settings.offset_y, gap: GAP }}>
        <button
          type="button"
          onClick={toggle}
          aria-label={isOpen ? "Cerrar chat" : "Abrir chat"}
          aria-expanded={isOpen}
          className={`relative shrink-0 items-center justify-center rounded-full text-white shadow-2xl transition hover:scale-110 ${displayClass} ${floatingAnimationClass(animation)}`}
          style={{ width: LAUNCHER_SIZE, height: LAUNCHER_SIZE, backgroundColor: color }}
        >
          <i className={`${isOpen ? "fa-solid fa-xmark" : settings.launcher_icon || "fa-solid fa-comments"} text-2xl`} aria-hidden />
          {isPreview && !settings.chatbot_state && (
            <span className="absolute -top-2 whitespace-nowrap rounded-full bg-gray-900 px-2 py-0.5 text-[10px] font-semibold text-white">
              Oculto en la web
            </span>
          )}
        </button>
        {stackBelow}
      </div>
    </>
  );
}

// Cuerpo de la vista "chat": carga → error → mensajes + (formulario de contacto | input).
function ChatBody({ color, placeholder, allowVoice, onRetry }: { color: string; placeholder: string; allowVoice: boolean; onRetry: () => void }) {
  const { messages, isLoading, isTyping, error, conversationStatus, needsContact, visitor, isSavingContact, contactError, sendMessage, saveContact } =
    useChatBotStore();

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center bg-gray-50 text-gray-400">
        <i className="fa-solid fa-spinner fa-spin text-2xl" aria-label="Cargando chat" />
      </div>
    );
  }

  // No se pudo crear/recuperar la conversación (sin mensajes que mostrar).
  if (error && messages.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 bg-gray-50 p-6 text-center">
        <p className="text-sm text-gray-600">{error}</p>
        <button type="button" onClick={onRetry} className="rounded-lg px-4 py-2 text-sm font-semibold text-white" style={{ backgroundColor: color }}>
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <>
      <ChatMessages messages={messages} isTyping={isTyping} primaryColor={color} />

      {error && <p className="shrink-0 bg-red-50 px-4 py-2 text-xs text-red-700">{error}</p>}

      {conversationStatus === "closed" ? (
        <p className="shrink-0 border-t border-gray-200 bg-white p-3 text-center text-xs text-gray-500">Esta conversación fue cerrada.</p>
      ) : needsContact ? (
        <ChatContactForm primaryColor={color} initial={visitor} isSaving={isSavingContact} error={contactError} onSubmit={(data) => void saveContact(data)} />
      ) : (
        <ChatInput placeholder={placeholder} primaryColor={color} allowVoice={allowVoice} disabled={isTyping} onSend={(content, type) => void sendMessage(content, type)} />
      )}
    </>
  );
}
