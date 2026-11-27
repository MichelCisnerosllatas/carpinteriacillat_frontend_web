// shared/lib/floatingAnimation.ts
//
// Catálogo de animaciones de los botones flotantes (chatbot y WhatsApp). Es UNO solo para los
// dos, administrable desde el intranet:
//   - ChatBot  → Sitio Web → ChatBot → Configuración → Apariencia ("Animación del botón"),
//                se guarda en chatbot_setting.launcher_animation.
//   - WhatsApp → Sitio Web → Secciones → Items de Sección → item "WhatsApp" de Contacto
//                ("Animación del botón flotante"), se guarda en sectionitem_suffix (ver
//                findFloatingWhatsapp.ts).
//
// Las animaciones en sí son clases CSS (.fab-anim-*) en app/globals.css. Para agregar una nueva:
// agrégala acá, en globals.css, en ChatbotSetting::ANIMATIONS (backend) y en el select del
// intranet (FLOATING_ANIMATION_OPTIONS).

export const FLOATING_ANIMATIONS = ["none", "pulse", "bounce", "wiggle", "float"] as const;

export type FloatingAnimation = (typeof FLOATING_ANIMATIONS)[number];

/** Valor guardado (texto libre en BD) → animación válida; cualquier otro valor cae en `fallback`. */
export function resolveFloatingAnimation(value: string | null | undefined, fallback: FloatingAnimation): FloatingAnimation {
  return (FLOATING_ANIMATIONS as readonly string[]).includes(value ?? "") ? (value as FloatingAnimation) : fallback;
}

/** Clases CSS de la animación ("" si es "none"). */
export function floatingAnimationClass(animation: FloatingAnimation): string {
  return animation === "none" ? "" : `fab-anim fab-anim-${animation}`;
}
