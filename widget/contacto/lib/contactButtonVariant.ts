// widget/contacto/lib/contactButtonVariant.ts
//
// Estilo compartido entre ContactInfoCard.tsx (botones tipo "enlace", ej. WhatsApp) y
// ContactForm.tsx (botón tipo "acción", el submit) — ambos son section_buttons reales y
// respetan la misma `variant` administrada desde el intranet. Colores propios (no los de
// BUTTON_PRIMARY_CLASS/BUTTON_SECONDARY_CLASS de Section1.tsx) porque esta sección vive sobre
// fondo blanco, no sobre el hero oscuro.
const CONTACT_BUTTON_PRIMARY_CLASS = "bg-red-600 text-white hover:bg-red-700";
const CONTACT_BUTTON_SECONDARY_CLASS = "border-2 border-gray-200 bg-gray-50 text-gray-900 hover:bg-gray-100";

export function contactButtonVariantClass(variant: string | null | undefined): string {
  return variant === "secondary" ? CONTACT_BUTTON_SECONDARY_CLASS : CONTACT_BUTTON_PRIMARY_CLASS;
}
