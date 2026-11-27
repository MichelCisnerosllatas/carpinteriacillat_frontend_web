// shared/lib/useIsMobile.ts
//
// true si la ventana mide menos de 760px (el mismo corte que usa el diseño del rediseño).
// Úsalo SOLO cuando un valor no se puede resolver con CSS (ej. un cálculo de transform en JS,
// ver CategoryCoverflow.tsx). Para layout normal es mejor la clase de Tailwind
// "min-[760px]:..." porque no depende de JS.
"use client";

import { useSyncExternalStore } from "react";

export const MOBILE_BREAKPOINT = 760;

function subscribe(onChange: () => void) {
    window.addEventListener("resize", onChange);
    return () => window.removeEventListener("resize", onChange);
}

function getSnapshot() {
    return window.innerWidth < MOBILE_BREAKPOINT;
}

// En el servidor no se sabe el ancho: se asume escritorio y el navegador corrige al hidratar.
function getServerSnapshot() {
    return false;
}

export function useIsMobile(): boolean {
    return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
