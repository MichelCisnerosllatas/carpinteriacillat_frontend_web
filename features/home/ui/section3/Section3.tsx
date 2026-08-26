// home/ui/section3/Section3.tsx
"use client";

import { motion } from "framer-motion";
import Lightbox from "yet-another-react-lightbox";
import Container from "@/shared/ui/container/Container";
import { useLightboxState } from "@/shared/lib/useLightboxState";
import type { Section3Props } from "@/widget/galleryhome/model/types";
import { defaultGalleryPreviewItems } from "@/widget/galleryhome/model/mock";
import GalleryPreviewCard from "@/widget/galleryhome/ui/GalleryPreviewCard";

export default function Section3({
    title,
    subtitle,
    items,
}: Section3Props) {
    const data = items && items.length > 0 ? items : defaultGalleryPreviewItems;
    const lightbox = useLightboxState();

    return (
        <section id="galeria" className="relative py-16 bg-gray-100">
            <Container>
                {/* Títulos animados */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.4 }}
                    className="text-center mb-10"
                >
                    <p className="text-sm uppercase tracking-[0.2em] text-red-600  font-semibold">
                        {subtitle ?? "Trabajos Realizados"}
                    </p>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-black mt-2">
                        {title ?? "Proyectos que hablan por nosotros"}
                    </h2>
                    <p className="text-gray-400 mt-3 max-w-2xl mx-auto text-sm md:text-base">
                        Cada proyecto es diseñado a medida según el espacio, estilo y
                        necesidades de nuestros clientes.
                    </p>
                </motion.div>

                {/* Grid de galería */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {data.map((item, index) => (
                        <GalleryPreviewCard
                            key={item.id}
                            item={item}
                            index={index}
                            onOpen={lightbox.open}
                        />
                    ))}
                </div>
            </Container>

            {/* Lightbox */}
            <Lightbox
                open={lightbox.isOpen}
                close={lightbox.close}
                index={lightbox.index}
                slides={data.map((item) => ({ src: item.imageUrl }))}
            />
        </section>
    );
}
