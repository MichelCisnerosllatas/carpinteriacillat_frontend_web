"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";

import "swiper/css";
import "swiper/css/pagination";

import Container from "@/shared/ui/container/Container";
import { defaultTestimonials } from "@/widget/testimonial/model/mock";
import TestimonialArrow from "@/widget/testimonial/ui/TestimonialArrow";
import TestimonialCard from "@/widget/testimonial/ui/TestimonialCard";
import { getTestimonySettings } from "@/widget/testimonial/lib/getTestimonySettings";
import SectionHeading from "@/shared/components/section_heading/SectionHeading";
import type { SiteSectionDto } from "@/shared/services/site_service/model/siteget.dto";
import type { Testimonial } from "@/widget/testimonial/model/types";

type Props = {
    // section_type === "testimonial_carousel". Testimonios en su propia tabla
    // (`testimony_web`, backend), ya NO dentro de `section.items` — ver
    // TestimonyWebSeeder.php / create_testimony_web_tables migration.
    section: SiteSectionDto;
};

export default function SectionTestimonial({ section }: Props) {
    const prevRef = useRef<HTMLButtonElement>(null);
    const nextRef = useRef<HTMLButtonElement>(null);
    // Mismo fix que Section2.tsx: el modulo Navigation necesita re-engancharse
    // a prevRef/nextRef ya montados (onBeforeInit dispara antes de que React
    // confirme esos refs). Con loop=true (mas abajo) el modulo nunca marca
    // "swiper-button-disabled" en los extremos: siempre da la vuelta.
    const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);

    useEffect(() => {
        if (!swiperInstance || !prevRef.current || !nextRef.current) return;

        const navigation = swiperInstance.params.navigation;
        if (!navigation || typeof navigation === "boolean") return;

        navigation.prevEl = prevRef.current;
        navigation.nextEl = nextRef.current;
        swiperInstance.navigation.destroy();
        swiperInstance.navigation.init();
        swiperInstance.navigation.update();
    }, [swiperInstance]);

    const apiItems: Testimonial[] = section.testimonies.map((t) => ({
        id: String(t.id_testimony_web),
        name: t.name,
        role: t.role ?? "",
        message: t.message,
        city: t.city ?? undefined,
        rating: t.rating ?? undefined,
        email: t.email ?? undefined,
        photoUrl: t.photo_url,
        isDelivered: t.is_delivered,
        isVerified: t.is_verified,
    }));

    const settings = getTestimonySettings(section.testimony_settings);

    // Fallback temporal mientras el backend no tenga cargados los
    // testimonios de esta seccion (ver FRONTEND_NEXTJS_SITE_V3.md #41).
    const data = apiItems.length > 0 ? apiItems : defaultTestimonials;

    return (
        <section
            id="testimonios"
            className="relative overflow-hidden bg-gray-200 py-16 md:py-20 lg:py-24"
        >
            <Container>

                {/* ENCABEZADO */}
                <SectionHeading
                    subtitle={section.section_subtitle}
                    title={section.section_title}
                    description={section.section_description}
                    className="mx-auto mb-10 max-w-5xl text-center md:mb-12 lg:mb-14"
                    subtitleClassName="text-xs font-bold uppercase tracking-[0.28em] text-red-600 md:text-sm"
                    titleClassName="mx-auto mt-3 max-w-5xl text-3xl font-extrabold leading-[1.12] tracking-tight text-slate-950 md:text-4xl lg:text-[44px]"
                    descriptionClassName="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-500 md:text-base md:leading-7"
                />


                {/* CARRUSEL */}
                <div className="relative lg:px-[72px]">
                    <TestimonialArrow
                        ref={prevRef}
                        direction="left"
                        className="absolute left-1 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 shadow-md transition-all duration-300 hover:scale-105 hover:border-red-600 hover:bg-red-600 hover:text-white lg:flex"
                    />

                    <Swiper
                        modules={[
                            Autoplay,
                            Navigation,
                            Pagination,
                        ]}
                        navigation={{ prevEl: null, nextEl: null }}
                        onSwiper={setSwiperInstance}
                        slidesPerView={1}
                        spaceBetween={20}
                        speed={650}
                        loop={data.length > 3}
                        grabCursor
                        autoplay={{
                            delay: 6000,
                            disableOnInteraction: false,
                            pauseOnMouseEnter: true,
                        }}
                        pagination={{
                            clickable: true,
                        }}
                        breakpoints={{
                            640: {
                                slidesPerView: 1,
                            },
                            768: {
                                slidesPerView: 2,
                                spaceBetween: 22,
                            },
                            1200: {
                                slidesPerView: 3,
                                spaceBetween: 24,
                            },
                        }}
                        className="testimonial-swiper !pb-14"
                    >
                        {data.map((item) => (
                            <SwiperSlide key={item.id} className="!h-auto">
                                <TestimonialCard item={item} settings={settings}/>
                            </SwiperSlide>
                        ))}
                    </Swiper>


                    <TestimonialArrow
                        ref={nextRef}
                        direction="right"
                        className="absolute right-1 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 shadow-md transition-all duration-300 hover:scale-105 hover:border-red-600 hover:bg-red-600 hover:text-white lg:flex"
                    />
                </div>

                {/* CTA — envía a /testimonials, página propia con su wizard
                    form -> vista previa -> éxito (ver TestimonySubmitForm.tsx). */}
                <div className="mt-10 text-center">
                    <Link
                        href="/testimonials"
                        className="inline-flex items-center gap-2 rounded-full border border-brand-gold px-5 py-2.5 text-sm font-semibold text-brand-gold-dark transition-all duration-300 hover:bg-brand-gold hover:text-black"
                    >
                        <i className="fas fa-pen" />
                        Deja tu testimonio
                    </Link>
                </div>
            </Container>
        </section>
    );
}
