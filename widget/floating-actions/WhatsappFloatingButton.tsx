// widget/floating-actions/WhatsappFloatingButton.tsx
//
// Botón flotante de WhatsApp (antes vivía dentro de widget/footer/Footer.tsx). NO se posiciona
// solo: lo coloca FloatingActions.tsx, ya sea suelto en su esquina o apilado debajo del chatbot.

import { floatingAnimationClass } from "@/shared/lib/floatingAnimation";
import type { FloatingWhatsappButton } from "@/shared/services/site_service/lib/findFloatingWhatsapp";
import { buildWhatsappHref } from "@/shared/services/site_service/lib/whatsappLink";
import { FLOATING_BUTTON_SIZE } from "./floating.constants";

export default function WhatsappFloatingButton({ button }: { button: FloatingWhatsappButton }) {
  return (
    <a
      href={buildWhatsappHref(button.phone)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escríbenos por WhatsApp"
      className={`flex shrink-0 items-center justify-center rounded-full bg-green-500 text-white shadow-2xl transition-all hover:scale-110 hover:bg-green-600 ${floatingAnimationClass(button.animation)}`}
      style={{ width: FLOATING_BUTTON_SIZE, height: FLOATING_BUTTON_SIZE }}
    >
      <i className="fab fa-whatsapp text-3xl" aria-hidden />
    </a>
  );
}
