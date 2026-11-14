// shared/services/site_service/model/siteAlert.dto.ts
//
// Una alerta del sitio tal como llega en GET /v1/public/site → data.alerts
// (tabla web_alerts del backend, administrada desde la intranet en /web-alerts).
// El backend ya manda SOLO las que se están mostrando (encendidas y dentro de
// fechas con la hora del servidor) y en orden. Como la web cachea /site, el
// navegador igual vuelve a revisar las fechas (ver features/site-alerts/lib/visibleAlerts.ts).
// No hay websocket ni polling: las alertas llegan solo con la carga de /site.
// Vive en shared (y no en features/site-alerts) porque también lo usa el DTO del
// sitio (siteget.dto.ts), y shared no debe importar de features.

// Colores/icono de la barra (ver features/site-alerts/lib/alertStyles.ts).
export type SiteAlertStyle = "promo" | "info" | "warning" | "success";

// Alinea TODO el contenido de la barra.
export type SiteAlertAlign = "left" | "center" | "right";

// Qué se pinta al final de la barra: nada, una flecha o un botoncito con texto.
export type SiteAlertTrailing = "none" | "arrow" | "button";

// "hide" = se oculta al bajar por la página; "sticky" = se queda visible.
export type SiteAlertScrollBehavior = "hide" | "sticky";

export type SiteAlertDto = {
    id_web_alert: number;
    // Al menos uno de los dos viene con texto.
    title: string | null;
    subtitle: string | null;
    style: SiteAlertStyle;
    align: SiteAlertAlign;
    show_icon: boolean;
    trailing: SiteAlertTrailing;
    // Texto del botón; solo se usa si trailing = "button".
    trailing_label: string | null;
    // Si tiene valor TODA la barra es clicable. Empieza con "/", "http://",
    // "https://", "mailto:" o "tel:".
    link_url: string | null;
    // true = muestra la ✕ para que el cliente la cierre.
    dismissible: boolean;
    scroll_behavior: SiteAlertScrollBehavior;
    // ISO 8601 con zona ("2026-11-15T23:59:00-05:00") o null = sin límite.
    starts_at: string | null;
    ends_at: string | null;
    // Se usa para recordar las cerradas: si la alerta se edita vuelve a aparecer.
    updated_at: string | null;
};
