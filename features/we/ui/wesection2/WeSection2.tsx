"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import Lightbox from "yet-another-react-lightbox";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "yet-another-react-lightbox/styles.css";
import Image from "next/image";

const gallery = [
    {
        src: "/img/sistema/fotogrupalcillat.jpg",
        title: "Equipo CILLAT",
    },
    {
        src: "/img/sistema/carpinteriacillat4.jpg",
        title: "Proyecto en taller",
    },
    {
        src: "/img/sistema/carpinteriacillat3.png",
        title: "Instalación en cliente",
    },
];

export default function WeSection2() {
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);



    const handleOpenLightbox = (index: number) => {
        setLightboxIndex(index);
        setLightboxOpen(true);
    };

    return (
        // overflow-x-hidden para asegurarnos de que nada genere scroll horizontal
        <section className="relative py-16 bg-gray-100 overflow-x-hidden">
            <div className="max-w-7xl mx-auto px-4">
                {/* Contenido principal (carrusel + texto) */}
                <div className="flex flex-col md:flex-row gap-10 items-center">
                    {/* Columna CARRUSEL (primero en móvil, segundo en desktop) */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.4 }}
                        className="order-1 md:order-2 w-full flex justify-center md:justify-end"
                    >
                        <div className="relative w-full max-w-md md:max-w-lg rounded-3xl shadow-2xl bg-white overflow-hidden border border-gray-200">
                            <Swiper
                                modules={[Navigation, Pagination, Autoplay]}
                                navigation
                                pagination={{ clickable: true }}
                                loop
                                autoplay={{ delay: 2500, disableOnInteraction: false }}
                                slidesPerView={1}
                                className="w-full h-full"
                            >
                                {gallery.map((item, index) => (
                                    <SwiperSlide key={index}>
                                        <button
                                            type="button"
                                            onClick={() => handleOpenLightbox(index)}
                                            className="block w-full focus:outline-none"
                                        >
                                            <Image
                                                src={item.src}
                                                alt={item.title}
                                                width={800}
                                                height={600}
                                                className="w-full h-72 md:h-80 object-cover"
                                            />
                                        </button>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>
                    </motion.div>

                    {/* Columna TEXTO (segundo en móvil, primero en desktop) */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.4 }}
                        className="order-2 md:order-1 w-full"
                    >
                        <span className="inline-flex items-center text-xs font-semibold uppercase tracking-[0.2em] text-red-500">
                            Carpintería CILLAT
                        </span>

                        <h3 className="text-3xl md:text-4xl font-bold text-black leading-tight mt-2 mb-4">
                            Sobre{" "}
                            <span className="bg-gradient-to-r from-red-600 via-red-500 to-yellow-400 bg-clip-text text-transparent">
                                Nosotros
                            </span>
                        </h3>

                        <p className="text-gray-700 text-base leading-relaxed mb-3">
                            Con más de 15 años de experiencia, hemos transformado ideas en
                            realidad con diseño personalizado y
                            materiales premium.
                        </p>

                        <p className="text-gray-700 text-base leading-relaxed">
                            Cada pieza que creamos nace de la pasión por el detalle y el
                            compromiso de ofrecer un resultado que supere expectativas.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Lightbox */}
            <Lightbox
                open={lightboxOpen}
                close={() => setLightboxOpen(false)}
                index={lightboxIndex}
                slides={gallery.map((g) => ({ src: g.src }))}
            />
        </section>
    );
}
