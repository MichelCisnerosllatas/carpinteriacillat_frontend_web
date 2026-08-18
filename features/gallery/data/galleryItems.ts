// features/gallery/data/galleryItems.ts
// Data local de la Galería (sin API todavía). Compartida entre el grid
// (GalleryPhoto), sus tabs de filtro y la página de detalle (/gallery/[id]).
//
// GALLERY_CATEGORIES es la única fuente de verdad para las categorías:
// para agregar una categoría nueva (ej. "cocinas") solo hay que sumarle
// una entrada aquí y sus items en galleryItems — el tab de filtro y el
// breadcrumb del detalle aparecen solos, sin tocar ningún componente.
//
// Nota: hoy solo hay fotos reales de la carpintería para 3 categorías
// (puertas/ventanas, comedor, estanterías). Faltan fotos reales de
// cocinas, closets, oficina, baños y proyectos comerciales — cuando la
// carpintería las tenga, se agregan acá y listo.

export type GalleryItem = {
    id: number;
    category: string;
    title: string;
    url: string;
    description: string;
    rating: number;
    reviews: number;
};

export const GALLERY_CATEGORIES: Record<string, string> = {
    puertas: "Puertas y Ventanas",
    comedor: "Comedor",
    estanterias: "Estanterías",
};

export const galleryItems: GalleryItem[] = [
    {
        id: 1,
        category: "puertas",
        title: "Ventana corrediza a medida",
        url: "/img/sistema/carpinteriacillat1.png",
        description: "Ventana de madera fabricada e instalada a medida, con acabado natural.",
        rating: 4.8,
        reviews: 23,
    },
    {
        id: 2,
        category: "comedor",
        title: "Aparador de comedor con vitrina",
        url: "/img/sistema/carpinteriacillat3.png",
        description: "Aparador y vitrina en madera, con espacio de almacenaje y exhibición.",
        rating: 4.9,
        reviews: 18,
    },
    {
        id: 3,
        category: "estanterias",
        title: "Estantería modular",
        url: "/img/sistema/carpinteriacillat2.jpg",
        description: "Estantería de madera a medida, ideal para sala o depósito.",
        rating: 4.7,
        reviews: 12,
    },
    {
        id: 4,
        category: "estanterias",
        title: "Estantería en proceso de fabricación",
        url: "/img/sistema/carpinteriacillat4.jpg",
        description: "Así se ve el armado artesanal de nuestras estanterías antes del acabado final.",
        rating: 4.8,
        reviews: 9,
    },
];
