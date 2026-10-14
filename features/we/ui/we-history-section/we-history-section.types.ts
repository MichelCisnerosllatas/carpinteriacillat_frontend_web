export type HistoryStory = {
    title: string;
    desc: string;
    img: string;
    // Clase Tailwind ya resuelta (ver resolveImageFit.ts). Opcional porque
    // el mock local de fallback no trae "fix" del backend.
    fit?: string;
    // Navegacion opcional de la imagen (image.link/image.link_label).
    link?: string;
    linkLabel?: string;
};
