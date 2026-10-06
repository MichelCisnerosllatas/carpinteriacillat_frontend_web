// shared/store/preview/preview.routes.ts
//
// Mismo espíritu que shared/store/navbar/navbar.routes.ts: este archivo responde una sola
// pregunta — "para esta navigation_url, ¿qué página real hay que montar en /preview?" — y no
// importa nada de postMessage ni de Zustand a propósito, para que agregar una página nueva
// (ej. el día que exista /promotions) sea un solo renglón, sin tener que entender el resto del
// sistema de preview.
//
// OJO: NO se agrega "/testimonials" acá — esa ruta es un formulario de envío estático (ver
// app/testimonials/page.tsx), no lee secciones de ningún navigation_url, así que no aplica.

import dynamic from "next/dynamic";

// dynamic() en vez de un import directo: /preview es la ÚNICA pantalla que necesita elegir
// entre estos componentes en tiempo de ejecución (todas las demás rutas ya saben cuál les toca
// de antemano, ver app/page.tsx / app/services/page.tsx / etc.) — así no se pagan los cuatro
// bundles de una sola vez si el admin solo está previsualizando una página.
const MainHome = dynamic(() => import("@/features/home/ui/MainHome"));
const MainServices = dynamic(() => import("@/features/service/ui/MainServices"));
const MainWe = dynamic(() => import("@/features/we/ui/MainWe"));
const MainGallery = dynamic(() => import("@/features/gallery/ui/MainGallery"));

export const PREVIEW_PAGES: Record<string, React.ComponentType> = {
  "/": MainHome,
  "/services": MainServices,
  "/we": MainWe,
  "/gallery": MainGallery,
};

export const PREVIEW_DEFAULT_URL = "/";
