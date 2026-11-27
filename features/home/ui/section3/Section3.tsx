// home/ui/section3/Section3.tsx
"use client";

import { motion } from "framer-motion";
import Lightbox from "yet-another-react-lightbox";
import Container from "@/shared/ui/container/Container";
import { useLightboxState } from "@/shared/lib/useLightboxState";
import { defaultGalleryPreviewItems } from "@/features/home/ui/section3/section3.mock";
import GalleryPreviewCard from "@/features/home/ui/section3/GalleryPreviewCard";
import { normalizeImages } from "@/shared/services/site_service/lib/normalizeSectionContent";
import { resolveImageFit } from "@/shared/services/site_service/lib/resolveImageFit";
import SectionHeading from "@/shared/components/section_heading/SectionHeading";
import type { SiteSectionDto } from "@/shared/services/site_service/model/siteget.dto";
import { previewAnchorId, PREVIEW_ANCHOR_STYLE } from "@/shared/lib/previewAnchor";

type Props = {
    // section_type === "gallery_preview". Mapeo: id <- id_section_image,
    // title <- image.title ?? image.alt, category <- image.label,
    // imageUrl <- image.url (ver FRONTEND_NEXTJS_SITE_V3.md #25).
    section: SiteSectionDto;
};

export default function Section3({ section }: Props) {
    const apiItems = normalizeImages(section.images).map((image) => ({
        id: String(image.id_section_image),
        title: image.title ?? image.alt ?? "",
        category: image.label ?? "",
        imageUrl: image.url,
        fit: resolveImageFit(image.fix),
        description: image.description ?? undefined,
        link: image.link ?? undefined,
        linkLabel: image.link_label ?? undefined,
    }));

    // Fallback temporal mientras el backend no tenga cargadas las imagenes
    // de esta seccion (ver FRONTEND_NEXTJS_SITE_V3.md #41).
    const data = apiItems.length > 0 ? apiItems : defaultGalleryPreviewItems;
    const lightbox = useLightboxState();

    return (
        <section id="galeria" className="relative py-16 bg-gray-100">
            <Container>
                {/* Títulos animados */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.4 }}
                >
                    <SectionHeading
                        subtitle={section.section_subtitle}
                        title={section.section_title}
                        description={section.section_description}
                        className="mb-10"
                    />
                </motion.div>

                {/* Grid de galería */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {data.map((item, index) => {
                        const numericId = Number(item.id);
                        return (
                            <div
                                key={item.id}
                                id={previewAnchorId("section-image", Number.isFinite(numericId) ? numericId : undefined)}
                                style={PREVIEW_ANCHOR_STYLE}
                            >
                                <GalleryPreviewCard item={item} index={index} onOpen={lightbox.open} />
                            </div>
                        );
                    })}
                </div>
            </Container>

            {/* Lightbox */}
            <Lightbox
                open={lightbox.isOpen}
                close={lightbox.close}
                index={lightbox.index}
                slides={data.map((item) => ({ src: item.imageUrl }))}
            />
        </section>
    );
}
