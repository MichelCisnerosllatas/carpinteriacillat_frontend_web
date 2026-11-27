// shared/services/site_service/lib/findSiteNavigation.ts
//
// Otro serializador sobre el JSON que ya trajo getSite(): busca UNA
// navegacion puntual (con sus secciones) por su navigation_url, para que
// una pagina (Home, Services, Gallery, We) pueda pedir "dame solo lo que
// corresponde a esta ruta" sin volver a llamar al backend. Se usara desde
// la proxima fase (app/page.tsx, app/services/page.tsx, etc).

import type { SiteNavigationDto } from "../model/siteget.dto";

export function findSiteNavigationByUrl(navigations: SiteNavigationDto[], url: string): SiteNavigationDto | undefined { 
  return navigations.find(
    (navigation) => navigation.navigation_url === url && navigation.navigation_state
  );
}
