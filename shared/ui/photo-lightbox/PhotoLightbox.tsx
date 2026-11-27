// shared/ui/photo-lightbox/PhotoLightbox.tsx
//
// Visor de fotos a pantalla completa (yet-another-react-lightbox) con zoom, tira de
// miniaturas y título de cada foto. Lo abren los botones "expandir" del rediseño
// (ExpandPhotoButton) en Servicios, Galería y Detalle.
//
// Importante: el lightbox se dibuja en un "portal", pero los eventos de React igual suben por
// el árbol de componentes. Por eso conviene ponerlo FUERA de contenedores que escuchan
// pointer/click (carrusel con swipe, comparador antes/después…), no adentro.
"use client";

import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Captions from "yet-another-react-lightbox/plugins/captions";
// El CSS base ("styles.css") ya se importa en app/layout.tsx.
import "yet-another-react-lightbox/plugins/thumbnails.css";
import "yet-another-react-lightbox/plugins/captions.css";

export type LightboxSlide = {
    src: string;
    alt: string;
    title?: string; // se muestra arriba (ej. "Antes" / "Después")
};

type Props = {
    slides: LightboxSlide[];
    index: number;
    open: boolean;
    onClose: () => void;
};

const PLUGINS = [Zoom, Thumbnails, Captions];

export default function PhotoLightbox({ slides, index, open, onClose }: Props) {
    if (slides.length === 0) return null;

    // Por si el índice quedó fuera de rango (ej. se borró una foto en la vista previa).
    const safeIndex = Math.min(Math.max(index, 0), slides.length - 1);

    return (
        <Lightbox
            open={open}
            close={onClose}
            index={safeIndex}
            slides={slides}
            plugins={PLUGINS}
            // Con una sola foto no hace falta la tira de miniaturas.
            thumbnails={{ hidden: slides.length < 2, borderRadius: 10, imageFit: "cover" }}
        />
    );
}
