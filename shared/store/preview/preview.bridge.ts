// shared/store/preview/preview.bridge.ts
//
// El puente entre el iframe (esta pestaña, /preview) y la pestaña padre (el intranet). Es lo
// único en todo el sitio que escucha postMessage — en cualquier otra ruta esto ni se monta.
//
// Flujo: al montar, avisa "ready" al padre. El intranet, apenas lo recibe (o apenas cambia algo
// en el formulario que se esté editando, lo que pase después), manda un PreviewPayload. Este
// hook lo resuelve contra el árbol ya cargado (preview.resolve.ts), lo aplica a useSiteStore, y
// devuelve la navigation_url que corresponde mostrar — /preview/page.tsx usa eso para elegir
// qué página (preview.routes.ts) montar.

"use client";

import { useEffect, useRef, useState } from "react";
import { useSiteStore } from "@/shared/store/site/useSiteStore";
import { resolvePreviewPayload } from "./preview.resolve";
import { PREVIEW_DEFAULT_URL, PREVIEW_PAGES } from "./preview.routes";
import type { PreviewInboundMessage, PreviewOutboundMessage } from "./preview.types";

// NEXT_PUBLIC_INTRANET_URL ya existe (ver .env) para el link inverso (el sitio web ya apunta al
// intranet en otro lado) — se reusa acá para el origin exacto del postMessage, en vez de sumar
// una variable de entorno nueva solo para esto. En local, .env.local debe apuntar esto a
// "http://localhost:3000" (o el puerto real del intranet) para poder probar el preview.
function getIntranetOrigin(): string | null {
  const raw = process.env.NEXT_PUBLIC_INTRANET_URL;
  if (!raw) return null;
  try {
    return new URL(raw).origin;
  } catch {
    return null;
  }
}

const SCROLL_RETRY_INTERVAL_MS = 100;
const SCROLL_RETRY_MAX_ATTEMPTS = 20; // ~2s de margen para que monte una página que recién se está importando

function scrollToIdWithRetry(domId: string, attempt = 0): void {
  const el = document.getElementById(domId);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }
  if (attempt >= SCROLL_RETRY_MAX_ATTEMPTS) return;
  setTimeout(() => scrollToIdWithRetry(domId, attempt + 1), SCROLL_RETRY_INTERVAL_MS);
}

// Prioriza el ancla del elemento puntual que se está editando (botón/imagen/item/testimonio,
// ver preview.resolve.ts y shared/lib/previewAnchor.ts) — no todos los componentes de sección
// todavía le ponen `id` a cada hijo que pintan, así que si ese ancla nunca aparece en el DOM
// tras agotar los reintentos, cae a la sección completa como último recurso (mejor "cerca" que
// "nada").
function scrollToPreviewTarget(childId: string | undefined, sectionId: number, attempt = 0): void {
  const targetId = childId ?? `section-${sectionId}`;
  const el = document.getElementById(targetId);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }
  if (attempt >= SCROLL_RETRY_MAX_ATTEMPTS) {
    if (childId) scrollToIdWithRetry(`section-${sectionId}`);
    return;
  }
  setTimeout(() => scrollToPreviewTarget(childId, sectionId, attempt + 1), SCROLL_RETRY_INTERVAL_MS);
}

export function usePreviewBridge() {
  const [activeNavigationUrl, setActiveNavigationUrl] = useState(PREVIEW_DEFAULT_URL);
  // El listener de abajo se registra UNA sola vez (deps []) para no perder mensajes entre
  // desuscribir/resuscribir — por eso necesita este ref en vez de leer "activeNavigationUrl"
  // directo (esa lectura quedaría pegada al valor del primer render, closure obsoleta).
  const activeNavigationUrlRef = useRef(activeNavigationUrl);
  useEffect(() => {
    activeNavigationUrlRef.current = activeNavigationUrl;
  });
  // Evita mandar el "ready" más de una vez si el efecto se re-ejecuta (Strict Mode en dev monta
  // los efectos dos veces) — el intranet solo necesita un ack para arrancar.
  const readySent = useRef(false);
  // Distinto de "activeNavigationUrl === PREVIEW_DEFAULT_URL": el intranet necesita el aviso la
  // PRIMERA vez sin importar a qué página apunte — incluso si esa página resulta ser la misma
  // que el valor por defecto (bug real: cuando la sección editada pertenecía a "/", el chequeo
  // de "solo avisar si cambió" nunca disparaba porque "/" ya coincidía con el estado inicial, y
  // el intranet jamás se enteraba de nada, dejando "Ver original" deshabilitado para siempre).
  const hasAnnouncedRef = useRef(false);

  useEffect(() => {
    const intranetOrigin = getIntranetOrigin();
    if (!intranetOrigin) {
      console.warn("[preview] NEXT_PUBLIC_INTRANET_URL no está configurado o no es una URL válida — el preview no puede validar el origen de postMessage.");
      return;
    }

    // Avisa al intranet cuál es la página real detrás de lo que se está mostrando — lo usa
    // para el botón "Ver original" (abre esa URL real en una pestaña nueva) y el label de
    // "qué se está editando". Solo lo manda si de verdad cambió, para no spamear.
    function updateActiveUrl(next: string) {
      if (hasAnnouncedRef.current && next === activeNavigationUrlRef.current) return;
      hasAnnouncedRef.current = true;
      setActiveNavigationUrl(next);
      const msg: PreviewOutboundMessage = { source: "cillat-web-preview", type: "active-url", navigationUrl: next };
      window.parent.postMessage(msg, intranetOrigin as string);
    }

    function handleMessage(event: MessageEvent<PreviewInboundMessage>) {
      if (event.origin !== intranetOrigin) return;
      const message = event.data;
      if (message.source !== "cillat-intranet-preview") return;

      if (message.type === "focus") {
        const { navigationUrl, anchorId } = message.focus;
        // Solo páginas que /preview sabe montar — cualquier otra se ignora y se queda en la actual.
        if (navigationUrl && PREVIEW_PAGES[navigationUrl]) updateActiveUrl(navigationUrl);
        if (anchorId) scrollToIdWithRetry(anchorId);
        else window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      if (message.type !== "preview") return;

      const site = useSiteStore.getState().site;
      if (!site) return;

      const resolution = resolvePreviewPayload(site, message.payload);
      if (!resolution) return;

      if (resolution.kind === "navigations") {
        useSiteStore.getState().overrideNavigations(resolution.navigations);
        const target = resolution.navigations.find((n) => n.id_navigation === message.payload.id)?.navigation_url;
        if (target) updateActiveUrl(target);
        // Una navegación no tiene sección puntual a la que bajar — se muestra su página desde arriba.
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      if (resolution.kind === "footer") {
        // El footer es chrome compartido por TODAS las páginas (no tiene una "página propia" —
        // no toca activeNavigationUrl, se queda con la que ya estaba mostrando). Vive al final
        // del documento, siempre — el retry alcanza igual porque recién aparece cuando el layout
        // de esta página termina de montar (ver widget/footer/Footer.tsx, id="site-footer").
        useSiteStore.getState().overrideFooterSettings(resolution.footerSettings);
        scrollToIdWithRetry("site-footer");
        return;
      }

      useSiteStore.getState().overrideNavigationSections(resolution.idNavigation, resolution.sections);
      const target = site.navigations.find((n) => n.id_navigation === resolution.idNavigation)?.navigation_url;
      if (target) updateActiveUrl(target);

      // Reintenta un rato en vez de un solo requestAnimationFrame: si esto implica cambiar de
      // página (ej. estaba en Home y ahora hay que mostrar una sección de Servicios), el
      // componente de esa página se importa con next/dynamic (ver preview.routes.ts) — no
      // está garantizado que su primer render (y menos aún el del elemento puntual) ya esté
      // en el DOM en el frame siguiente. Sin este reintento, buscar una sola vez podía fallar
      // en silencio y dejar la vista tal cual estaba antes.
      scrollToPreviewTarget(resolution.scrollToChildId, resolution.scrollToSectionId);
    }

    window.addEventListener("message", handleMessage);

    if (!readySent.current) {
      const ack: PreviewOutboundMessage = { source: "cillat-web-preview", type: "ready" };
      window.parent.postMessage(ack, intranetOrigin);
      readySent.current = true;
    }

    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return { activeNavigationUrl };
}
