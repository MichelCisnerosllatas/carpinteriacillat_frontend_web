// features/we/ui/we-team-section/WeTeamSection.tsx
"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Container from "@/shared/ui/container/Container";
import SectionHeading from "@/shared/components/section_heading/SectionHeading";
import { defaultDisciplines, type Discipline } from "@/features/we/ui/we-team-section/we-team-section.mock";
import DisciplineBadge from "@/features/we/ui/we-team-section/DisciplineBadge";
import { normalizeImages, normalizeItems } from "@/shared/services/site_service/lib/normalizeSectionContent";
import { resolveImageFit } from "@/shared/services/site_service/lib/resolveImageFit";
import type { SiteSectionDto } from "@/shared/services/site_service/model/siteget.dto";
import { previewAnchorId, PREVIEW_ANCHOR_STYLE } from "@/shared/lib/previewAnchor";

type Props = {
    // section_type === "team_grid". Foto <- section.images[0]. Disciplinas <-
    // section.items (title -> label, icon -> icon).
    section: SiteSectionDto;
};

export default function WeTeamSection({ section }: Props) {
    const photo = normalizeImages(section.images)[0];

    const apiDisciplines: (Discipline & { id?: number })[] = normalizeItems(section.items).map((item) => ({
        id: item.id_section_item,
        label: item.title ?? "",
        icon: item.icon ?? "",
    }));

    // Fallback temporal (ver FRONTEND_NEXTJS_SITE_V3.md #41).
    const disciplines = apiDisciplines.length > 0 ? apiDisciplines : defaultDisciplines.map((d) => ({ ...d, id: undefined }));

    const title = section.section_title;
    const eyebrow = section.section_subtitle;
    const description = section.section_description;

    return (
        <section className="relative py-16 bg-gray-100 overflow-x-hidden">
            <Container>
                <div className="flex flex-col md:flex-row gap-10 items-center">
                    {/* Columna IMAGEN */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.4 }}
                        className="w-full flex justify-center md:justify-start"
                    >
                        <div className="relative w-full max-w-md md:max-w-lg rounded-3xl shadow-2xl bg-white overflow-hidden border border-gray-200">
                            {/* Navegacion opcional de la imagen (image.link) — si no
                                trae link, es una foto simple sin envoltorio clickeable. */}
                            {photo?.link ? (
                                <a href={photo.link} target="_blank" rel="noopener noreferrer">
                                    <Image
                                        src={photo.url}
                                        alt={photo.alt ?? "Equipo de Carpintería CILLAT"}
                                        width={800}
                                        height={600}
                                        className={`w-full h-72 md:h-80 ${resolveImageFit(photo.fix)}`}
                                    />
                                </a>
                            ) : (
                                <Image
                                    src={photo?.url ?? "/img/sistema/fotogrupalcillat.jpg"}
                                    alt={photo?.alt ?? "Equipo de Carpintería CILLAT"}
                                    width={800}
                                    height={600}
                                    className={`w-full h-72 md:h-80 ${resolveImageFit(photo?.fix)}`}
                                />
                            )}
                        </div>
                    </motion.div>

                    {/* Columna TEXTO */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.4 }}
                        className="w-full"
                    >
                        <SectionHeading
                            subtitle={eyebrow}
                            title={title}
                            description={description}
                            align="left"
                            className="mb-6"
                        />

                        <div className="grid grid-cols-2 gap-3">
                            {disciplines.map((discipline) => (
                                <div key={discipline.label} id={previewAnchorId("section-item", discipline.id)} style={PREVIEW_ANCHOR_STYLE}>
                                    <DisciplineBadge discipline={discipline} />
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </Container>
        </section>
    );
}
