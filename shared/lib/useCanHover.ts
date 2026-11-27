// shared/lib/useCanHover.ts
//
// true si el dispositivo tiene mouse de verdad (puede "pasar por encima"). En celulares y
// tablets es false: ahí los efectos de hover no existen y cada sección usa toques, giros
// automáticos o "tarjeta centrada en pantalla" en su lugar.
//
// Mismo patrón que useReducedMotion.ts: useSyncExternalStore + matchMedia (se actualiza solo
// si cambia, ej. al conectar un mouse a una tablet).
"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(hover: hover) and (pointer: fine)";

function subscribe(onChange: () => void) {
    const media = window.matchMedia(QUERY);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
}

function getSnapshot() {
    return window.matchMedia(QUERY).matches;
}

// En el servidor no se sabe: se asume escritorio (con mouse) y el navegador corrige al hidratar.
function getServerSnapshot() {
    return true;
}

export function useCanHover(): boolean {
    return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
