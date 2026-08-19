// widget/main/section2/Section2.tsx
"use client";

import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import type { Swiper as SwiperClass } from "swiper";
import Container from "@/shared/ui/container/Container";

type Servicio = {
    iconClass: string;
    titulo: string;
    descripcion: string;
    tag: string;
};

const servicios: Servicio[] = [
    {
        iconClass: "fas fa-kitchen-set",
        titulo: "Cocinas Integrales",
        descripcion:
            "Diseño y fabricación de cocinas a medida con melamine, MDF y acabados premium.",
        tag: "Diseño a medida",
    },
    {
        iconClass: "fas fa-bed",
        titulo: "Dormitorios & Closets",
        descripcion:
            "Closets, roperos y cabeceras personalizadas para aprovechar cada espacio.",
        tag: "Organización total",
    },
    {
        iconClass: "fas fa-briefcase",
        titulo: "Muebles de Oficina",
        descripcion:
            "Escritorios, estaciones de trabajo y mobiliario corporativo funcional.",
        tag: "Ambientes corporativos",
    },
    {
        iconClass: "fas fa-door-closed",
        titulo: "Puertas & Detalles",
        descripcion:
            "Puertas, marcos y detalles decorativos que elevan el diseño de tu hogar.",
        tag: "Acabados finos",
    },
    {
        iconClass: "fas fa-tools",
        titulo: "Mantenimiento & Reparación",
        descripcion:
            "Servicio de reparación, refuerzo y cambio de herrajes de muebles existentes.",
        tag: "Post venta",
    },
];

export default function Section2() {
    const prevRef = useRef<HTMLButtonElement>(null);
    const nextRef = useRef<HTMLButtonElement>(null);

    return (
        <section id="servicios" className="relative py-16 bg-gray-200">
            <Container>
                {/* Título */}
                <div className="text-center mb-10">
                    <p className="text-sm uppercase tracking-[0.2em] text-red-600 font-semibold">
                        Nuestros Servicios
                    </p>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-2">
                        Soluciones en Muebles a Tu Medida
                    </h2>
                    <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
                        Diseñamos, fabricamos e instalamos muebles personalizados para
                        hogares, oficinas y proyectos comerciales.
                    </p>
                </div>

                {/* Carrusel */}
                <div className="relative px-1 sm:px-2 lg:px-4">
                    <Swiper
                        modules={[Navigation, Pagination, Autoplay]}
                        spaceBetween={24}
                        slidesPerView={1}
                        navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
                        onBeforeInit={(swiper: SwiperClass) => {
                            if (typeof swiper.params.navigation !== "boolean" && swiper.params.navigation) {
                                swiper.params.navigation.prevEl = prevRef.current;
                                swiper.params.navigation.nextEl = nextRef.current;
                            }
                        }}
                        pagination={{ clickable: true }}
                        autoplay={{ delay: 4500, disableOnInteraction: false }}
                        breakpoints={{
                            640: { slidesPerView: 1 },
                            768: { slidesPerView: 2 },
                            1024: { slidesPerView: 3 },
                        }}
                        className="pb-10"
                    >
                    {servicios.map((servicio) => (
                        <SwiperSlide key={servicio.titulo}>
                            <div className="h-full bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-4 categoria-card">
                                <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center">
                                    <i
                                        className={`${servicio.iconClass} text-red-600 text-2xl`}
                                    />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                                        {servicio.titulo}
                                    </h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">
                                        {servicio.descripcion}
                                    </p>
                                </div>
                                <div className="mt-auto flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 text-xs font-semibold bg-amber-100 text-amber-700 px-3 py-1 rounded-full uppercase tracking-wider">
                    <i className="fas fa-check-circle text-[10px]" />
                      {servicio.tag}
                  </span>
                                    <a
                                        href="#contacto"
                                        className="text-sm font-semibold text-red-600 hover:text-red-700 flex items-center gap-1"
                                    >
                                        Cotizar
                                        <i className="fas fa-arrow-right text-xs" />
                                    </a>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>

                    {/* Flechas de navegación: fuera de las cards, no encima del contenido */}
                    <button
                        ref={prevRef}
                        type="button"
                        aria-label="Servicio anterior"
                        className="absolute top-[40%] -translate-y-1/2 -left-3 sm:-left-4 lg:-left-6 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white text-red-600 shadow-lg ring-1 ring-black/5 transition hover:bg-red-600 hover:text-white [&.swiper-button-disabled]:opacity-30 [&.swiper-button-disabled]:pointer-events-none"
                    >
                        <i className="fas fa-chevron-left text-sm" />
                    </button>
                    <button
                        ref={nextRef}
                        type="button"
                        aria-label="Siguiente servicio"
                        className="absolute top-[40%] -translate-y-1/2 -right-3 sm:-right-4 lg:-right-6 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white text-red-600 shadow-lg ring-1 ring-black/5 transition hover:bg-red-600 hover:text-white [&.swiper-button-disabled]:opacity-30 [&.swiper-button-disabled]:pointer-events-none"
                    >
                        <i className="fas fa-chevron-right text-sm" />
                    </button>
                </div>
            </Container>
        </section>
    );
}
