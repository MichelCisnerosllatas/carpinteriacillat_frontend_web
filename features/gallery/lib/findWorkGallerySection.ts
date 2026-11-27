// features/gallery/lib/findWorkGallerySection.ts
//
// El detalle de un trabajo (app/gallery/[id]/page.tsx y la vista previa) no pasa por
// SectionRenderer, pero necesita la Apariencia de la sección Galería (display_settings, grupos
// viewer/info/contact/pairs/reviews/related). Este helper busca, en el mismo JSON que ya trajo
// getSite() (o en el store de la vista previa), la sección de tipo "work_gallery" de la
// navegación "/gallery". Si no la encuentra devuelve undefined (y el detalle usa los defaults
// del catálogo).

import { findSiteNavigationByUrl } from "@/shared/services/site_service/lib/findSiteNavigation";
import { WORK_GALLERY_TYPE } from "./workGallerySettings";
import type { SiteDataDto, SiteSectionDto } from "@/shared/services/site_service/model/siteget.dto";

export function findWorkGallerySection(site: SiteDataDto | null | undefined): SiteSectionDto | undefined {
    if (!site) return undefined;
    const navigation = findSiteNavigationByUrl(site.navigations ?? [], "/gallery");
    return navigation?.sections.find((section) => section.section_type === WORK_GALLERY_TYPE && section.section_state);
}
