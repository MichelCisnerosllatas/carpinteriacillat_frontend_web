// features/we/ui/wehostorysection/WeHistorySection.tsx
"use client";

import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import Lightbox from "yet-another-react-lightbox";

import "swiper/css";
import "swiper/css/effect-fade";
import Container from "@/shared/ui/container/Container";
import { useLightboxState } from "@/shared/lib/useLightboxState";
import { defaultHistoryStories } from "@/widget/we/history/model/mock";
import HistorySlide from "@/widget/we/history/ui/HistorySlide";

export default function WeHistorySection() {
    const swiperRef = useRef<SwiperType | null>(null);
    const lightbox = useLightboxState();

    return (
        <section className="w-full py-20 bg-gray-50">
            <Container>
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
                        {defaultHistoryStories.map((story, index) => (
                            <SwiperSlide key={index}>
                                <HistorySlide
                                    story={story}
                                    stepNumber={index + 1}
                                    onOpen={() => lightbox.open(index)}
                                />
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
            </Container>

            <Lightbox
                open={lightbox.isOpen}
                close={lightbox.close}
                index={lightbox.index}
                slides={defaultHistoryStories.map((g) => ({ src: g.img }))}
            />
        </section>
    );
}
