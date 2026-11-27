// Un hito de la Historia = una imagen de la sección "history_carousel".
export type HistoryStory = {
    id: number; // id_section_image (key estable y ancla de la vista previa)
    title: string;
    desc: string;
    img: string;
    // Texto del cartelito: image.label («Año o etapa», ej. "2010") o, si viene vacío,
    // "<prefijo> N" (ej. "Etapa 2"). Lo arma WeHistorySection.
    step: string;
    // Clase Tailwind ya resuelta (ver resolveImageFit.ts).
    fit: string;
    // Navegacion opcional de la imagen (image.link/image.link_label).
    link?: string;
    linkLabel?: string;
};
