// shared/lib/ilDesign.ts
//
// Valores visuales que se repiten en varias secciones del rediseño (Servicios, Galería,
// Detalle). Se juntan acá para no copiar el mismo string en cada componente.

// Color de fondo que se ve mientras la foto carga, o si un trabajo no tiene foto. Se alterna
// por posición para que dos tarjetas vecinas no queden del mismo tono.
const TONES = [
    "var(--color-il-amarillo-100)",
    "var(--color-il-neutro-100)",
    "var(--color-il-neutro-200)",
    "var(--color-il-amarillo-100)",
];

export function toneAt(index: number): string {
    return TONES[index % TONES.length];
}

// Formas de esquina del diseño: "suave" es la normal y "hoja" la que aparece al pasar el
// mouse (dos esquinas opuestas más redondeadas).
export const SHAPE_SOFT = "20px";
export const SHAPE_LEAF = "56px 20px 56px 20px";
export const SHAPE_LEAF_INVERTED = "20px 56px 20px 56px";

// Curva de animación principal del diseño (la misma que "ease-il" en globals.css), para
// las transiciones que se escriben inline.
export const EASE_IL = "cubic-bezier(0.16,1,0.3,1)";
export const EASE_IL_PAGE = "cubic-bezier(0.65,0,0.35,1)";
