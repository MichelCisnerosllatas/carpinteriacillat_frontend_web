// home/ui/section2/Section2.tsx
"use client";

import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import type { Swiper as SwiperClass } from "swiper";
import Container from "@/shared/ui/container/Container";
import ServiceCarouselCard from "@/widget/servicecarousel/ui/ServiceCarouselCard";
import { defaultServiceCarouselItems } from "@/widget/servicecarousel/model/mock";
import { normalizeItems } from "@/shared/services/site_service/lib/normalizeSectionContent";
import type { SiteSectionDto } from "@/shared/services/site_service/model/siteget.dto";

type Props = {
    // section_type === "service_carousel". Se usa tanto en Home
    // ("Nuestros Servicios") como en Services ("Carpintería Comercial") —
    // en ambos casos son items sueltos (item_type "service") con
    // description, exactamente la misma forma de dato y la misma UI
    // (carrusel swiper). El grid de categorias con sub-lista
    // ("Carpintería para el Hogar") tiene su PROPIO section_type
    // ("category_grid", ver ServiceCategoryGrid) — ya no vive aca.
    section: SiteSectionDto;
};

export default function Section2({ section }: Props) {
    const prevRef = useRef<HTMLButtonElement>(null);
    const nextRef = useRef<HTMLButtonElement>(null);

    const apiItems = normalizeItems(section.items).map((item) => ({
        iconClass: item.icon ?? "",
        titulo: item.title ?? "",
        descripcion: item.description ?? "",
        tag: item.label ?? "",
    }));

    // Fallback temporal (ver FRONTEND_NEXTJS_SITE_V3.md #41).
    const servicios = apiItems.length > 0 ? apiItems : defaultServiceCarouselItems;

    return (
        <section id="servicios" className="relative py-16 bg-gray-200">
            <Container>
                {/* Título */}
                <div className="text-center mb-10">
                    <p className="text-sm uppercase tracking-[0.2em] text-red-600 font-semibold">
                        {section.section_subtitle ?? "Nuestros Servicios"}
                    </p>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-2">
                        {section.section_title ?? "Soluciones en Muebles a Tu Medida"}
                    </h2>
                    <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
                        {section.section_description ??
                            "Diseñamos, fabricamos e instalamos muebles personalizados para hogares, oficinas y proyectos comerciales."}
                    </p>
                </div>

                {/* Carrusel */}
                <div className="relative px-1 sm:px-2 lg:px-4">
                    <Swiper
                        modules={[Navigation, Pagination, Autoplay]}
                        spaceBetween={24}
                        slidesPerView={1}
                        navigation={{ prevEl: null, nextEl: null }}
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
                        {servicios.map((servicio, index) => (
                            <SwiperSlide key={servicio.titulo || index}>
                                <ServiceCarouselCard item={servicio} />
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
