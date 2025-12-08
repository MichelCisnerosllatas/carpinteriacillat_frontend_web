"use client";

import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectCoverflow } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-coverflow";

const testimonials = [
    {
        name: "Luis Castillo",
        text: "Excelente servicio, los muebles quedaron increíbles. Muy profesionales.",
        stars: 5,
        img: "/img/sistema/user1.jpg",
    },
    {
        name: "Mariana Díaz",
        text: "Quedé encantada con el acabado y el detalle. Totalmente recomendados.",
        stars: 4,
        img: "/img/sistema/user2.jpg",
    },
    {
        name: "Carlos Ruiz",
        text: "Rapidez, calidad y muy buen trato. Volveré a pedirles más trabajos.",
        stars: 5,
        img: "/img/sistema/user3.jpg",
    },
];

// Repetimos para evitar huecos al hacer loop
const loopTestimonials = [
    ...testimonials,
    ...testimonials,
    ...testimonials,
];

export default function TestimonialsSection() {
    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <section className="w-full py-20 bg-[#f5f5f5]">
            <div className="max-w-6xl mx-auto px-4">
                <h2 className="text-center text-4xl md:text-5xl font-extrabold mb-4">
                  <span className="bg-gradient-to-r from-red-600 via-red-500 to-yellow-400 bg-clip-text text-transparent">
                    Testimonios de Clientes
                  </span>
                </h2>
                <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
                    La confianza de nuestros clientes es nuestro mejor respaldo.
                </p>

                {/* CONTENEDOR QUE EVITA EL SCROLL HORIZONTAL */}
                <div className="relative w-full overflow-hidden py-4">
                    <Swiper
                        modules={[Autoplay, EffectCoverflow]}
                        loop
                        autoplay={{ delay: 2500, disableOnInteraction: false }}
                        grabCursor
                        centeredSlides
                        onSlideChange={(swiper) =>
                            setActiveIndex(swiper.realIndex % testimonials.length)
                        }
                        effect="coverflow"
                        coverflowEffect={{
                            rotate: 0,
                            stretch: -40,
                            depth: 180,
                            modifier: 2,
                            slideShadows: false,
                        }}
                        breakpoints={{
                            320: { slidesPerView: 1, spaceBetween: 20 },
                            640: { slidesPerView: 1.2, spaceBetween: 24 },
                            768: { slidesPerView: 2, spaceBetween: 28 },
                            1024: { slidesPerView: 3, spaceBetween: 32 },
                        }}
                        // Aquí sí dejamos visible para que el slide central no se corte
                        className="w-full !overflow-visible"
                    >
                        {loopTestimonials.map((item, index) => {
                            const realIndex = index % testimonials.length;
                            const isActive = activeIndex === realIndex;

                            return (
                                <SwiperSlide
                                    key={`${item.name}-${index}`}
                                    className={`!h-auto flex items-stretch justify-center transition-all duration-300
                    ${
                                        isActive
                                            ? "scale-105 z-20 opacity-100"
                                            : "scale-90 opacity-60"
                                    }`}
                                >
                                    <div
                                        className={`relative rounded-3xl md:p-7 text-center border transition-all duration-300
                      ${
                                            isActive
                                                ? "bg-white border-red-500 shadow-2xl"
                                                : "bg-white/80 border-transparent shadow-md"
                                        }`}
                                    >
                                        {/* Franja superior rojo-amarillo */}
                                        <div className="absolute inset-x-0 top-0 h-1 rounded-t-3xl bg-gradient-to-r from-red-600 via-red-500 to-yellow-400" />

                                        <img
                                            src={item.img}
                                            alt={item.name}
                                            className={`mx-auto w-20 h-20 rounded-full object-cover mb-4 mt-3 border-4 transition-all duration-300
                        ${
                                                isActive
                                                    ? "border-red-500 shadow-lg"
                                                    : "border-yellow-300/70"
                                            }`}
                                        />

                                        <div className="flex justify-center gap-1 mb-3">
                                            {Array.from({ length: item.stars }).map((_, i) => (
                                                <span key={i} className="text-yellow-400 text-xl">
                          ★
                        </span>
                                            ))}
                                        </div>

                                        <p className="text-gray-700 text-sm md:text-base mb-4 leading-relaxed">
                                            “{item.text}”
                                        </p>

                                        <h4 className="font-semibold text-lg md:text-xl text-red-600">
                                            {item.name}
                                        </h4>

                                        {isActive && (
                                            <span className="inline-flex items-center gap-1 mt-3 px-3 py-1 rounded-full text-xs font-semibold bg-yellow-400 text-red-800">
                        <span className="h-2 w-2 rounded-full bg-red-600 animate-pulse" />
                        Destacado
                      </span>
                                        )}
                                    </div>
                                </SwiperSlide>
                            );
                        })}
                    </Swiper>
                </div>
            </div>
        </section>
    );
}
