// features/we/ui/we-history-section/WeHistorySection.tsx
//
// Cada IMAGEN de la sección es un hito: foto (url), título (title), texto (description) y
// «Año o etapa» (label, ej. "2010"; si viene vacío se muestra "<prefijo> N", ej. "Etapa 2").
// Qué se muestra (año/etapa, enlace, autoplay, velocidad, flechas) lo decide la "Apariencia"
// (catálogo history_carousel.php del backend, leído en features/we/lib/weDisplaySettings.ts).
// Cada parte lleva su ancla data-el (la vista previa del intranet la resalta).
// Sin datos de ejemplo: sin imágenes no hay carrusel (solo el encabezado, o nada).
"use client";

import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import Lightbox from "yet-another-react-lightbox";

import "swiper/css";
import "swiper/css/effect-fade";
import Container from "@/shared/ui/container/Container";
import SectionHeading from "@/shared/components/section_heading/SectionHeading";
import { useLightboxState } from "@/shared/lib/useLightboxState";
import HistorySlide from "@/features/we/ui/we-history-section/HistorySlide";
import type { HistoryStory } from "@/features/we/ui/we-history-section/we-history-section.types";
import { getHistorySettings } from "@/features/we/lib/weDisplaySettings";
import { normalizeImages } from "@/shared/services/site_service/lib/normalizeSectionContent";
import { resolveImageFit } from "@/shared/services/site_service/lib/resolveImageFit";
import type { SiteSectionDto } from "@/shared/services/site_service/model/siteget.dto";
import { previewAnchorId, PREVIEW_ANCHOR_STYLE } from "@/shared/lib/previewAnchor";

type Props = {
    // section_type === "history_carousel". Mapeo: story.img <- image.url,
    // story.title <- image.title, story.desc <- image.description,
    // story.step <- image.label (ver FRONTEND_NEXTJS_SITE_V3.md #27).
    section: SiteSectionDto;
};

export default function WeHistorySection({ section }: Props) {
    const swiperRef = useRef<SwiperType | null>(null);
    const lightbox = useLightboxState();
    const settings = getHistorySettings(section);

    const stories: HistoryStory[] = normalizeImages(section.images).map((image, index) => ({
        id: image.id_section_image,
        title: image.title ?? "",
        desc: image.description ?? "",
        img: image.url,
        // «Año o etapa»: el label de la foto o, si está vacío, "Etapa 1", "Etapa 2"...
        step: image.label?.trim() || `${settings.stepPrefix} ${index + 1}`.trim(),
        fit: resolveImageFit(image.fix),
        link: image.link ?? undefined,
        linkLabel: image.link_label ?? undefined,
    }));

    const hasStories = stories.length > 0;
    const hasHeading = Boolean(section.section_subtitle || section.section_title || section.section_description);

    // Sección sin nada que mostrar: no se pinta.
    if (!hasStories && !hasHeading) {
        return null;
    }

    // Si cambia el autoplay o su velocidad (vista previa del intranet), se vuelve a montar el
    // Swiper para que tome la configuración nueva.
    const swiperKey = `${settings.autoplay}-${settings.autoplayMs}`;

    return (
        <section className="w-full py-20 bg-gray-50">
            <Container>
                <SectionHeading
                    subtitle={section.section_subtitle}
                    title={section.section_title}
                    description={section.section_description}
                    className={hasStories ? "mb-12" : ""}
                />

                {/* Contenedor del carrusel (hero) */}
                {hasStories && (
                    <div data-el="history-carousel" className="relative w-full overflow-hidden rounded-3xl shadow-2xl bg-black/80">
                        <Swiper
                            key={swiperKey}
                            modules={[Autoplay, EffectFade]}
                            effect="fade"
                            fadeEffect={{ crossFade: true }}
                            loop
                            autoplay={settings.autoplay ? { delay: settings.autoplayMs, disableOnInteraction: false } : false}
                            onSwiper={(swiper) => {
                                swiperRef.current = swiper;
                            }}
                            className="w-full h-[360px] md:h-[520px]"
                        >
                            {stories.map((story, index) => (
                                <SwiperSlide key={story.id} id={previewAnchorId("section-image", story.id)} style={PREVIEW_ANCHOR_STYLE}>
                                    <HistorySlide
                                        story={story}
                                        showStep={settings.showStep}
                                        showLink={settings.showLink}
                                        linkLabel={settings.linkLabel}
                                        onOpen={() => lightbox.open(index)}
                                    />
                                </SwiperSlide>
                            ))}
                        </Swiper>

                        {/* Borde suave con colores del logo */}
                        <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-red-500/40" />

                        {/* Botones de navegación personalizados */}
                        {settings.showArrows && (
                            <div data-el="history-arrows" className="absolute inset-x-0 bottom-5 flex justify-center gap-4 z-20">
                                <button
                                    type="button"
                                    aria-label="Hito anterior"
                                    onClick={() => swiperRef.current?.slidePrev()}
                                    className="pointer-events-auto flex items-center justify-center w-10 h-10 rounded-full bg-white/90 hover:bg-red-600 hover:text-white shadow-md transition cursor-pointer"
                                >
                                    ‹
                                </button>
                                <button
                                    type="button"
                                    aria-label="Hito siguiente"
                                    onClick={() => swiperRef.current?.slideNext()}
                                    className="pointer-events-auto flex items-center justify-center w-10 h-10 rounded-full bg-white/90 hover:bg-red-600 hover:text-white shadow-md transition cursor-pointer"
                                >
                                    ›
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </Container>

            {hasStories && (
                <Lightbox
                    open={lightbox.isOpen}
                    close={lightbox.close}
                    index={lightbox.index}
                    slides={stories.map((g) => ({ src: g.img }))}
                />
            )}
        </section>
    );
}
