// shared/components/section_heading/sectionHeading.styles.ts
//
// ESTÁNDAR de títulos de sección de TODO el sitio (colores del logo: rojo, amarillo y negro).
// Lo usa SectionHeading.tsx, y también los títulos con efectos propios (título animado de
// Servicios, secciones numeradas, cabecera de la galería) para que todos midan y se vean igual.
//
// Los tamaños usan clamp(): se achican solos según el ancho de la pantalla (sin saltos).
//   Eyebrow ............ 11px (celular) -> 13px (desktop)
//   Título de sección .. 24px -> 36px   (h2)
//   Título de página ... 28px -> 44px   (h1: el primero de cada página)
//   Descripción ........ 14px -> 16px

export const headingStyles = {
    // Línea pequeña sobre el título (section_subtitle), con la rayita amarilla a la izquierda.
    eyebrow: "il-display flex items-center gap-3 text-[11px] font-bold uppercase tracking-[.14em] sm:text-xs md:text-[13px]",
    eyebrowColor: { light: "text-brand-red", dark: "text-brand-gold" },
    eyebrowBar: "h-[3px] w-6 flex-none bg-brand-gold md:w-7",

    // Título (section_title).
    title: "il-display m-0 font-extrabold leading-[1.15] tracking-[-0.03em] [text-wrap:balance]",
    sectionTitleSize: "text-[clamp(1.5rem,1.15rem+1.5vw,2.25rem)]",
    pageTitleSize: "text-[clamp(1.75rem,1.3rem+2vw,2.75rem)]",
    titleColor: { light: "text-il-neutro-900", dark: "text-white" },

    // Descripción (section_description).
    description: "m-0 max-w-[60ch] text-sm leading-relaxed [text-wrap:pretty] md:text-base",
    descriptionColor: { light: "text-il-neutro-600", dark: "text-il-neutro-300" },
} as const;

export type HeadingTone = "light" | "dark";
