// features/gallery/lib/findGallerySection.ts
//
// app/gallery/[id]/page.tsx no pasa por SectionRenderer (no pinta TODAS
// las secciones de "/gallery", necesita UNA sola: la de tipo
// "gallery_grid", para poder buscar el item por id dentro de ella). Este
// helper hace esa busqueda sobre el mismo JSON que ya trajo getSite().

import { findSiteNavigationByUrl } from "@/shared/services/site_service/lib/findSiteNavigation";
import type { SiteDataDto, SiteSectionDto } from "@/shared/services/site_service/model/siteget.dto";

export function findGallerySection(site: SiteDataDto): SiteSectionDto | undefined {
    const navigation = findSiteNavigationByUrl(site.navigations, "/gallery");
    return navigation?.sections.find((section) => section.section_type === "gallery_grid" && section.section_state);
}
