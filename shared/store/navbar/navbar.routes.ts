//shared/store/navbar/navbar.routes.ts
import type { NavbarStyleKey } from "./navbar.styles";

export type NavbarRouteConfig = {
    title: string;
    style: NavbarStyleKey; // "home" | "inner"
};

export const NAVBAR_ROUTES: Record<string, NavbarRouteConfig> = {
    "/": {
        title: "CILLAT | Inicio",
        style: "base"
    },
    "/services": {
        title: "CILLAT | Servicios",
        style: "base"
    },
    "/gallery": {
        title: "CILLAT | Galería",
        style: "base"
    },
    "/gallery/": {
        title: "CILLAT | Galería",
        style: "inner"
    },
    "/we": {
        title: "CILLAT | Nosotros",
        style: "base"
    },
};
