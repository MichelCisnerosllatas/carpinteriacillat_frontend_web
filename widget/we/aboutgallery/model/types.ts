export type AboutGalleryItem = {
    src: string;
    title: string;
    // Clase Tailwind ya resuelta (ver resolveImageFit.ts). Opcional porque
    // el mock local de fallback no trae "fix" del backend.
    fit?: string;
    // Texto contextual de la imagen (image.description) — opcional porque
    // el mock local de fallback no lo trae.
    description?: string;
    // Navegacion opcional de la imagen (image.link/image.link_label).
    link?: string;
    linkLabel?: string;
};
