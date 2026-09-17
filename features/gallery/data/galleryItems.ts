// features/gallery/data/galleryItems.ts
//
// Antes esta era la unica fuente de datos de la Galeria (array fijo +
// GALLERY_CATEGORIES como mapa de slug -> nombre visible). Ahora la fuente
// real es section.images de la seccion "gallery_grid" (ver
// features/gallery/lib/getGalleryItems.ts) — "category" ya viene como
// texto legible directo en image.label, no hace falta un mapa aparte.
//
// Este archivo queda como:
//   1) el tipo GalleryItem que sigue usando toda la UI de galeria.
//   2) FALLBACK_GALLERY_ITEMS: datos de respaldo temporal mientras el
//      backend no tenga imagenes cargadas en esa seccion (ver
//      FRONTEND_NEXTJS_SITE_V3.md #41).
//
// NOTA: "rating"/"reviews" ya no existen — no hay ningun campo en
// SiteSectionImageDto que los represente, y no se debe inventar un dato
// que el backend no manda.

export type GalleryItem = {
    id: string;
    category: string;
    title: string;
    url: string;
    description: string;
    // Clase Tailwind ya resuelta (ver resolveImageFit.ts). Opcional porque
    // el fallback local no trae "fix" del backend.
    fit?: string;
    // Navegacion opcional de la imagen (image.link/image.link_label).
    link?: string;
    linkLabel?: string;
};

export const FALLBACK_GALLERY_ITEMS: GalleryItem[] = [
    {
        id: "1",
        category: "Puertas y Ventanas",
        title: "Ventana corrediza a medida",
        url: "/img/sistema/carpinteriacillat1.png",
        description: "Ventana de madera fabricada e instalada a medida, con acabado natural.",
    },
    {
        id: "2",
        category: "Comedor",
        title: "Aparador de comedor con vitrina",
        url: "/img/sistema/carpinteriacillat3.png",
        description: "Aparador y vitrina en madera, con espacio de almacenaje y exhibición.",
    },
    {
        id: "3",
        category: "Estanterías",
        title: "Estantería modular",
        url: "/img/sistema/carpinteriacillat2.jpg",
        description: "Estantería de madera a medida, ideal para sala o depósito.",
    },
    {
        id: "4",
        category: "Estanterías",
        title: "Estantería en proceso de fabricación",
        url: "/img/sistema/carpinteriacillat4.jpg",
        description: "Así se ve el armado artesanal de nuestras estanterías antes del acabado final.",
    },
];
