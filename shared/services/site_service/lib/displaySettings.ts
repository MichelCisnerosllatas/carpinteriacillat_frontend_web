// shared/services/site_service/lib/displaySettings.ts
//
// "Apariencia" de una sección: el intranet decide qué MUESTRA la web de cada sección
// (visibilidad de cada elemento, textos, números, opciones y listas). Llega en
// section.display_settings como { "<clave>": valor } con TODAS las claves del catálogo ya
// resueltas por el backend (ej. { "card.show_price": false, "card.price_prefix": "Aprox." }).
//
// El catálogo de claves de cada tipo de sección vive en el backend
// (config/section_display/*.php). Aquí cada sección lee sus claves con estos getters, pasando
// como `fallback` el default del catálogo: si la sección o la clave no vienen (backend viejo,
// vista previa a medio armar) o el valor no tiene el tipo esperado, se usa el fallback.
//
// Para agregar un elemento nuevo: se agrega al catálogo del backend y aquí se lee con el getter
// de su tipo (toggle → getDisplayBool, text/textarea → getDisplayText, number →
// getDisplayNumber, select → getDisplayOption, list → getDisplayList).
//
// Funciones puras (sin React).

import type { SiteSectionDto } from "../model/siteget.dto";

// Acepta la sección completa, solo su display_settings, o nada (sin sección = todo default).
export type DisplaySettingsSource = Pick<SiteSectionDto, "display_settings"> | null | undefined;

// Una fila de un campo "list" (ej. filas de la ficha técnica): en el orden en que se muestran.
export type DisplayListItem = {
    key: string;
    label: string;
    visible: boolean;
};

function rawValue(section: DisplaySettingsSource, key: string): unknown {
    return section?.display_settings?.[key];
}

// toggle: true / false.
export function getDisplayBool(section: DisplaySettingsSource, key: string, fallback = true): boolean {
    const value = rawValue(section, key);
    return typeof value === "boolean" ? value : fallback;
}

// text / textarea: el backend ya recortó y reemplazó los vacíos no permitidos por el default,
// así que un "" que llega es intencional (campos allow_empty) y se respeta.
export function getDisplayText(section: DisplaySettingsSource, key: string, fallback: string): string {
    const value = rawValue(section, key);
    return typeof value === "string" ? value : fallback;
}

// number: entero, acotado a min/max si se pasan (por si llega algo fuera de rango).
export function getDisplayNumber(section: DisplaySettingsSource, key: string, fallback: number, min?: number, max?: number): number {
    const value = rawValue(section, key);
    if (typeof value !== "number" || !Number.isFinite(value)) return fallback;
    let result = Math.round(value);
    if (min !== undefined) result = Math.max(min, result);
    if (max !== undefined) result = Math.min(max, result);
    return result;
}

// select: solo vale si es una de las opciones conocidas.
export function getDisplayOption<T extends string>(section: DisplaySettingsSource, key: string, options: readonly T[], fallback: T): T {
    const value = rawValue(section, key);
    return typeof value === "string" && (options as readonly string[]).includes(value) ? (value as T) : fallback;
}

// list: mismas reglas que el resolve del backend. Se respetan el orden y los valores guardados
// (solo keys conocidas, sin repetir; etiqueta vacía → la de por defecto) y al final se agregan,
// visibles, las filas del catálogo que falten. `fallback` = filas por defecto, en su orden.
export function getDisplayList(section: DisplaySettingsSource, key: string, fallback: readonly DisplayListItem[]): DisplayListItem[] {
    const value = rawValue(section, key);
    if (!Array.isArray(value)) return fallback.map((item) => ({ ...item }));

    const defaults = new Map(fallback.map((item) => [item.key, item]));
    const seen = new Set<string>();
    const result: DisplayListItem[] = [];

    for (const entry of value) {
        if (!entry || typeof entry !== "object") continue;
        const { key: itemKey, label, visible } = entry as Record<string, unknown>;
        if (typeof itemKey !== "string" || seen.has(itemKey)) continue;
        const base = defaults.get(itemKey);
        if (!base) continue; // fila que ya no existe en el catálogo
        seen.add(itemKey);
        result.push({
            key: itemKey,
            label: typeof label === "string" && label.trim() ? label : base.label,
            visible: typeof visible === "boolean" ? visible : true,
        });
    }

    for (const item of fallback) {
        if (!seen.has(item.key)) result.push({ ...item, visible: true });
    }

    return result;
}
