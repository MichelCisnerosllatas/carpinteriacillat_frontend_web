// widget/main/section3/Section3.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Lightbox from "yet-another-react-lightbox";

export type GalleryItem = {
    id: string;
    title: string;
    category: string;
    imageUrl: string;
};

export type Section3Props = {
    title?: string;
    subtitle?: string;
    items?: GalleryItem[]; // aquí luego enchufas lo que venga del backend
};

const defaultItems: GalleryItem[] = [
    {
        id: "1",
        title: "Cocina Integral en Melamine",
        category: "Cocinas",
        imageUrl:
            "https://demo.carpinteriacillat.com/storage/imgsistema/imgmuestra/fotocillat1.jpg",
    },
    {
        id: "2",
        title: "Closet Empotrado Minimalista",
        category: "Dormitorios",
        imageUrl:
            "https://demo.carpinteriacillat.com/storage/imgsistema/imgmuestra/fotocillat4.jpg",
    },
    {
        id: "3",
        title: "Oficina Ejecutiva Moderna",
        category: "Oficinas",
        imageUrl:
            "https://demo.carpinteriacillat.com/storage/imgsistema/imgmuestra/fotocillat2.jpg",
    },
    {
        id: "4",
        title: "Centro de Entretenimiento",
        category: "Sala",
        imageUrl:
            "https://demo.carpinteriacillat.com/storage/imgsistema/imgmuestra/fotocillat3.jpg",
    },
    {
        id: "5",
        title: "Mueble de Lavatorio",
        category: "Baños",
        imageUrl:
            "https://demo.carpinteriacillat.com/storage/imgsistema/imgmuestra/fotocillat5.jpg",
    },
    {
        id: "6",
        title: "Mostrador Comercial",
        category: "Comercial",
        imageUrl:
            "https://demo.carpinteriacillat.com/storage/imgsistema/imgmuestra/fotocillat6.jpg",
    },
];

export default function Section3({
                                     title,
                                     subtitle,
                                     items,
                                 }: Section3Props) {
    const data = items && items.length > 0 ? items : defaultItems;

    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);

    const openLightbox = (index: number) => {
        setLightboxIndex(index);
        setLightboxOpen(true);
    };

    return (
        <section id="galeria" className="relative py-16 bg-gray-100">
            <div className="container mx-auto px-4">
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
                        <motion.button
                            key={item.id}
                            type="button"
                            onClick={() => openLightbox(index)}
                            className="gallery-item rounded-2xl overflow-hidden shadow-lg bg-gray-900 text-left"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.4, delay: index * 0.05 }}
                        >
                            <img
                                src={item.imageUrl}
                                alt={item.title}
                                className="w-full h-64 object-cover"
                            />

                            <div className="gallery-overlay">
                                <div className="text-center px-4">
                                    <span className="inline-block text-xs font-semibold tracking-widest uppercase bg-gray-900/80 text-amber-300 px-3 py-1 rounded-full mb-2">
                                        {item.category}
                                    </span>
                                    <h3 className="text-xl font-bold text-white mb-2">
                                        {item.title}
                                    </h3>
                                    <span className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-gray-900 bg-white px-4 py-2 rounded-full">
                    <i className="fas fa-search" />
                    Ver en grande
                  </span>
                                </div>
                            </div>
                        </motion.button>
                    ))}
                </div>
            </div>

            {/* Lightbox */}
            <Lightbox
                open={lightboxOpen}
                close={() => setLightboxOpen(false)}
                index={lightboxIndex}
                slides={data.map((item) => ({ src: item.imageUrl }))}
                // puedes agregar más opciones si quieres
            />
        </section>
    );
}
