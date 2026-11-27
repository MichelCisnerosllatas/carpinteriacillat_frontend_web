// shared/store/preview/preview.routes.ts
//
// Mismo espíritu que shared/store/navbar/navbar.routes.ts: este archivo responde una sola
// pregunta — "para esta navigation_url, ¿qué página real hay que montar en /preview?" — y no
// importa nada de postMessage ni de Zustand a propósito, para que agregar una página nueva
// (ej. el día que exista /promotions) sea un solo renglón, sin tener que entender el resto del
// sistema de preview.
//
// Además de las páginas de PREVIEW_PAGES, /preview sabe montar el DETALLE de un trabajo
// ("/gallery/<id_web_work>", lo pide el intranet desde la pestaña "Apariencia" de la Galería):
// ver resolvePreviewUrl() / parseWorkDetailUrl() y PreviewWorkDetail.
//
// OJO: NO se agrega "/testimonials" acá — esa ruta es un formulario de envío estático (ver
// app/testimonials/page.tsx), no lee secciones de ningún navigation_url, así que no aplica.

import dynamic from "next/dynamic";
import type { SiteWorkDto } from "@/shared/services/site_service/model/siteget.dto";

// dynamic() en vez de un import directo: /preview es la ÚNICA pantalla que necesita elegir
// entre estos componentes en tiempo de ejecución (todas las demás rutas ya saben cuál les toca
// de antemano, ver app/page.tsx / app/services/page.tsx / etc.) — así no se pagan los cuatro
// bundles de una sola vez si el admin solo está previsualizando una página.
const MainHome = dynamic(() => import("@/features/home/ui/main-home/MainHome"));
const MainServices = dynamic(() => import("@/features/service/ui/main-services/MainServices"));
const MainWe = dynamic(() => import("@/features/we/ui/main-we/MainWe"));
const MainGallery = dynamic(() => import("@/features/gallery/ui/main-gallery/MainGallery"));

export const PREVIEW_PAGES: Record<string, React.ComponentType> = {
  "/": MainHome,
  "/services": MainServices,
  "/we": MainWe,
  "/gallery": MainGallery,
};

export const PREVIEW_DEFAULT_URL = "/";

// Detalle de un trabajo dentro del preview (lee el trabajo y la Apariencia del store).
export const PreviewWorkDetail = dynamic(() => import("@/features/gallery/ui/work-detail/WorkDetailPreview"));

const GALLERY_URL = "/gallery";
const WORK_DETAIL_PATTERN = /^\/gallery\/(\d+)\/?$/;

// "/gallery/12" → 12. Cualquier otra URL → null.
export function parseWorkDetailUrl(url: string): number | null {
  const match = WORK_DETAIL_PATTERN.exec(url);
  if (!match) return null;
  const id = Number(match[1]);
  return Number.isInteger(id) && id > 0 ? id : null;
}

// URL que /preview va a montar de verdad para lo que pidió el intranet, o null si no sabe
// montarla (se queda en la actual):
//   - una página de PREVIEW_PAGES → tal cual;
//   - "/gallery/<id>" → ese trabajo si existe en works; si no, el primero; sin trabajos, "/gallery".
//   `works` = null cuando el sitio todavía no cargó: se deja el id tal cual (el detalle del
//   preview vuelve a corregirlo al pintarse).
export function resolvePreviewUrl(url: string, works: SiteWorkDto[] | null): string | null {
  if (PREVIEW_PAGES[url]) return url;

  const id = parseWorkDetailUrl(url);
  if (id === null) return null;
  if (works === null) return `${GALLERY_URL}/${id}`;
  if (works.some((work) => work.id_web_work === id)) return `${GALLERY_URL}/${id}`;
  return works.length > 0 ? `${GALLERY_URL}/${works[0].id_web_work}` : GALLERY_URL;
}

// ¿La página montada (`url`) pertenece a la navegación `navigationUrl`? Sí si es la misma o una
// sub-página suya (ej. "/gallery/12" pertenece a "/gallery"). "/" no tiene sub-páginas aquí.
export function urlBelongsToNavigation(url: string, navigationUrl: string): boolean {
  if (url === navigationUrl) return true;
  return navigationUrl !== "/" && url.startsWith(`${navigationUrl}/`);
}
