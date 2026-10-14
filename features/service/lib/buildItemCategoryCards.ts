// features/service/lib/buildItemCategoryCards.ts
//
// Modo ADMINISTRABLE del carrusel "Muebles a medida": una tarjeta por cada item de la
// sección de tipo "category" (o con key "category-<id>"), en el orden del intranet.
//
// Por cada item:
//   - Nombre  = item.title.
//   - id de la categoría = número del key ("category-12" → 12).
//   - Trabajos = works con esa categoría (por id; si el key no trae id, por nombre sin
//     tildes ni mayúsculas).
//   - Fotos   = imágenes de la sección con id_section_item = el item (fotos propias).
//               Si no tiene ninguna → fotos automáticas de sus trabajos, del más reciente
//               al más antiguo, máximo 4.
//   - Se oculta la tarjeta si no tiene trabajos ni fotos.
//
// Tolera registros a medio crear de la vista previa (ids -1, title/key/url en null).

import type {
    SiteSectionImageDto,
    SiteSectionItemDto,
    SiteWorkDto,
} from "@/shared/services/site_service/model/siteget.dto";
import { previewAnchorId } from "@/shared/lib/previewAnchor";
import type { Photo } from "@/shared/lib/photo";
import {
    CATEGORY_ITEM_TYPE,
    CATEGORY_KEY_PREFIX,
    normalizeCategoryName,
    parseCategoryId,
    pickWorkPhotos,
    sortWorksByRecent,
    type CategoryCard,
} from "./categoryCard";

// ¿Este item es una tarjeta de categoría?
export function isCategoryItem(item: SiteSectionItemDto): boolean {
    return item.item_type === CATEGORY_ITEM_TYPE || Boolean(item.key?.startsWith(CATEGORY_KEY_PREFIX));
}

// Trabajos que pertenecen a la categoría del item.
function findWorksOfItem(item: SiteSectionItemDto, works: SiteWorkDto[]): SiteWorkDto[] {
    const idCategory = parseCategoryId(item.key);
    if (idCategory != null) {
        return works.filter((work) => work.category?.id_category === idCategory);
    }

    // Sin id en el key: se compara por nombre.
    const name = normalizeCategoryName(item.title);
    if (!name) return [];
    return works.filter((work) => normalizeCategoryName(work.category?.name) === name);
}

// Fotos propias del item (las imágenes ya vienen visibles y ordenadas, ver más abajo).
function findOwnPhotos(item: SiteSectionItemDto, images: SiteSectionImageDto[], name: string): Photo[] {
    return images
        .filter((image) => image.id_section_item === item.id_section_item)
        .map((image) => ({
            // En la vista previa una imagen nueva puede venir sin URL: se deja igual para que
            // exista su ancla (CoverImage no pinta nada si no hay URL).
            url: image.url ?? "",
            alt: image.alt || image.title || name,
            caption: image.title,
            anchorId: previewAnchorId("section-image", image.id_section_image),
        }));
}

// items e images deben llegar ya normalizados (solo visibles y ordenados por `order`).
export function buildItemCategoryCards(
    items: SiteSectionItemDto[],
    images: SiteSectionImageDto[],
    works: SiteWorkDto[]
): CategoryCard[] {
    const cards: CategoryCard[] = [];

    for (const item of items) {
        if (!isCategoryItem(item)) continue;

        const itemWorks = findWorksOfItem(item, works);
        // Si el item no tiene título (vista previa), se usa el nombre de la categoría del trabajo.
        const name = item.title || itemWorks[0]?.category?.name || "Categoría";

        const ownPhotos = findOwnPhotos(item, images, name);
        const photos = ownPhotos.length > 0 ? ownPhotos : pickWorkPhotos(sortWorksByRecent(itemWorks));

        // Sin trabajos y sin fotos no hay nada que mostrar.
        if (itemWorks.length === 0 && photos.length === 0) continue;

        cards.push({
            key: `item-${item.id_section_item}`,
            name,
            count: itemWorks.length,
            photos,
            anchorId: previewAnchorId("section-item", item.id_section_item),
        });
    }

    return cards;
}
