// shared/lib/photo.ts
//
// Forma mínima de "una foto" que entienden los componentes visuales compartidos
// (CoverImage, PhotoLayers, PhotoFan). Cada sección convierte SUS datos (imágenes de sección,
// fotos de un trabajo) a esta forma — así esos componentes no dependen del JSON del backend.

export type Photo = {
    url: string;
    alt: string;
    // Pie de foto corto ("isla de desayuno"), si existe.
    caption?: string | null;
    // id para que la vista previa del intranet pueda hacer scroll a esta foto
    // (ver shared/lib/previewAnchor.ts). Solo lo llevan las imágenes de sección.
    anchorId?: string;
};

// Un par "Antes / Después" (comparador de restauraciones, ver shared/ui/before-after).
export type PhotoPair = {
    // Clave única del par (para el `key` de React).
    key: string;
    // Pie del par ("Frente", "Detalle del tirador"), si existe.
    caption: string | null;
    before: Photo;
    after: Photo;
};
