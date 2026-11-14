// widget/heroheader/ui/HeroHeader.tsx
"use client";

import { motion } from "framer-motion";
import BackgroundCarousel, { type BackgroundCarouselSlide } from "@/shared/components/background_carousel/BackgroundCarousel";

type HeroHeaderProps = {
    // Opcionales a proposito: si section_title/section_description vienen
    // null/vacios, no se debe inventar texto — el <h1>/<p> correspondiente
    // simplemente no se pinta (ver mas abajo).
    title?: string | null;
    subtitle?: string | null;
    // 1 o varias imagenes de fondo — el admin del intranet puede subir
    // cualquiera de las dos para este header. Con 1 sola se ve fija (sin
    // puntos ni autoplay); con varias, es un carrusel (ver
    // BackgroundCarousel).
    images: BackgroundCarouselSlide[];
    sectionClassName?: string;
};

// Header de página reutilizable (imagen(es) de fondo + overlay + título +
// subtítulo animados). Usado por Servicios, Nosotros y Galería, que antes
// tenían cada uno una copia casi idéntica de este mismo componente.
export default function HeroHeader({
    title,
    subtitle,
    images,
    sectionClassName = "bg-black",
}: HeroHeaderProps) {
    return (
        <section
            className={`
                relative
                w-full
                h-[55vh] md:h-[70vh]
                flex items-end md:items-center
                justify-center
                pb-10 md:pb-0
                overflow-hidden
                ${sectionClassName}
            `}
        >
            {/* Imagen(es) de fondo */}
            <motion.div
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1 }}
                className="absolute inset-0"
            >
                <BackgroundCarousel slides={images} />
            </motion.div>

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/50 to-black/10" />

            {/* Texto — si ninguno de los dos viene, no se pinta el bloque
                entero (no queda un espacio vacio sobre la imagen). */}
            {(title || subtitle) && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="relative z-10 text-center px-6"
                >
                    {/* data-el: anclas del grupo "Encabezado" de la Apariencia (vista previa).
                        El "subtitle" de este header es section_description. */}
                    {title && (
                        <h1 data-el="header-title" className="text-white text-4xl md:text-6xl font-bold drop-shadow-xl">
                            {title}
                        </h1>
                    )}

                    {subtitle && (
                        <p data-el="header-description" className="text-gray-200 mt-4 text-lg md:text-xl max-w-xl mx-auto leading-relaxed">
                            {subtitle}
                        </p>
                    )}
                </motion.div>
            )}
        </section>
    );
}
