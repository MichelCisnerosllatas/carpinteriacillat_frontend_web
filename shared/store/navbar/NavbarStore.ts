import { create } from "zustand";
import { NAVBAR_ROUTES, type NavbarRouteConfig } from "./navbar.routes";
import { NAVBAR_STYLES, type NavbarFixedStyle, type NavbarStyleKey } from "./navbar.styles";

type NavbarState = {
    title: string;
    styleKey: NavbarStyleKey;
    style: NavbarFixedStyle;

    // opcional: override por ruta (si un día quieres forzar algo especial)
    overrides: Record<string, NavbarRouteConfig>;

    applyByPath: (path: string) => void;
    setOverrideForRoute: (path: string, cfg: NavbarRouteConfig) => void;
    clearOverrideForRoute: (path: string) => void;
};

function resolveConfig( path: string, overrides: Record<string, NavbarRouteConfig>): NavbarRouteConfig {
    if (overrides[path]) return overrides[path];
    if (NAVBAR_ROUTES[path]) return NAVBAR_ROUTES[path];

    // match por prefijo (sirve para rutas dinámicas)
    const prefix = Object.keys(NAVBAR_ROUTES)
        .filter((k) => k !== "/" && path.startsWith(k))
        .sort((a, b) => b.length - a.length)[0];

    if (prefix) return NAVBAR_ROUTES[prefix];

    return { title: "CILLAT", style: "inner" };
}

export const useNavbarStore = create<NavbarState>((set, get) => ({
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
        get().applyByPath(path);
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
