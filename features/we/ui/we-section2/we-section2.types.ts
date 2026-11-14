// Una foto del carrusel de "Quiénes somos" (imagen de la sección "text_media").
export type AboutGalleryItem = {
    id: number; // id_section_image (key estable y ancla de la vista previa)
    src: string;
    title: string;
    // Clase Tailwind ya resuelta (ver resolveImageFit.ts).
    fit: string;
    // Texto contextual de la imagen (image.description).
    description?: string;
    // Navegacion opcional de la imagen (image.link/image.link_label).
    link?: string;
    linkLabel?: string;
};
