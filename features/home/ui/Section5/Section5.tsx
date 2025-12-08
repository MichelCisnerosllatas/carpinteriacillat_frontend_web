"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

export type Testimonial = {
    id: string;
    name: string;
    role: string;
    message: string;
    city?: string;
    rating?: number; // 1-5
};

export type Section5Props = {
    title?: string;
    subtitle?: string;
    items?: Testimonial[];
};

const defaultTestimonials: Testimonial[] = [
    {
        id: "1",
        name: "María López",
        role: "Ama de casa",
        city: "Iquitos",
        message:
            "Muy cumplidos con los tiempos y el diseño quedó tal como lo imaginamos. Nuestra cocina ahora es el corazón de la casa.",
        rating: 5,
    },
    {
        id: "2",
        name: "Carlos Ramírez",
        role: "Gerente de tienda",
        city: "Iquitos",
        message:
            "Instalaron el mobiliario de nuestra tienda en tiempo récord. Se nota la calidad en los acabados.",
        rating: 5,
    },
    {
        id: "3",
        name: "Ana Fernández",
        role: "Profesional independiente",
        city: "Punchana",
        message:
            "Mandé a hacer mi closet y escritorio de trabajo. Aprovecharon al máximo cada espacio, quedó espectacular.",
        rating: 4,
    },
    {
        id: "4",
        name: "Luis Gutiérrez",
        role: "Administrador de restaurante",
        city: "San Juan Bautista",
        message:
            "Renovamos todo el mobiliario del local. Los clientes nos felicitan por el nuevo ambiente.",
        rating: 5,
    },
    {
        id: "5",
        name: "Rocío Herrera",
        role: "Arquitecta",
        city: "Iquitos",
        message:
            "Excelente aliado para proyectos integrales. Respetan los planos, los detalles y proponen buenas soluciones.",
        rating: 5,
    },
    {
        id: "6",
        name: "Jorge Saldaña",
        role: "Empresario",
        city: "Bellavista",
        message:
            "Hicieron los muebles de oficina de nuestra empresa. Muy buen balance entre diseño y funcionalidad.",
        rating: 4,
    },
];

function getInitials(name: string) {
    return name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((n) => n[0]?.toUpperCase())
        .join("");
}

function Stars({ rating = 5 }: { rating?: number }) {
    return (
        <div className="flex items-center gap-1 text-amber-400 text-xs">
            {Array.from({ length: 5 }).map((_, i) => (
                <i
                    key={i}
                    className={`fas fa-star ${i < rating ? "" : "text-gray-500/60"}`}
                />
            ))}
        </div>
    );
}

export default function Section5({
                                     title,
                                     subtitle,
                                     items,
                                 }: Section5Props) {
    const data = items && items.length > 0 ? items : defaultTestimonials;

    return (
        <section id="testimonios" className="relative py-16 bg-gray-200">
            <div className="container mx-auto px-4">
                {/* Título */}
                <div className="text-center mb-10">
                    <p className="text-sm uppercase tracking-[0.2em] text-red-600 font-semibold">
                        {subtitle ?? "Lo que dicen nuestros clientes"}
                    </p>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-black mt-2">
                        {title ?? "Historias de confianza y buenos resultados"}
                    </h2>
                    <p className="text-gray-400 mt-3 max-w-2xl mx-auto text-sm md:text-base">
                        Cada proyecto termina con un cliente satisfecho. Estas son algunas
                        opiniones de personas y empresas que confiaron en CILLAT.
                    </p>
                </div>

                {/* Carrusel de testimonios */}
                <Swiper
                    modules={[Autoplay, Pagination]}
                    spaceBetween={24}
                    slidesPerView={1}
                    autoplay={{
                        delay: 6500, // se desliza despacito
                        disableOnInteraction: false,
                    }}
                    loop
                    pagination={{ clickable: true }}
                    breakpoints={{
                        768: { slidesPerView: 2 },
                        1024: { slidesPerView: 3 },
                    }}
                    className="pb-10"
                >
                    {data.map((item) => (
                        <SwiperSlide key={item.id}>
                            <div className="h-full bg-gray-800/80 border border-gray-700/60 rounded-2xl p-6 flex flex-col justify-between shadow-lg">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-400/50 flex items-center justify-center text-amber-300 font-bold">
                                        {getInitials(item.name)}
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-semibold text-white">
                                            {item.name}
                                        </h3>
                                        <p className="text-xs text-gray-400">
                                            {item.role}
                                            {item.city ? ` · ${item.city}` : ""}
                                        </p>
                                        <Stars rating={item.rating} />
                                    </div>
                                </div>

                                <p className="text-gray-200 text-sm leading-relaxed mb-4">
                                    “{item.message}”
                                </p>

                                <div className="flex items-center justify-between text-xs text-gray-400">
                                    <div className="flex items-center gap-1">
                                        <i className="fas fa-check-circle text-emerald-400" />
                                        <span>Proyecto entregado</span>
                                    </div>
                                    <span className="italic text-[11px]">
                    Cliente verificado
                  </span>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
}
