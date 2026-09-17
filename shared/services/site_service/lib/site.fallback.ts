// shared/services/site_service/lib/site.fallback.ts
//
// Estos son los links que se muestran SOLO cuando /v1/public/site no
// respondio (sin internet, backend caido, etc.) y ya se termino de
// intentar. Antes vivian en navigation_service/lib/navigation.fallback.ts;
// se movieron aca junto con el resto de la migracion a site_service.
//
// IMPORTANTE: Header y Footer leen de ESTE mismo archivo (antes no
// coincidian: el footer usaba anclas tipo "#servicios" que solo funcionan
// si ya estas en la pagina de inicio). Si algun dia hay que agregar o
// cambiar un link de respaldo, se toca en un solo lugar.

export type NavLink = {
  href: string;
  label: string;
};

// Son rutas reales de la app (/services, /gallery, /we), no anclas. Una
// ancla como "#servicios" solo funciona si el usuario ya esta en la pagina
// que tiene ese id. Con una ruta real, Next.js primero navega y desde ahi
// si funcionaria un ancla si hiciera falta.
export const NAVIGATION_FALLBACK_LINKS: NavLink[] = [
  { href: "/", label: "Inicio" },
  { href: "/services", label: "Servicios" },
  { href: "/gallery", label: "Galería" },
  { href: "/we", label: "Nosotros" },
];
