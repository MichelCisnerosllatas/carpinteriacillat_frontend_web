'use client';
import {motion} from "framer-motion";
import Image from "next/image";

export default function GallerySection1(){
    return (
        <section
            className="
                relative
                w-full
                h-[55vh] md:h-[70vh]
                flex items-end md:items-center
                justify-center
                pb-10 md:pb-0
                overflow-hidden
                bg-black
            "
        >
            {/* Imagen de fondo */}
            <motion.div
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}      // 👈 en vez de whileInView
                transition={{ duration: 1 }}
                className="absolute inset-0"
            >
                <Image
                    src="/img/sistema/carpinteriacillat2.jpg"
                    alt="Header Galería"
                    fill
                    sizes="100vw"
                    priority
                    className="object-cover"
                />
            </motion.div>

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/50 to-black/10" />

            {/* Texto */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}          // 👈 en vez de whileInView
                transition={{ duration: 0.8 }}
                className="relative z-10 text-center px-6"
            >
                <h1 className="text-white text-4xl md:text-6xl font-bold drop-shadow-xl">
                    Galería
                </h1>

                <p className="text-gray-200 mt-4 text-lg md:text-xl max-w-xl mx-auto leading-relaxed">
                    Explora una muestra de nuestros proyectos: cada pieza
                    refleja el cuidado y la calidad de nuestro trabajo.
                </p>
            </motion.div>
        </section>
    );
}