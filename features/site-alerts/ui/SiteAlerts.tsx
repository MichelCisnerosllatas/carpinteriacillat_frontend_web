// features/site-alerts/ui/SiteAlerts.tsx
//
// Todas las barras de aviso, arriba del navbar (lo usa widget/header/Header.tsx).
// Lee `site.alerts` del useSiteStore (lo que trajo GET /v1/public/site) y
// pinta las visibles en el orden del backend. Sin alertas visibles → no pinta
// nada (ni barra ni espacio).
//
// Cómo se evita el hydration mismatch: en el servidor (y en el primer render
// del navegador) se muestran TODAS las alertas que vinieron del backend. Recién
// después de montar, `load()` lee la hora del navegador y las cerradas de
// sessionStorage, y ahí se quitan las vencidas/no empezadas y las cerradas.
"use client";

import { useEffect, useState } from "react";
import { useSiteStore } from "@/shared/store/site/useSiteStore";
import { useSiteAlertsStore } from "../store/useSiteAlertsStore";
import { filterAlertsByScroll, getVisibleAlerts, limitAlerts } from "../lib/visibleAlerts";

// Eventos que indican que el CLIENTE movió la página (rueda, dedo, teclado). El
// scroll que hace el navegador solo al recargar (vuelve a la posición en que
// estaba) no dispara ninguno de estos.
const USER_SCROLL_EVENTS = ["wheel", "touchmove", "keydown", "pointerdown"] as const;
import SiteAlert from "./SiteAlert";

type SiteAlertsProps = {
    // window.scrollY que ya mide el Header. Con scrollY > 50 solo quedan las
    // alertas "sticky" (las "hide" se ocultan al bajar).
    scrollY: number;
};

export default function SiteAlerts({ scrollY }: SiteAlertsProps) {
    const alerts = useSiteStore((s) => s.site?.alerts);
    const loaded = useSiteAlertsStore((s) => s.loaded);
    const now = useSiteAlertsStore((s) => s.now);
    const dismissedKeys = useSiteAlertsStore((s) => s.dismissedKeys);
    const load = useSiteAlertsStore((s) => s.load);
    const dismiss = useSiteAlertsStore((s) => s.dismiss);

    // ¿El cliente ya movió la página? Hasta entonces las alertas "Se oculta" se
    // muestran aunque la página haya cargado a mitad (al recargar, el navegador
    // devuelve a la posición en que se estaba y antes las ocultaba de entrada).
    const [userHasScrolled, setUserHasScrolled] = useState(false);

    // Solo en el navegador: lee sessionStorage y la hora actual.
    useEffect(() => {
        load();
    }, [load]);

    // Escucha la primera interacción del cliente y deja de escuchar.
    useEffect(() => {
        if (userHasScrolled) return;
        const markScrolled = () => setUserHasScrolled(true);
        USER_SCROLL_EVENTS.forEach((type) => window.addEventListener(type, markScrolled, { passive: true }));
        return () => USER_SCROLL_EVENTS.forEach((type) => window.removeEventListener(type, markScrolled));
    }, [userHasScrolled]);

    // Un backend viejo puede no mandar `alerts`.
    const allAlerts = Array.isArray(alerts) ? alerts : [];

    const visibleAlerts =
        loaded && now !== null ? getVisibleAlerts(allAlerts, now, dismissedKeys) : allAlerts;

    // Máximo 3, y "Se oculta" recién cuando el cliente movió la página.
    const shownAlerts = filterAlertsByScroll(limitAlerts(visibleAlerts), userHasScrolled ? scrollY : 0);

    if (shownAlerts.length === 0) return null;

    return (
        <div id="site-alerts">
            {shownAlerts.map((alert) => (
                <SiteAlert
                    key={alert.id_web_alert}
                    alert={alert}
                    onDismiss={() => dismiss(alert)}
                />
            ))}
        </div>
    );
}
