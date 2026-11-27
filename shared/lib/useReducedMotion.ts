// shared/lib/useReducedMotion.ts
//
// true si la persona activó "reducir movimiento" en su sistema operativo. Las secciones del
// rediseño lo usan para NO arrancar movimientos automáticos (rotación del hero, barrido del
// antes/después). Las transiciones CSS ya se apagan solas en globals.css (.il-scope).
//
// useSyncExternalStore es la forma que recomienda React para leer algo "de afuera" (acá, una
// media query del navegador) y re-renderizar cuando cambia.
"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
    const media = window.matchMedia(QUERY);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
}

function getSnapshot() {
    return window.matchMedia(QUERY).matches;
}

// En el servidor no hay window: se asume "sin preferencia" y el navegador corrige al hidratar.
function getServerSnapshot() {
    return false;
}

export function useReducedMotion(): boolean {
    return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
