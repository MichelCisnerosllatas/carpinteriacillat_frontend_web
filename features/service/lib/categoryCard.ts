// features/service/lib/categoryCard.ts
//
// Tipo de una tarjeta del carrusel "Muebles a medida" (sección category_coverflow) y las
// funciones chicas que usa buildItemCategoryCards.ts (tarjetas = items de tipo "category"
// cargados en el intranet; si una tarjeta no tiene fotos propias, usa las de sus trabajos).
// Todo son funciones puras: reciben datos y devuelven datos, sin React.

import type { SiteWorkDto } from "@/shared/services/site_service/model/siteget.dto";
import { getWorkPhotos } from "@/shared/services/site_service/lib/workPhotos";
import type { Photo } from "@/shared/lib/photo";

export type CategoryCard = {
    // Clave única de la tarjeta (para el `key` de React y para recordar la foto elegida).
    key: string;
    name: string;
    count: number;
    photos: Photo[];
    // id "section-item-<id>" para que la vista previa del intranet haga scroll a la tarjeta.
    // Solo lo tienen las tarjetas que vienen de un item.
    anchorId?: string;
};

export const MAX_AUTO_PHOTOS = 4;

// Claves de "Elementos de las tarjetas" de esta sección (catálogo del backend:
// config/section_card_settings.php → 'category_coverflow'). Se leen con isCardElementVisible().
export const COVERFLOW_CARD_SETTINGS = {
    title: "show_card_title", // nombre de la categoría
    count: "show_card_count", // contador «N trabajos»
    thumbs: "show_card_thumbs", // abanico de miniaturas
    expand: "show_card_expand", // botón «ver foto en grande»
    link: "show_card_link", // flecha amarilla «ir a la galería»
    nav: "show_nav", // flechas y puntos del carrusel
} as const;

// Qué partes de UNA tarjeta se pintan (lo calcula CategoryCoverflow con card_settings).
export type CoverflowCardShow = {
    title: boolean;
    count: boolean;
    thumbs: boolean;
    expand: boolean;
    link: boolean;
};

// Tipo y prefijo del key con el que el intranet guarda cada tarjeta (ver contrato).
export const CATEGORY_ITEM_TYPE = "category";
export const CATEGORY_KEY_PREFIX = "category-";

// "category-12" → 12. Si el key no trae un número válido → null.
export function parseCategoryId(key: string | null | undefined): number | null {
    if (!key || !key.startsWith(CATEGORY_KEY_PREFIX)) return null;
    const id = Number(key.slice(CATEGORY_KEY_PREFIX.length));
    return Number.isInteger(id) && id > 0 ? id : null;
}

// "Cocinas Rústicas " → "cocinas rusticas" (sin tildes, sin mayúsculas, sin espacios al borde).
// Sirve para comparar nombres de categoría cuando el key no trae id.
export function normalizeCategoryName(name: string | null | undefined): string {
    return (name ?? "")
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .toLowerCase()
        .trim();
}

// Trabajos del más reciente al más antiguo según delivered_at ("2026-05-10").
// Los que no tienen fecha van al final. Si empatan, se respeta el orden que ya traían
// (sort de JavaScript es estable).
export function sortWorksByRecent(works: SiteWorkDto[]): SiteWorkDto[] {
    return [...works].sort((a, b) => {
        if (a.delivered_at === b.delivered_at) return 0;
        if (!a.delivered_at) return 1;
        if (!b.delivered_at) return -1;
        // Formato año-mes-día: comparar como texto ya ordena por fecha.
        return a.delivered_at < b.delivered_at ? 1 : -1;
    });
}

// Hasta 4 fotos de una lista de trabajos: primero la portada de cada trabajo y, si faltan,
// las demás fotos de esos mismos trabajos.
export function pickWorkPhotos(works: SiteWorkDto[]): Photo[] {
    const allPhotos = works.map(getWorkPhotos);
    const covers = allPhotos.map((photos) => photos[0]).filter(Boolean);
    const others = allPhotos.flatMap((photos) => photos.slice(1));
    return [...covers, ...others].slice(0, MAX_AUTO_PHOTOS);
}
