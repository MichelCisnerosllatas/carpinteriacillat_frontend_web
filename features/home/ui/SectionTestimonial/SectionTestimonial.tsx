"use client";
import { useRef } from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";

import "swiper/css";
import "swiper/css/pagination";

import Container from "@/shared/ui/container/Container";
import { SectionTestimonialProps } from "@/widget/testimonial/model/types";
import { defaultTestimonials } from "@/widget/testimonial/model/mock";
import TestimonialArrow from "@/widget/testimonial/ui/TestimonialArrow";
import TestimonialCard from "@/widget/testimonial/ui/TestimonialCard";


export default function SectionTestimonial({
    title,
    subtitle,
    items,
}: SectionTestimonialProps) {
    const swiperRef = useRef<SwiperType | null>(null);
    const data = items && items.length > 0 ? items : defaultTestimonials;

    return (
        <section
            id="testimonios"
            className="relative overflow-hidden bg-gray-200 py-16 md:py-20 lg:py-24"
        >
            <Container>

                {/* ENCABEZADO */}
                <div className="mx-auto mb-10 max-w-5xl text-center md:mb-12 lg:mb-14">
                    <p className="text-xs font-bold uppercase tracking-[0.28em] text-red-600 md:text-sm">
                        {subtitle ?? "Lo que dicen nuestros clientes"}
                    </p>

                    <h2 className="mx-auto mt-3 max-w-5xl text-3xl font-extrabold leading-[1.12] tracking-tight text-slate-950 md:text-4xl lg:text-[44px]">
                        {title ?? "Historias de confianza y buenos resultados"}
                    </h2>

                    <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-500 md:text-base md:leading-7">
                        Cada proyecto termina con un cliente
                        satisfecho. Estas son algunas opiniones
                        de personas y empresas que confiaron en
                        CILLAT.
                    </p>
                </div>


                {/* CARRUSEL */}
                <div className="relative lg:px-[72px]">
                    <TestimonialArrow
                        direction="left"
                        onClick={() =>
                            swiperRef.current?.slidePrev()
                        }
                        className="absolute left-1 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 shadow-md transition-all duration-300 hover:scale-105 hover:border-red-600 hover:bg-red-600 hover:text-white lg:flex"
                    />

                    <Swiper
                        modules={[
                            Autoplay,
                            Pagination,
                        ]}
                        onSwiper={(swiper) => {
                            swiperRef.current = swiper;
                        }}
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
                                <TestimonialCard item={item}/>
                            </SwiperSlide>
                        ))}
                    </Swiper>


                    <TestimonialArrow
                        direction="right"
                        onClick={() =>
                            swiperRef.current?.slideNext()
                        }
                        className="absolute right-1 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 shadow-md transition-all duration-300 hover:scale-105 hover:border-red-600 hover:bg-red-600 hover:text-white lg:flex"
                    />
                </div>
            </Container>
        </section>
    );
}