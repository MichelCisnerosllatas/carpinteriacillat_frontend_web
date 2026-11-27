// features/site-alerts/store/useSiteAlertsStore.ts
//
// Recuerda qué alertas cerró el cliente con la ✕. Se guarda en sessionStorage
// (clave "site-alerts-dismissed") para que sigan cerradas al cambiar de página
// o recargar, pero vuelvan a salir en una pestaña nueva.
//
// Cada alerta cerrada se guarda como "<id>:<updated_at>": si el admin edita la
// alerta cambia su updated_at y vuelve a aparecer aunque ya se hubiera cerrado.
//
// sessionStorage puede estar bloqueado (modo privado, cookies desactivadas...):
// todo acceso va en try/catch y, si falla, las cerradas solo duran en memoria.
//
// IMPORTANTE: sessionStorage no existe en el servidor. Por eso el store arranca
// vacío y `load()` se llama recién en el navegador (useEffect de SiteAlerts);
// `loaded` indica que ya se leyó y que ya se pueden aplicar los filtros que
// dependen del navegador (cerradas y fechas) sin causar hydration mismatch.

import { create } from "zustand";
import type { SiteAlertDto } from "../model/siteAlert";

const STORAGE_KEY = "site-alerts-dismissed";

// Clave con la que se recuerda una alerta cerrada.
export function getDismissKey(alert: SiteAlertDto): string {
    return `${alert.id_web_alert}:${alert.updated_at ?? ""}`;
}

function readStorage(): string[] {
    try {
        const raw = window.sessionStorage.getItem(STORAGE_KEY);
        if (!raw) return [];
        const parsed: unknown = JSON.parse(raw);
        // Solo nos quedamos con textos (por si quedó basura en la clave).
        if (!Array.isArray(parsed)) return [];
        return parsed.filter((value): value is string => typeof value === "string");
    } catch {
        return [];
    }
}

function writeStorage(keys: string[]) {
    try {
        window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(keys));
    } catch {
        // sessionStorage bloqueado o lleno: se recuerda solo en memoria.
    }
}

type SiteAlertsState = {
    // Claves "<id>:<updated_at>" de las alertas cerradas.
    dismissedKeys: string[];
    // Hora del navegador (ms) con la que se revisan las fechas de las alertas.
    // Se toma una vez al cargar la página (no hay polling).
    now: number | null;
    // true cuando ya corrió load() en el navegador.
    loaded: boolean;

    load: () => void;
    dismiss: (alert: SiteAlertDto) => void;
    isDismissed: (alert: SiteAlertDto) => boolean;
};

export const useSiteAlertsStore = create<SiteAlertsState>((set, get) => ({
    dismissedKeys: [],
    now: null,
    loaded: false,

    load: () => {
        if (get().loaded) return;
        set({ dismissedKeys: readStorage(), now: Date.now(), loaded: true });
    },

    dismiss: (alert) => {
        const key = getDismissKey(alert);
        const current = get().dismissedKeys;
        if (current.includes(key)) return;
        const next = [...current, key];
        set({ dismissedKeys: next });
        writeStorage(next);
    },

    isDismissed: (alert) => get().dismissedKeys.includes(getDismissKey(alert)),
}));
