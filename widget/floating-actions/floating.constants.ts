// widget/floating-actions/floating.constants.ts
//
// Medidas compartidas por los botones flotantes (chatbot y WhatsApp). Los dos usan el MISMO
// tamaño para que, cuando se apilan en la misma esquina, queden centrados uno sobre otro.

/** Diámetro de cada botón flotante, en px. */
export const FLOATING_BUTTON_SIZE = 60;

/** Espacio entre botones apilados (y entre el botón del chat y su panel), en px. */
export const FLOATING_GAP = 14;

/** Margen por defecto al borde de la pantalla cuando el chatbot no está en esa esquina, en px. */
export const FLOATING_DEFAULT_OFFSET = 24;

// Posición del botón de WhatsApp → clases de Tailwind. `sectionitem_variant` de ese item guarda
// uno de estos valores (ver findFloatingWhatsapp.ts); cualquier otro valor (o ausente) cae en
// "bottom-right". Solo se usan cuando WhatsApp NO comparte esquina con el chatbot (si la
// comparte, va dentro del contenedor del chatbot, ver FloatingActions.tsx).
export const WHATSAPP_POSITION_CLASS: Record<string, string> = {
  "bottom-right": "bottom-6 right-6",
  "bottom-left": "bottom-6 left-6",
  "bottom-center": "bottom-6 left-1/2 -translate-x-1/2",
  "top-right": "top-24 right-6",
  "top-left": "top-24 left-6",
};

export function resolveWhatsappPosition(position: string | null): string {
  return position && WHATSAPP_POSITION_CLASS[position] ? position : "bottom-right";
}
