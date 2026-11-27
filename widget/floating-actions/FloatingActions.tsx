"use client";

// widget/floating-actions/FloatingActions.tsx
//
// ÚNICO lugar que posiciona los botones flotantes del sitio (chatbot + WhatsApp). Antes cada uno
// calculaba su posición por su cuenta (WhatsApp en el Footer, el chatbot sumando px "a mano") y
// en la misma esquina quedaban desalineados y se pisaban con la animación.
//
// Regla:
//   - Si el chatbot está visible y WhatsApp está en la MISMA esquina → WhatsApp va dentro del
//     contenedor del chatbot, debajo de su botón (mismo tamaño, centrados, espacio fijo).
//   - Si no → cada uno en su esquina.
//
// Se lee todo de useSiteStore (no de props) para que /preview pueda cambiarlo en caliente.

import { usePathname } from "next/navigation";
import ChatBot from "@/features/chatbot/ui/ChatBot";
import { useSiteStore } from "@/shared/store/site/useSiteStore";
import { DEFAULT_CHATBOT } from "@/shared/services/site_service/lib/chatbotDefaults";
import { findFloatingWhatsapp } from "@/shared/services/site_service/lib/findFloatingWhatsapp";
import { FLOATING_BUTTON_SIZE, FLOATING_GAP, WHATSAPP_POSITION_CLASS, resolveWhatsappPosition } from "./floating.constants";
import WhatsappFloatingButton from "./WhatsappFloatingButton";

export default function FloatingActions() {
  const pathname = usePathname();
  const isPreview = pathname?.startsWith("/preview") ?? false;

  const site = useSiteStore((s) => s.site);
  const settings = site?.chatbot?.settings ?? DEFAULT_CHATBOT.settings;
  const whatsapp = findFloatingWhatsapp(site);

  const chatbotVisible = settings.chatbot_state || isPreview;
  const whatsappPosition = whatsapp ? resolveWhatsappPosition(whatsapp.position) : null;
  const sameCorner = chatbotVisible && whatsappPosition === settings.position;

  return (
    <>
      {chatbotVisible && (
        <ChatBot
          stackBelow={sameCorner && whatsapp ? <WhatsappFloatingButton button={whatsapp} /> : null}
          stackBelowHeight={sameCorner ? FLOATING_BUTTON_SIZE + FLOATING_GAP : 0}
        />
      )}

      {whatsapp && whatsappPosition && !sameCorner && (
        <div className={`fixed z-50 ${WHATSAPP_POSITION_CLASS[whatsappPosition]}`}>
          <WhatsappFloatingButton button={whatsapp} />
        </div>
      )}
    </>
  );
}
