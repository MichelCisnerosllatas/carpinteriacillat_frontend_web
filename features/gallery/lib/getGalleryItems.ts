// features/gallery/lib/getGalleryItems.ts
//
// Convierte section.images (de la seccion section_type === "gallery_grid")
// en GalleryItem[]. Se centraliza aca porque tanto GalleryPhoto.tsx (el
// grid) como app/gallery/[id]/page.tsx (el detalle) necesitan EXACTAMENTE
// la misma lista — si cada uno la arma por su cuenta, un item podria
// "existir" en el grid pero no encontrarse en el detalle (o viceversa).

import { normalizeImages } from "@/shared/services/site_service/lib/normalizeSectionContent";
import { resolveImageFit } from "@/shared/services/site_service/lib/resolveImageFit";
import type { SiteSectionDto } from "@/shared/services/site_service/model/siteget.dto";
import { FALLBACK_GALLERY_ITEMS, type GalleryItem } from "../data/galleryItems";

export function getGalleryItems(section: SiteSectionDto | undefined | null): GalleryItem[] {
    if (!section) {
        return FALLBACK_GALLERY_ITEMS;
    }

    const apiItems: GalleryItem[] = normalizeImages(section.images).map((image) => ({
        id: String(image.id_section_image),
        category: image.label ?? "",
        title: image.title ?? image.alt ?? "",
        url: image.url,
        description: image.description ?? "",
        fit: resolveImageFit(image.fix),
        link: image.link ?? undefined,
        linkLabel: image.link_label ?? undefined,
    }));

    // Fallback temporal mientras el backend no tenga imagenes cargadas en
    // esta seccion (ver FRONTEND_NEXTJS_SITE_V3.md #41).
    return apiItems.length > 0 ? apiItems : FALLBACK_GALLERY_ITEMS;
}
