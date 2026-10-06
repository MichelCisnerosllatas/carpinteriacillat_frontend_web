"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";

export type BackgroundCarouselSlide = {
    src: string;
    alt: string;
    // Clase Tailwind ya resuelta (ver resolveImageFit.ts). Si no viene,
    // cada consumidor decide su propio default.
    fit?: string;
};

type Props = {
    slides: BackgroundCarouselSlide[];
    intervalMs?: number;
};

// Carrusel de imagenes de fondo GENERICO — reusado por CUALQUIER hero
// principal del sitio (Home y los headers de Servicios/Galeria/Nosotros).
// El admin del intranet puede subir 1 sola imagen o varias para cualquiera
// de estos headers, sin que el frontend necesite saber cual caso es:
//
//   - 1 imagen  -> se muestra fija, SIN puntos de navegacion ni autoplay
//                  (no tiene sentido un selector cuando no hay entre que
//                  elegir).
//   - 2+ imagenes -> autoplay + puntos clickeables, igual que el hero de
//                  Home ya tenia.
//
// No incluye overlay (degradado) propio a proposito: cada seccion que lo
// usa (Section1, HeroHeader) tiene su propio estilo de overlay — se pinta
// como un div hermano por encima de este carrusel, una sola vez (no por
// slide: como solo el slide activo es visible, un overlay compartido se
// ve identico y es mas liviano).
export default function BackgroundCarousel({ slides, intervalMs = 5000 }: Props) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const hasMultipleSlides = slides.length > 1;

    useEffect(() => {
        // Con 0 o 1 imagen no hay nada que rotar — evita un setInterval
        // que solo se llamaria a si mismo con el mismo indice.
        if (!hasMultipleSlides) return;

        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, intervalMs);

        return () => clearInterval(interval);
    }, [hasMultipleSlides, slides.length, intervalMs]);

    if (slides.length === 0) {
        return null;
    }

    return (
        <>
            <div className="absolute inset-0 z-0">
                {slides.map((slide, index) => (
                    <div
                        key={slide.src}
                        className={clsx("slide absolute inset-0", index === currentSlide && "slide-active")}
                    >
                        <img
                            src={slide.src}
                            alt={slide.alt}
                            className={`w-full h-full ${slide.fit ?? "object-cover"}`}
                        />
                    </div>
                ))}
            </div>

            {/* Puntos: SOLO si hay mas de 1 slide. */}
            {hasMultipleSlides && (
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-10">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            type="button"
                            onClick={() => setCurrentSlide(index)}
                            className={clsx(
                                "slide-indicator w-3 h-3 rounded-full transition-all",
                                index === currentSlide ? "bg-white" : "bg-white/50"
                            )}
                            aria-label={`Ir al slide ${index + 1}`}
                        />
                    ))}
                </div>
            )}
        </>
    );
}
