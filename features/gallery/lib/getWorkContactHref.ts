// features/gallery/lib/getWorkContactHref.ts
//
// Enlace del botón «Cotizar uno similar» del detalle de un trabajo (grupo "contact" de la
// Apariencia de la Galería). Devuelve null cuando el botón NO debe pintarse:
//   - el intranet lo dejó apagado (contact.show, apagado por defecto);
//   - "A dónde lleva" = WhatsApp, pero la empresa no tiene WhatsApp (el mismo item del botón
//     flotante del footer, ver findFloatingWhatsapp.ts);
//   - "A dónde lleva" = Un enlace, pero el enlace está vacío.
// En el mensaje de WhatsApp, {titulo} se reemplaza por el título del trabajo.
//
// Función pura (sin React).

import { buildWhatsappHref } from "@/shared/services/site_service/lib/whatsappLink";
import type { FloatingWhatsappButton } from "@/shared/services/site_service/lib/findFloatingWhatsapp";
import type { DetailContactSettings } from "./workGallerySettings";

export function getWorkContactHref(
    contact: DetailContactSettings,
    whatsapp: FloatingWhatsappButton | null,
    workTitle: string
): string | null {
    if (!contact.show) return null;

    if (contact.target === "link") {
        const url = contact.url.trim();
        return url || null;
    }

    if (!whatsapp) return null;
    const message = contact.whatsappMessage.replace(/\{titulo\}/g, workTitle);
    return buildWhatsappHref(whatsapp.phone, message);
}
