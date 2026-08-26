// shared/services/navigation_service/lib/navigation.fallback.ts
//
// Estos son los links que se muestran SOLO cuando la API de navegacion no
// responde (sin internet, backend caido, etc.) y ya se termino de
// intentar (ver "hasLoaded" en useNavigationStore.ts).
//
// IMPORTANTE: antes header y footer tenian cada uno su propia lista de
// fallback, y no coincidian (el footer usaba anclas tipo "#servicios" que
// solo funcionan si ya estas en la pagina de inicio). Ahora los dos leen
// de ESTE mismo archivo para que, si algun dia hay que agregar o cambiar
// un link, no haya que acordarse de tocarlo en 2 lugares distintos.

export type NavLink = {
    href: string;
    label: string;
};

// OJO: son rutas reales de la app (/services, /gallery, /we), no anclas.
// Una ancla como "#servicios" solo funciona si el usuario ya esta en la
// pagina que tiene ese id — si esta en otra pagina, el link no hace nada.
// Con una ruta real, Next.js primero navega a esa pagina y desde ahi si
// funcionaria un ancla si hiciera falta.
export const NAVIGATION_FALLBACK_LINKS: NavLink[] = [
    { href: "/", label: "Inicio" },
    { href: "/services", label: "Servicios" },
    { href: "/gallery", label: "Galería" },
    { href: "/we", label: "Nosotros" },
];
