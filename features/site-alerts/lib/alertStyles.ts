// features/site-alerts/lib/alertStyles.ts
//
// Traduce las opciones de una alerta (estilo y alineación) a clases de Tailwind
// e iconos de FontAwesome. Nunca se usa el string crudo del backend en un
// className: si llega un valor desconocido se cae a "info" / "center".

import type { SiteAlertAlign, SiteAlertStyle } from "../model/siteAlert";

type AlertStyleClasses = {
    // Fondo y color de texto de la barra.
    bar: string;
    // Icono del "leading" (a la izquierda del texto).
    icon: string;
};

const STYLES: Record<SiteAlertStyle, AlertStyleClasses> = {
    promo: {
        bar: "bg-gradient-to-r from-red-600 to-red-700 text-white",
        icon: "fas fa-star animate-spin",
    },
    info: {
        bar: "bg-gradient-to-r from-sky-600 to-blue-700 text-white",
        icon: "fas fa-circle-info",
    },
    warning: {
        bar: "bg-gradient-to-r from-yellow-500 to-amber-600 text-gray-900",
        icon: "fas fa-triangle-exclamation",
    },
    success: {
        bar: "bg-gradient-to-r from-emerald-600 to-green-700 text-white",
        icon: "fas fa-circle-check",
    },
};

type AlertAlignClasses = {
    // Reparte los elementos de la fila (icono, texto, trailing).
    justify: string;
    // Alinea el título/subtítulo cuando se parten en varias líneas.
    text: string;
};

const ALIGNS: Record<SiteAlertAlign, AlertAlignClasses> = {
    left: { justify: "justify-start", text: "text-left" },
    center: { justify: "justify-center", text: "text-center" },
    right: { justify: "justify-end", text: "text-right" },
};

export function getAlertStyle(style: string): AlertStyleClasses {
    return STYLES[style as SiteAlertStyle] ?? STYLES.info;
}

export function getAlertAlign(align: string): AlertAlignClasses {
    return ALIGNS[align as SiteAlertAlign] ?? ALIGNS.center;
}
