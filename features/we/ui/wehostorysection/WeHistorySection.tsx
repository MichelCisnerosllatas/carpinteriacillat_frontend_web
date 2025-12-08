"use client";

import {useRef, useState} from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import Lightbox from "yet-another-react-lightbox";

import "swiper/css";
import "swiper/css/effect-fade";
import Image from "next/image";

const stories = [
    {
        title: "Inicio del Proyecto",
        desc: "Todo empezó con una idea y mucha pasión.",
        img: "/img/sistema/carpinteriacillat2.jpg",
    },
    {
        title: "Primer Cliente Feliz",
        desc: "Nuestro primer trabajo marcó la diferencia.",
        img: "/img/sistema/carpinteriacillat1.png",
    },
    {
        title: "Crecimiento",
        desc: "Expansión en servicios y calidad.",
        img: "/img/sistema/carpinteriacillat3.png",
    },
];

export default function WeHistorySection() {
    const swiperRef = useRef<any>(null);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);

    const handleOpenLightbox = (index: number) => {
        setLightboxIndex(index);
        setLightboxOpen(true);
    };

    return (
        <section className="w-full py-20 bg-gray-50">
            <div className="max-w-6xl mx-auto px-4">
                <h2 className="text-center text-4xl md:text-5xl font-extrabold mb-4">
                  <span className="bg-gradient-to-r from-red-600 via-red-500 to-yellow-400 bg-clip-text text-transparent">
                    Nuestra Historia
                  </span>
                </h2>
                <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
                    Un recorrido de esfuerzo, dedicación y proyectos que han marcado
                    nuestra trayectoria.
                </p>

                {/* Contenedor del carrusel (hero) */}
                <div className="relative w-full overflow-hidden rounded-3xl shadow-2xl bg-black/80">
                    <Swiper
                        modules={[Autoplay, EffectFade]}
                        effect="fade"
                        fadeEffect={{ crossFade: true }}
                        loop
                        autoplay={{ delay: 3000, disableOnInteraction: false }}
                        onSwiper={(swiper) => {
                            swiperRef.current = swiper;
                        }}
                        className="w-full h-[360px] md:h-[520px]"
                    >
                        {stories.map((s, index) => (
                            <SwiperSlide key={index}>
                                <div className="relative w-full h-full"
                                    onClick={() => handleOpenLightbox(index)}
                                >
                                    {/* Imagen de fondo */}
                                    <Image
                                        src={s.img}
                                        alt={s.title}
                                        width={200}
                                        height={200}
                                        className="absolute inset-0 w-full h-full object-cover opacity-80"
                                    />

                                    {/* Degradado para lectura */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/70" />

                                    {/* Contenido */}
                                    <div className="relative z-10 h-full flex items-center">
                                        <div className="px-6 md:px-12 max-w-xl">
                                              <span className="inline-flex items-center px-3 py-1 mb-4 rounded-full text-xs font-semibold bg-yellow-400 text-red-900">
                                                Etapa {index + 1}
                                              </span>
                                            <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                                                {s.title}
                                            </h3>
                                            <p className="text-gray-100 text-sm md:text-base leading-relaxed">
                                                {s.desc}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {/* Borde suave con colores del logo */}
                    <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-red-500/40" />

                    {/* Botones de navegación personalizados */}
                    <div className="absolute inset-x-0 bottom-5 flex justify-center gap-4 z-20">
                        <button
                            type="button"
                            onClick={() => swiperRef.current?.slidePrev()}
                            className="pointer-events-auto flex items-center justify-center w-10 h-10 rounded-full bg-white/90 hover:bg-red-600 hover:text-white shadow-md transition cursor-pointer"
                        >
                            ‹
                        </button>
                        <button
                            type="button"
                            onClick={() => swiperRef.current?.slideNext()}
                            className="pointer-events-auto flex items-center justify-center w-10 h-10 rounded-full bg-white/90 hover:bg-red-600 hover:text-white shadow-md transition cursor-pointer"
                        >
                            ›
                        </button>
                    </div>
                </div>
            </div>

            <Lightbox
                open={lightboxOpen}
                close={() => setLightboxOpen(false)}
                index={lightboxIndex}
                slides={stories.map((g) => ({ src: g.img }))}
            />
        </section>
    );
}
