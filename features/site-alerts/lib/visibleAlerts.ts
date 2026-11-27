// features/site-alerts/lib/visibleAlerts.ts
//
// Funciones puras (sin React ni navegador) que deciden qué alertas se pintan.

import type { SiteAlertDto } from "../model/siteAlert";
import { getDismissKey } from "../store/useSiteAlertsStore";

// A partir de cuántos px de scroll se ocultan las alertas "hide" (igual que el
// navbar, que pasa a sólido con scrollY > 50).
export const ALERTS_SCROLL_THRESHOLD = 50;

// Cuántas alertas se pintan como máximo a la vez (las primeras según el orden
// del backend): más barras taparían demasiado la página, sobre todo en celular.
// Debe coincidir con MAX_ALERTS_ON_WEB del intranet (features/web-alerts).
export const MAX_VISIBLE_ALERTS = 3;

// Convierte una fecha ISO a ms; null si viene vacía o mal formada (en ese caso
// no se usa como límite).
function toTime(value: string | null): number | null {
    if (!value) return null;
    const time = Date.parse(value);
    return Number.isNaN(time) ? null : time;
}

// ¿La alerta está dentro de sus fechas a esta hora? Sin fechas = siempre.
export function isWithinDates(alert: SiteAlertDto, now: number): boolean {
    const startsAt = toTime(alert.starts_at);
    const endsAt = toTime(alert.ends_at);
    if (startsAt !== null && startsAt > now) return false; // todavía no empieza
    if (endsAt !== null && endsAt <= now) return false; // ya venció
    return true;
}

// Filtra por fechas (con la hora del navegador: la web cachea /site y una
// alerta vencida puede seguir viniendo en el payload) y quita las que el
// cliente cerró. Mantiene el orden en que llegaron del backend.
export function getVisibleAlerts(
    alerts: SiteAlertDto[],
    now: number,
    dismissedKeys: string[]
): SiteAlertDto[] {
    return alerts.filter(
        (alert) => isWithinDates(alert, now) && !dismissedKeys.includes(getDismissKey(alert))
    );
}

// Como máximo MAX_VISIBLE_ALERTS, en orden. Se aplica DESPUÉS de quitar las
// vencidas y las cerradas: si el cliente cierra una, entra la siguiente.
export function limitAlerts(alerts: SiteAlertDto[]): SiteAlertDto[] {
    return alerts.slice(0, MAX_VISIBLE_ALERTS);
}

// Al bajar por la página (scrollY > 50) solo quedan las alertas "sticky".
export function filterAlertsByScroll(alerts: SiteAlertDto[], scrollY: number): SiteAlertDto[] {
    if (scrollY <= ALERTS_SCROLL_THRESHOLD) return alerts;
    return alerts.filter((alert) => alert.scroll_behavior === "sticky");
}
