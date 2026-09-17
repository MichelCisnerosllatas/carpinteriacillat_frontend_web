// shared/services/site_service/lib/normalizeNavigations.ts
//
// Esta funcion NO hace ninguna peticion nueva: es un serializador/selector
// que trabaja sobre el JSON que ya devolvio getSite(). Su unico trabajo es
// separar "site.navigations" en la forma que necesitan Header/Footer.
//
// El backend de /v1/public/site YA filtra por navigation_state y YA ordena
// por navigation_order (ver BACKEND_API_PUBLIC_SITE_V4.md / site.md). Esto
// es solo una comprobacion DEFENSIVA por si un dia una respuesta viene
// inconsistente — no sustituye el filtrado del backend, y el frontend
// nunca debe inventar un orden editorial distinto al recibido.
//
// Se usa en un solo lugar hoy (app/layout.tsx), pero se separa en su
// propia funcion para no repetir esta misma logica si mas adelante otro
// Server Component tambien necesita la lista de navegaciones.

import type { SiteNavigationDto } from "../model/siteget.dto";

export function normalizeNavigations(navigations: SiteNavigationDto[]): SiteNavigationDto[] {
  return [...navigations]
    .filter((item) => item.navigation_state)
    .sort((a, b) => a.navigation_order - b.navigation_order);
}
