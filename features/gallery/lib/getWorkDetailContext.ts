// features/gallery/lib/getWorkDetailContext.ts
//
// Todo lo que el detalle de un trabajo (WorkDetail) necesita del sitio, además del trabajo:
//   - works: la lista completa (para «Siguiente trabajo» y «Otros trabajos»);
//   - settings: la Apariencia de la sección Galería de /gallery (grupos del detalle);
//   - contactHref: enlace del botón «Cotizar uno similar» (null = no se pinta).
// Lo usan la página real (app/gallery/[id]/page.tsx, con el JSON de getSite()) y la vista previa
// (WorkDetailPreview, con el store), así las dos arman el detalle exactamente igual.
//
// Función pura (sin React).

import { findWorkGallerySection } from "./findWorkGallerySection";
import { getWorkGalleryDetailSettings, type WorkGalleryDetailSettings } from "./workGallerySettings";
import { getWorkContactHref } from "./getWorkContactHref";
import { findFloatingWhatsapp } from "@/shared/services/site_service/lib/findFloatingWhatsapp";
import { getWorkTitle } from "@/shared/services/site_service/lib/workPhotos";
import type { SiteDataDto, SiteWorkDto } from "@/shared/services/site_service/model/siteget.dto";

export type WorkDetailContext = {
    works: SiteWorkDto[];
    settings: WorkGalleryDetailSettings;
    contactHref: string | null;
};

export function getWorkDetailContext(site: SiteDataDto | null | undefined, work: SiteWorkDto): WorkDetailContext {
    const settings = getWorkGalleryDetailSettings(findWorkGallerySection(site));
    return {
        works: site?.works ?? [],
        settings,
        contactHref: getWorkContactHref(settings.contact, findFloatingWhatsapp(site ?? null), getWorkTitle(work)),
    };
}
