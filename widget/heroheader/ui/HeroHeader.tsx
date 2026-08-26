// widget/heroheader/ui/HeroHeader.tsx
"use client";

import { motion } from "framer-motion";
import Image from "next/image";

type HeroHeaderProps = {
    title: string;
    subtitle: string;
    imageSrc: string;
    imageAlt: string;
    imageClassName?: string;
    sectionClassName?: string;
};

// Header de página reutilizable (imagen de fondo + overlay + título +
// subtítulo animados). Usado por Servicios, Nosotros y Galería, que antes
// tenían cada uno una copia casi idéntica de este mismo componente.
export default function HeroHeader({
    title,
    subtitle,
    imageSrc,
    imageAlt,
    imageClassName = "object-cover",
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
            {/* Imagen de fondo */}
            <motion.div
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1 }}
                className="absolute inset-0"
            >
                <Image
                    src={imageSrc}
                    alt={imageAlt}
                    fill
                    sizes="100vw"
                    priority
                    className={imageClassName}
                />
            </motion.div>

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/50 to-black/10" />

            {/* Texto */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="relative z-10 text-center px-6"
            >
                <h1 className="text-white text-4xl md:text-6xl font-bold drop-shadow-xl">
                    {title}
                </h1>

                <p className="text-gray-200 mt-4 text-lg md:text-xl max-w-xl mx-auto leading-relaxed">
                    {subtitle}
                </p>
            </motion.div>
        </section>
    );
}
