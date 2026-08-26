// shared/store/navbar/navbar.routes.ts
//
// Este archivo responde una sola pregunta: "para esta ruta, ¿qué titulo de
// pestaña y qué paleta de color (de navbar.styles.ts) le toca?".
// Quien LEE este mapa y lo aplica es useNavbarStore.ts (funcion
// resolveConfig). Este archivo no importa React ni Zustand a proposito:
// es solo datos, facil de leer y de agregar una ruta nueva sin tener que
// entender el resto del sistema.

import type { NavbarStyleKey } from "./navbar.styles";

export type NavbarRouteConfig = {
    title: string;          // <title> de la pestaña del navegador
    style: NavbarStyleKey;  // "base" | "detalle" | "inner" (ver navbar.styles.ts)
};

// Clave = pathname exacto (lo que devuelve usePathname() de Next).
// Si tu ruta no esta aca, se busca por PREFIJO (ver resolveConfig en
// useNavbarStore.ts) y si tampoco matchea nada, se usa el estilo "inner"
// por defecto.
export const NAVBAR_ROUTES: Record<string, NavbarRouteConfig> = {
    "/": {
        title: "CILLAT | Inicio",
        style: "base",
    },
    "/services": {
        title: "CILLAT | Servicios",
        style: "base",
    },
    "/gallery": {
        title: "CILLAT | Galería",
        style: "base",
    },
    // Detalle de una foto especifica (ej. /gallery/123). Esta entrada casi
    // nunca matchea "exacto" (nadie visita literalmente la URL
    // "/gallery/"), existe para que resolveConfig la encuentre por
    // coincidencia de prefijo y le de el estilo "detalle" (fondo claro) en
    // vez del "base" (fondo oscuro) que usa /gallery.
    "/gallery/": {
        title: "CILLAT | Galería",
        style: "detalle",
    },
    "/we": {
        title: "CILLAT | Nosotros",
        style: "base",
    },
};
