// shared/ui/photo-layers/PhotoLayers.tsx
//
// Todas las fotos apiladas una encima de otra; solo la activa se ve (opacidad 1) y al cambiar
// de foto se hace un fundido suave. Es la "capa" que el diseño repite en el hero de Servicios,
// el carrusel de categorías y las tarjetas de la Galería.
//
// El contenedor padre debe ser "relative" con tamaño propio. El zoom (scale) lo pone el padre
// envolviendo este componente, porque cada sección hace un zoom distinto.

import CoverImage from "@/shared/ui/cover-image/CoverImage";
import { PREVIEW_ANCHOR_STYLE } from "@/shared/lib/previewAnchor";
import type { Photo } from "@/shared/lib/photo";

type Props = {
    photos: Photo[];
    activeIndex: number;
    // Duración del fundido; el diseño usa 700ms en general y 450ms en las tarjetas de galería.
    fadeMs?: number;
};

export default function PhotoLayers({ photos, activeIndex, fadeMs = 700 }: Props) {
    return (
        <>
            {photos.map((photo, k) => (
                <div
                    key={`${photo.url}-${k}`}
                    // El id de vista previa va en la capa (y no en la <img>) porque una imagen
                    // recién creada en el intranet puede no tener URL todavía y no pintarse.
                    id={photo.anchorId}
                    className="pointer-events-none absolute inset-0"
                    style={{
                        ...PREVIEW_ANCHOR_STYLE,
                        opacity: k === activeIndex ? 1 : 0,
                        transition: `opacity ${fadeMs}ms`,
                    }}
                >
                    <CoverImage url={photo.url} alt={photo.alt} loading={k === 0 ? "eager" : "lazy"} />
                </div>
            ))}
        </>
    );
}
