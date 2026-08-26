// shared/store/navbar/useNavbarStore.ts
//
// Guia rapida de esta carpeta (los 3 archivos trabajan juntos):
//   - navbar.styles.ts  -> el "que" (las paletas de color en si)
//   - navbar.routes.ts  -> el "cuando" (que paleta le toca a cada ruta)
//   - useNavbarStore.ts -> el "como" (este archivo: conecta los dos de
//                          arriba con la app usando Zustand)
//
// ¿Que es Zustand? Es una libreria de estado global chiquita: en vez de
// pasar props de componente en componente, cualquier componente puede
// "suscribirse" a este store con el hook useNavbarStore() y leer/escribir
// el mismo valor. Aca lo usamos para guardar "cual es el estilo activo del
// header en este momento" para que cualquier parte del header (Navbar.tsx,
// el menu mobile, etc.) lea el mismo color sin tener que recalcularlo cada
// una por su cuenta.
//
// El disparador que actualiza este estado es Header.tsx, que llama
// applyByPath(pathname) cada vez que cambia de pagina (ver el useEffect
// que escucha usePathname() en widget/header/Header.tsx).

import { create } from "zustand";
import { NAVBAR_ROUTES, type NavbarRouteConfig } from "./navbar.routes";
import { NAVBAR_STYLES, type NavbarFixedStyle, type NavbarStyleKey } from "./navbar.styles";

type NavbarState = {
    title: string;
    styleKey: NavbarStyleKey;
    style: NavbarFixedStyle;

    // Permite forzar un estilo distinto para una ruta puntual sin tocar
    // NAVBAR_ROUTES (por ahora no se usa en ningun lado de la app, queda
    // disponible por si en el futuro una pagina necesita un color especial
    // que no depende de su ruta).
    overrides: Record<string, NavbarRouteConfig>;

    applyByPath: (path: string) => void;
    setOverrideForRoute: (path: string, cfg: NavbarRouteConfig) => void;
    clearOverrideForRoute: (path: string) => void;
};

// Decide que configuracion (titulo + estilo) le toca a una ruta.
// Orden de prioridad:
//   1) Un override manual para ESA ruta exacta (setOverrideForRoute).
//   2) Una entrada exacta en NAVBAR_ROUTES (navbar.routes.ts).
//   3) La entrada de NAVBAR_ROUTES cuya key sea el PREFIJO mas largo que
//      matchea el path. Esto es lo que hace que "/gallery/123" (una foto
//      puntual, ruta dinamica) use el estilo de "/gallery/" sin tener que
//      listar cada id de foto a mano.
//   4) Si nada matchea: estilo "inner" por defecto (fondo blanco), para
//      que una pagina nueva que te olvidaste de agregar aca no se vea rota
//      (texto blanco invisible sobre fondo blanco, por ejemplo).
function resolveConfig(path: string, overrides: Record<string, NavbarRouteConfig>): NavbarRouteConfig {
    if (overrides[path]) return overrides[path];
    if (NAVBAR_ROUTES[path]) return NAVBAR_ROUTES[path];

    const prefix = Object.keys(NAVBAR_ROUTES)
        .filter((k) => k !== "/" && path.startsWith(k))
        // Si hay varios prefijos que matchean, nos quedamos con el mas
        // especifico (el mas largo). Ej: si existieran "/gallery" y
        // "/gallery/especial" ambos matcheando, gana el segundo.
        .sort((a, b) => b.length - a.length)[0];

    if (prefix) return NAVBAR_ROUTES[prefix];

    return { title: "CILLAT", style: "inner" };
}

export const useNavbarStore = create<NavbarState>((set, get) => ({
    // Valores iniciales antes de que Header.tsx llame a applyByPath() por
    // primera vez (durante el primer render).
    title: "CILLAT",
    styleKey: "inner",
    style: NAVBAR_STYLES.inner,
    overrides: {},

    applyByPath: (path) => {
        const cfg = resolveConfig(path, get().overrides);
        set({
            title: cfg.title,
            styleKey: cfg.style,
            style: NAVBAR_STYLES[cfg.style],
        });
    },

    setOverrideForRoute: (path, cfg) => {
        set((s) => ({ overrides: { ...s.overrides, [path]: cfg } }));
        get().applyByPath(path); // re-aplica por si la ruta activa es esta
    },

    clearOverrideForRoute: (path) => {
        set((s) => {
            const copy = { ...s.overrides };
            delete copy[path];
            return { overrides: copy };
        });
        get().applyByPath(path);
    },
}));
