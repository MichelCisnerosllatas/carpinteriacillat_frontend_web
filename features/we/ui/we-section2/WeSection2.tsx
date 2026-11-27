// features/we/ui/we-section2/WeSection2.tsx
//
// Qué se muestra (párrafos, lado del carrusel, autoplay, flechas, puntos, pie de foto, texto del
// enlace) lo decide la "Apariencia" de la sección (catálogo text_media.php del backend, leído en
// features/we/lib/weDisplaySettings.ts). Cada bloque lleva su ancla data-el (la vista previa del
// intranet lo resalta). Sin datos de ejemplo: sin fotos no hay carrusel; sin texto no hay columna.
"use client";

import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import Lightbox from "yet-another-react-lightbox";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "yet-another-react-lightbox/styles.css";
import Container from "@/shared/ui/container/Container";
import SectionHeading from "@/shared/components/section_heading/SectionHeading";
import { useLightboxState } from "@/shared/lib/useLightboxState";
import AboutGallerySlide from "@/features/we/ui/we-section2/AboutGallerySlide";
import type { AboutGalleryItem } from "@/features/we/ui/we-section2/we-section2.types";
import { getAboutSettings } from "@/features/we/lib/weDisplaySettings";
import { normalizeImages } from "@/shared/services/site_service/lib/normalizeSectionContent";
import { resolveImageFit } from "@/shared/services/site_service/lib/resolveImageFit";
import type { SiteSectionDto } from "@/shared/services/site_service/model/siteget.dto";
import { previewAnchorId, PREVIEW_ANCHOR_STYLE } from "@/shared/lib/previewAnchor";

type Props = {
    // section_type === "text_media" (confirmado contra /v1/public/site
    // real). Imagenes del carrusel <- section.images. El backend manda
    // AMBOS parrafos juntos en section_content, separados por una linea en
    // blanco (section_description viene null) — se separan aca. Ninguno
    // de los 3 campos de texto (subtitle/title/parrafos) se rellena con
    // texto inventado: si vienen vacios, esa linea no se pinta.
    section: SiteSectionDto;
};

// Las flechas y los puntos los crea Swiper por dentro (no son nodos nuestros): al montarse se
// les pone su ancla data-el para que la vista previa del intranet pueda resaltarlos.
function markSwiperControls(swiper: SwiperType) {
    swiper.el
        .querySelectorAll(".swiper-button-prev, .swiper-button-next")
        .forEach((node) => node.setAttribute("data-el", "about-arrows"));
    swiper.el
        .querySelectorAll(".swiper-pagination")
        .forEach((node) => node.setAttribute("data-el", "about-dots"));
}

export default function WeSection2({ section }: Props) {
    const lightbox = useLightboxState();
    const settings = getAboutSettings(section);

    const images: AboutGalleryItem[] = normalizeImages(section.images).map((image) => ({
        id: image.id_section_image,
        src: image.url,
        title: image.title ?? image.alt ?? "",
        fit: resolveImageFit(image.fix),
        description: image.description ?? undefined,
        link: image.link ?? undefined,
        linkLabel: image.link_label ?? undefined,
    }));

    const rawText = section.section_content ?? section.section_description;
    const paragraphs = settings.showContent && rawText
        ? rawText.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean)
        : [];

    const title = section.section_title;
    const eyebrow = section.section_subtitle;

    const hasGallery = images.length > 0;
    const hasText = Boolean(title || eyebrow) || paragraphs.length > 0;

    // Sección sin nada que mostrar: no se pinta.
    if (!hasGallery && !hasText) {
        return null;
    }

    // Lado del carrusel en escritorio (en celular siempre va arriba). Clases completas para que
    // Tailwind las encuentre.
    const galleryOnRight = settings.galleryPosition === "right";

    // Si cambia alguna opción del carrusel (vista previa del intranet), se vuelve a montar el
    // Swiper para que tome la configuración nueva.
    const swiperKey = `${settings.autoplay}-${settings.autoplayMs}-${settings.showArrows}-${settings.showDots}`;

    return (
        // overflow-x-hidden para asegurarnos de que nada genere scroll horizontal
        <section className="relative py-16 bg-gray-100 overflow-x-hidden">
            <Container>
                {/* Contenido principal (carrusel + texto) */}
                <div className="flex flex-col md:flex-row gap-10 items-center">
                    {/* Columna CARRUSEL (siempre primero en móvil) */}
                    {hasGallery && (
                        <motion.div
                            initial={{ opacity: 0, x: galleryOnRight ? 20 : -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.4 }}
                            className={`order-1 w-full flex justify-center ${galleryOnRight ? "md:order-2 md:justify-end" : "md:order-1 md:justify-start"}`}
                        >
                            <div
                                data-el="about-gallery"
                                className="relative w-full max-w-md md:max-w-lg rounded-3xl shadow-2xl bg-white overflow-hidden border border-gray-200"
                            >
                                <Swiper
                                    key={swiperKey}
                                    modules={[Navigation, Pagination, Autoplay]}
                                    navigation={settings.showArrows}
                                    pagination={settings.showDots ? { clickable: true } : false}
                                    loop
                                    autoplay={settings.autoplay ? { delay: settings.autoplayMs, disableOnInteraction: false } : false}
                                    slidesPerView={1}
                                    onSwiper={markSwiperControls}
                                    className="w-full h-full"
                                >
                                    {images.map((item, index) => (
                                        <SwiperSlide key={item.id} id={previewAnchorId("section-image", item.id)} style={PREVIEW_ANCHOR_STYLE}>
                                            <AboutGallerySlide
                                                item={item}
                                                showCaption={settings.showCaption}
                                                linkLabel={settings.linkLabel}
                                                onOpen={() => lightbox.open(index)}
                                            />
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            </div>
                        </motion.div>
                    )}

                    {/* Columna TEXTO (siempre segundo en móvil) */}
                    {hasText && (
                        <motion.div
                            initial={{ opacity: 0, x: galleryOnRight ? -20 : 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.4 }}
                            className={`order-2 w-full ${galleryOnRight ? "md:order-1" : "md:order-2"}`}
                        >
                            <SectionHeading
                                subtitle={eyebrow}
                                title={title}
                                align="left"
                                className={paragraphs.length > 0 ? "mb-4" : ""}
                            />

                            {paragraphs.length > 0 && (
                                <div data-el="about-content">
                                    {paragraphs.map((paragraph, index) => (
                                        <p
                                            key={index}
                                            className={`text-sm leading-relaxed text-il-neutro-600 md:text-base ${index < paragraphs.length - 1 ? "mb-3" : ""}`}
                                        >
                                            {paragraph}
                                        </p>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    )}
                </div>
            </Container>

            {/* Lightbox */}
            {hasGallery && (
                <Lightbox
                    open={lightbox.isOpen}
                    close={lightbox.close}
                    index={lightbox.index}
                    slides={images.map((g) => ({ src: g.src }))}
                />
            )}
        </section>
    );
}
