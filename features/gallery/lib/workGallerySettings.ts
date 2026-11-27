// features/gallery/lib/workGallerySettings.ts
//
// "Apariencia" de la sección Galería (section_type "work_gallery"): qué muestra el listado
// (/gallery: buscador, filtros, tarjetas, mensaje sin resultados) y el detalle de cada trabajo
// (/gallery/<id>: visor, ficha, contacto, antes/después, comentarios, otros trabajos).
// Catálogo de claves en el backend: config/section_display/work_gallery.php. Los defaults de
// abajo son los mismos del catálogo (se usan si la sección o la clave no vienen).
//
// Cada pantalla arma su objeto UNA vez por render (getWorkGalleryListingSettings /
// getWorkGalleryDetailSettings) y lo pasa hacia abajo: los componentes no leen claves sueltas.
// Funciones puras (sin React).

import {
    getDisplayBool,
    getDisplayList,
    getDisplayNumber,
    getDisplayOption,
    getDisplayText,
    type DisplayListItem,
    type DisplaySettingsSource,
} from "@/shared/services/site_service/lib/displaySettings";

export const WORK_GALLERY_TYPE = "work_gallery";

// ─── Listado (/gallery) ──────────────────────────────────────────────────────

// Grupo "search": buscador y filtros arriba de la grilla.
export type GallerySearchSettings = {
    show: boolean;
    placeholder: string;
    showCategoryTiles: boolean;
    allLabel: string; // texto del botón «Todos»
    showFilterType: boolean;
    filterTypeLabel: string;
    showFilterWood: boolean;
    filterWoodLabel: string;
    showFilterStyle: boolean;
    filterStyleLabel: string;
    showResultsSummary: boolean; // «N de M trabajos»
};

// Grupo "card": cada tarjeta de la grilla.
export type WorkCardSettings = {
    showThumbs: boolean;
    thumbsMax: number; // 1 a 6
    autorotateMobile: boolean; // en celular la tarjeta centrada rota sus fotos sola
    showTypeBadge: boolean; // etiqueta «Restauración»
    showCategory: boolean;
    showPhotoCount: boolean; // «Portada · N fotos»
    showExpand: boolean;
    showStyle: boolean;
    showMeta: boolean; // madera y lugar
    showRating: boolean;
    showPrice: boolean;
    pricePrefix: string; // «Aprox.»
    showLink: boolean;
    linkLabel: string; // «Ver aquí»
};

// Grupo "pagination": cuántos trabajos se ven a la vez y el botón «Ver más».
export type GalleryPaginationSettings = {
    pageSize: number; // trabajos al inicio y en cada clic (4–48)
    buttonLabel: string; // «Ver más trabajos»
    showCounter: boolean; // «Mostrando X de Y trabajos»
};

// Grupo "empty": mensaje cuando no hay resultados.
export type GalleryEmptySettings = {
    title: string;
    text: string; // puede venir vacío (allow_empty)
    buttonLabel: string;
};

export type WorkGalleryListingSettings = {
    search: GallerySearchSettings;
    card: WorkCardSettings;
    pagination: GalleryPaginationSettings;
    empty: GalleryEmptySettings;
};

export function getWorkGalleryListingSettings(section: DisplaySettingsSource): WorkGalleryListingSettings {
    const bool = (key: string, fallback = true) => getDisplayBool(section, key, fallback);
    const text = (key: string, fallback: string) => getDisplayText(section, key, fallback);

    return {
        search: {
            show: bool("search.show"),
            placeholder: text("search.placeholder", "Busque por mueble, estilo o lugar: ropero, rústico, Punchana…"),
            showCategoryTiles: bool("search.show_category_tiles"),
            allLabel: text("search.all_label", "Todos"),
            showFilterType: bool("search.show_filter_type"),
            filterTypeLabel: text("search.filter_type_label", "Tipo"),
            showFilterWood: bool("search.show_filter_wood"),
            filterWoodLabel: text("search.filter_wood_label", "Madera"),
            showFilterStyle: bool("search.show_filter_style"),
            filterStyleLabel: text("search.filter_style_label", "Estilo"),
            showResultsSummary: bool("search.show_results_summary"),
        },
        card: {
            showThumbs: bool("card.show_thumbs"),
            thumbsMax: getDisplayNumber(section, "card.thumbs_max", 3, 1, 6),
            autorotateMobile: bool("card.autorotate_mobile"),
            showTypeBadge: bool("card.show_type_badge"),
            showCategory: bool("card.show_category"),
            showPhotoCount: bool("card.show_photo_count"),
            showExpand: bool("card.show_expand"),
            showStyle: bool("card.show_style"),
            showMeta: bool("card.show_meta"),
            showRating: bool("card.show_rating"),
            showPrice: bool("card.show_price"),
            pricePrefix: text("card.price_prefix", "Aprox."),
            showLink: bool("card.show_link"),
            linkLabel: text("card.link_label", "Ver aquí"),
        },
        pagination: {
            pageSize: getDisplayNumber(section, "pagination.page_size", 12, 4, 48),
            buttonLabel: text("pagination.button_label", "Ver más trabajos"),
            showCounter: bool("pagination.show_counter"),
        },
        empty: {
            title: text("empty.title", "No hay trabajos con esa combinación."),
            text: text("empty.text", "Quite algún filtro o vuelva a ver todos los trabajos."),
            buttonLabel: text("empty.button_label", "Ver todos los trabajos"),
        },
    };
}

// ─── Detalle (/gallery/<id>) ─────────────────────────────────────────────────

export const VIEWER_VIEWS = ["fan", "book"] as const;
export type ViewerView = (typeof VIEWER_VIEWS)[number];

export const CONTACT_TARGETS = ["whatsapp", "link"] as const;
export type ContactTarget = (typeof CONTACT_TARGETS)[number];

// Filas de la ficha técnica (info.specs), en el orden por defecto. La key dice de qué campo del
// trabajo sale el valor (ver WorkInfo.tsx); el admin puede renombrar, ordenar y ocultar filas.
export const DEFAULT_SPEC_ROWS: readonly DisplayListItem[] = [
    { key: "wood", label: "Madera", visible: true },
    { key: "measures", label: "Medidas", visible: true },
    { key: "finish", label: "Acabado", visible: true },
    { key: "build_time", label: "Tiempo de trabajo", visible: true },
    { key: "location", label: "Lugar", visible: true },
    { key: "category", label: "Categoría", visible: true },
];

// Grupo "viewer": visor de fotos.
export type DetailViewerSettings = {
    defaultView: ViewerView;
    showBook: boolean; // si es false solo queda «Abanico» (sin pestañas)
    bookCoverText: string;
    bookBackText: string; // puede venir vacío
    showExpand: boolean;
    showStrip: boolean;
    stripTitle: string; // puede venir vacío
};

// Grupo "info": columna de datos.
export type DetailInfoSettings = {
    showBack: boolean;
    backLabel: string;
    showBreadcrumb: boolean;
    showMeta: boolean; // estilo y fecha de entrega
    showDescription: boolean;
    showSpecs: boolean;
    specs: DisplayListItem[];
    showPrice: boolean;
    priceLabel: string;
    priceNote: string; // puede venir vacío
    showNext: boolean;
    nextLabel: string;
    showMoreCategory: boolean;
    moreCategoryLabel: string; // «Más de» (+ nombre de la categoría)
};

// Grupo "contact": botón «Cotizar uno similar».
export type DetailContactSettings = {
    show: boolean;
    label: string;
    target: ContactTarget;
    whatsappMessage: string; // {titulo} se reemplaza por el título del trabajo
    url: string;
};

// Grupo "pairs": comparador Antes/Después (restauraciones).
export type DetailPairsSettings = {
    show: boolean;
    eyebrow: string; // puede venir vacío
    title: string;
    showLabels: boolean;
    showHint: boolean;
    autoSweep: boolean;
    showExpand: boolean;
    showPairNav: boolean;
};

// Grupo "reviews": comentarios.
export type DetailReviewsSettings = {
    show: boolean;
    eyebrow: string; // puede venir vacío
    title: string;
    initialVisible: number; // 1 a 20
    showForm: boolean;
    emptyText: string;
    thanksText: string;
};

// Grupo "related": otros trabajos.
export type DetailRelatedSettings = {
    show: boolean;
    title: string;
    max: number; // 1 a 12
};

export type WorkGalleryDetailSettings = {
    viewer: DetailViewerSettings;
    info: DetailInfoSettings;
    contact: DetailContactSettings;
    pairs: DetailPairsSettings;
    reviews: DetailReviewsSettings;
    related: DetailRelatedSettings;
};

export function getWorkGalleryDetailSettings(section: DisplaySettingsSource): WorkGalleryDetailSettings {
    const bool = (key: string, fallback = true) => getDisplayBool(section, key, fallback);
    const text = (key: string, fallback: string) => getDisplayText(section, key, fallback);

    return {
        viewer: {
            defaultView: getDisplayOption(section, "viewer.default_view", VIEWER_VIEWS, "fan"),
            showBook: bool("viewer.show_book"),
            bookCoverText: text("viewer.book_cover_text", "DISEÑO DEL TALLER"),
            bookBackText: text("viewer.book_back_text", "Diseñado y fabricado en nuestro taller."),
            showExpand: bool("viewer.show_expand"),
            showStrip: bool("viewer.show_strip"),
            stripTitle: text("viewer.strip_title", "PORTADA Y FOTOS DEL TRABAJO"),
        },
        info: {
            showBack: bool("info.show_back"),
            backLabel: text("info.back_label", "Volver a la galería"),
            showBreadcrumb: bool("info.show_breadcrumb"),
            showMeta: bool("info.show_meta"),
            showDescription: bool("info.show_description"),
            showSpecs: bool("info.show_specs"),
            specs: getDisplayList(section, "info.specs", DEFAULT_SPEC_ROWS),
            showPrice: bool("info.show_price"),
            priceLabel: text("info.price_label", "Precio aproximado"),
            priceNote: text("info.price_note", "varía según medidas y madera"),
            showNext: bool("info.show_next"),
            nextLabel: text("info.next_label", "Siguiente trabajo"),
            showMoreCategory: bool("info.show_more_category"),
            moreCategoryLabel: text("info.more_category_label", "Más de"),
        },
        contact: {
            // Único toggle del catálogo que viene apagado por defecto.
            show: bool("contact.show", false),
            label: text("contact.label", "Cotizar uno similar"),
            target: getDisplayOption(section, "contact.target", CONTACT_TARGETS, "whatsapp"),
            whatsappMessage: text("contact.whatsapp_message", "Hola, me interesa un trabajo como «{titulo}»."),
            url: text("contact.url", ""),
        },
        pairs: {
            show: bool("pairs.show"),
            eyebrow: text("pairs.eyebrow", "Restauración"),
            title: text("pairs.title", "Antes y después"),
            showLabels: bool("pairs.show_labels"),
            showHint: bool("pairs.show_hint"),
            autoSweep: bool("pairs.auto_sweep"),
            showExpand: bool("pairs.show_expand"),
            showPairNav: bool("pairs.show_pair_nav"),
        },
        reviews: {
            show: bool("reviews.show"),
            eyebrow: text("reviews.eyebrow", "Comentarios de clientes"),
            title: text("reviews.title", "Lo que dicen de este trabajo"),
            initialVisible: getDisplayNumber(section, "reviews.initial_visible", 4, 1, 20),
            showForm: bool("reviews.show_form"),
            emptyText: text("reviews.empty_text", "Aún no hay comentarios de este trabajo. ¡Cuéntanos qué te pareció!"),
            thanksText: text("reviews.thanks_text", "¡Gracias! Tu comentario se publicará cuando lo aprobemos."),
        },
        related: {
            show: bool("related.show"),
            title: text("related.title", "Otros trabajos que le pueden gustar"),
            max: getDisplayNumber(section, "related.max", 8, 1, 12),
        },
    };
}

// Todo con los valores del catálogo: lo que usan los componentes si nadie les pasa la configuración.
export const DEFAULT_LISTING_SETTINGS: WorkGalleryListingSettings = getWorkGalleryListingSettings(undefined);
export const DEFAULT_DETAIL_SETTINGS: WorkGalleryDetailSettings = getWorkGalleryDetailSettings(undefined);
