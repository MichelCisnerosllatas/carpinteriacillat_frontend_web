// shared/services/site_service/lib/whatsappLink.ts
//
// Arma el enlace wa.me del WhatsApp de la empresa. El número sale del mismo item que usa el
// botón flotante del footer (ver findFloatingWhatsapp.ts): así el botón flotante y el botón
// «Cotizar uno similar» del detalle de un trabajo llevan SIEMPRE al mismo número.
// Antes vivía dentro de widget/footer/Footer.tsx; se movió aquí para compartirlo.

// Número de siempre (wa.me/51999999999) — SOLO como último recurso si el número que trae el
// item no sirve para armar el link. No es un fallback de VISIBILIDAD: si el item no existe o
// está desactivado, findFloatingWhatsapp() devuelve null y quien lo usa no pinta el botón.
const WHATSAPP_PHONE_FALLBACK = "51999999999";

// `message` (opcional): texto que aparece ya escrito en el chat (?text=...).
export function buildWhatsappHref(phone: string, message?: string): string {
    const digits = phone.replace(/\D/g, "");
    const base = `https://wa.me/${digits || WHATSAPP_PHONE_FALLBACK}`;
    const text = message?.trim();
    return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}
