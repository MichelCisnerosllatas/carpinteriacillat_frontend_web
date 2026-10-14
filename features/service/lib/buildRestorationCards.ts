// features/service/lib/buildRestorationCards.ts
//
// Arma las tarjetas del comparador "Restauración de muebles" (sección restoration_compare).
// Mismo patrón que el carrusel "Muebles a medida" (buildItemCategoryCards.ts):
//
// - Las tarjetas son EXACTAMENTE los items visibles de tipo "restoration" (o con key
//   "furniture-<id>") de la sección, en su orden. Se administran en el intranet (pestaña
//   Trabajos de la sección, o con el check "Mostrar en «Restauración»" del formulario de Mueble).
// - Un trabajo NO tiene que ser un mueble. Título = item.title (nombre libre del trabajo).
// - Mueble relacionado (opcional) = número del key ("furniture-7" → 7). Su trabajo = works con ese id.
//   Sin key de mueble, o con key pero sin trabajo publicado en works: solo fotos propias y SIN botón
//   "Ver la restauración completa" (idFurniture = null, /gallery/<id> no existiría).
// - Foto ANTES   = 1ª imagen propia visible del item con variant "before"; si no tiene, la foto
//                  del trabajo marcada "before" (si hay trabajo). Igual para DESPUÉS ("after").
// - Si falta la foto de antes o la de después, la tarjeta no se muestra.
// - Sin items visibles → sin tarjetas (la sección muestra solo sus textos, igual que el 01).
//
// Función pura (sin React). Tolera registros a medio crear de la vista previa del intranet
// (ids -1, title/key/url en null).

import type {
    SiteSectionDto,
    SiteSectionImageDto,
    SiteSectionItemDto,
    SiteWorkDto,
} from "@/shared/services/site_service/model/siteget.dto";
import { normalizeImages, normalizeItems } from "@/shared/services/site_service/lib/normalizeSectionContent";
import { findWorkPhotoByVariant, getWorkTitle } from "@/shared/services/site_service/lib/workPhotos";
import { previewAnchorId } from "@/shared/lib/previewAnchor";
import type { Photo } from "@/shared/lib/photo";

export type RestorationCard = {
    // Clave única de la tarjeta (para el `key` de React).
    key: string;
    // id_furniture, para el botón "Ver la restauración completa". null si el trabajo no tiene
    // mueble relacionado o si ese mueble no está publicado (entonces no hay botón).
    idFurniture: number | null;
    title: string;
    before: Photo;
    after: Photo;
    // id "section-item-<id>" para que la vista previa del intranet haga scroll a la tarjeta.
    anchorId?: string;
};

type Variant = "before" | "after";

// Tipo y prefijo del key con el que el intranet guarda cada tarjeta (ver contrato).
export const RESTORATION_ITEM_TYPE = "restoration";
export const RESTORATION_KEY_PREFIX = "furniture-";

// Claves de "Elementos de las tarjetas" de esta sección (catálogo del backend:
// config/section_card_settings.php → 'restoration_compare'). Se leen con isCardElementVisible().
export const RESTORATION_CARD_SETTINGS = {
    thumbs: "show_thumbs", // miniaturas para elegir el trabajo
    labels: "show_labels", // etiquetas «Antes» / «Después»
    hint: "show_hint", // ayuda «Toque y arrastre para comparar»
    autoSweep: "auto_sweep", // barrido automático al aparecer
    expand: "show_expand", // botón «ver foto en grande»
    detailButton: "show_detail_button", // botón «Ver la restauración completa»
} as const;

// ¿Este item es una tarjeta de restauración?
export function isRestorationItem(item: SiteSectionItemDto): boolean {
    return item.item_type === RESTORATION_ITEM_TYPE || Boolean(item.key?.startsWith(RESTORATION_KEY_PREFIX));
}

// "furniture-7" → 7. Si el key no trae un número válido → null.
export function parseFurnitureId(key: string | null | undefined): number | null {
    if (!key || !key.startsWith(RESTORATION_KEY_PREFIX)) return null;
    const id = Number(key.slice(RESTORATION_KEY_PREFIX.length));
    return Number.isInteger(id) && id > 0 ? id : null;
}

// 1ª foto propia del item con esa variante (las imágenes ya vienen visibles y ordenadas).
function findOwnPhoto(item: SiteSectionItemDto, images: SiteSectionImageDto[], variant: Variant, title: string): Photo | undefined {
    const image = images.find((img) => img.id_section_item === item.id_section_item && img.variant === variant);
    if (!image) return undefined;

    return {
        // En la vista previa una imagen nueva puede venir sin URL: se deja igual para que exista
        // su ancla (CoverImage no pinta nada si no hay URL).
        url: image.url ?? "",
        alt: image.alt || image.title || title,
        caption: image.title,
        anchorId: previewAnchorId("section-image", image.id_section_image),
    };
}

// Foto propia si existe; si no, la del trabajo con esa variante.
function pickPhoto(
    item: SiteSectionItemDto,
    images: SiteSectionImageDto[],
    work: SiteWorkDto | undefined,
    variant: Variant,
    title: string
): Photo | undefined {
    const own = findOwnPhoto(item, images, variant, title);
    if (own) return own;
    return work ? findWorkPhotoByVariant(work, variant) : undefined;
}

export function buildRestorationCards(section: SiteSectionDto, works: SiteWorkDto[]): RestorationCard[] {
    // Solo visibles y ordenados por `order`.
    const items = normalizeItems(section.items ?? []).filter(isRestorationItem);
    if (items.length === 0) return [];

    const images = normalizeImages(section.images ?? []);
    const cards: RestorationCard[] = [];

    for (const item of items) {
        const idFurniture = parseFurnitureId(item.key);
        const work = idFurniture != null ? works.find((w) => w.id_furniture === idFurniture) : undefined;
        // Si el item no tiene título (vista previa), se usa el del trabajo.
        const title = item.title || (work ? getWorkTitle(work) : "Trabajo");

        const before = pickPhoto(item, images, work, "before", title);
        const after = pickPhoto(item, images, work, "after", title);

        // Sin foto de antes o de después no hay nada que comparar.
        if (!before || !after) continue;

        cards.push({
            key: `item-${item.id_section_item}`,
            // Solo si el mueble está publicado: si no, su página /gallery/<id> no existe y se oculta el botón.
            idFurniture: work ? idFurniture : null,
            title,
            before,
            after,
            anchorId: previewAnchorId("section-item", item.id_section_item),
        });
    }

    return cards;
}
