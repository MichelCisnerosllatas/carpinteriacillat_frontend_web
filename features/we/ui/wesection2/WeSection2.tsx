// features/we/ui/wesection2/WeSection2.tsx
"use client";

import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import Lightbox from "yet-another-react-lightbox";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "yet-another-react-lightbox/styles.css";
import Container from "@/shared/ui/container/Container";
import { useLightboxState } from "@/shared/lib/useLightboxState";
import { defaultAboutGalleryItems } from "@/widget/we/aboutgallery/model/mock";
import AboutGallerySlide from "@/widget/we/aboutgallery/ui/AboutGallerySlide";
import { normalizeImages } from "@/shared/services/site_service/lib/normalizeSectionContent";
import { resolveImageFit } from "@/shared/services/site_service/lib/resolveImageFit";
import type { SiteSectionDto } from "@/shared/services/site_service/model/siteget.dto";

type Props = {
    // section_type === "text_media" (confirmado contra /v1/public/site
    // real). Imagenes del carrusel <- section.images. El backend manda
    // AMBOS parrafos juntos en section_content, separados por una linea en
    // blanco (section_description viene null) — se separan aca. Ninguno
    // de los 3 campos de texto (subtitle/title/parrafos) se rellena con
    // texto inventado: si vienen vacios, esa linea no se pinta.
    section: SiteSectionDto;
};

export default function WeSection2({ section }: Props) {
    const lightbox = useLightboxState();

    const apiImages = normalizeImages(section.images).map((image) => ({
        src: image.url,
        title: image.title ?? image.alt ?? "",
        fit: resolveImageFit(image.fix),
        description: image.description ?? undefined,
        link: image.link ?? undefined,
        linkLabel: image.link_label ?? undefined,
    }));

    // Fallback temporal (ver FRONTEND_NEXTJS_SITE_V3.md #41).
    const images = apiImages.length > 0 ? apiImages : defaultAboutGalleryItems;

    const rawText = section.section_content ?? section.section_description;
    const paragraphs = rawText
        ? rawText.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean)
        : [];

    const title = section.section_title;
    const eyebrow = section.section_subtitle;

    return (
        // overflow-x-hidden para asegurarnos de que nada genere scroll horizontal
        <section className="relative py-16 bg-gray-100 overflow-x-hidden">
            <Container>
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
                                {images.map((item, index) => (
                                    <SwiperSlide key={index}>
                                        <AboutGallerySlide item={item} onOpen={() => lightbox.open(index)} />
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
                        {eyebrow && (
                            <span className="inline-flex items-center text-xs font-semibold uppercase tracking-[0.2em] text-red-500">
                                {eyebrow}
                            </span>
                        )}

                        {title && (
                            <h3 className="text-3xl md:text-4xl font-bold text-black leading-tight mt-2 mb-4">
                                {title}
                            </h3>
                        )}

                        {paragraphs.map((paragraph, index) => (
                            <p
                                key={index}
                                className={`text-gray-700 text-base leading-relaxed ${index < paragraphs.length - 1 ? "mb-3" : ""}`}
                            >
                                {paragraph}
                            </p>
                        ))}
                    </motion.div>
                </div>
            </Container>

            {/* Lightbox */}
            <Lightbox
                open={lightbox.isOpen}
                close={lightbox.close}
                index={lightbox.index}
                slides={images.map((g) => ({ src: g.src }))}
            />
        </section>
    );
}
