// features/we/ui/weteamsection/WeTeamSection.tsx
"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Container from "@/shared/ui/container/Container";
import { defaultDisciplines, type Discipline } from "@/widget/we/team/model/mock";
import DisciplineBadge from "@/widget/we/team/ui/DisciplineBadge";
import { normalizeImages, normalizeItems } from "@/shared/services/site_service/lib/normalizeSectionContent";
import { resolveImageFit } from "@/shared/services/site_service/lib/resolveImageFit";
import type { SiteSectionDto } from "@/shared/services/site_service/model/siteget.dto";

type Props = {
    // section_type === "team_grid". Foto <- section.images[0]. Disciplinas <-
    // section.items (title -> label, icon -> icon).
    section: SiteSectionDto;
};

export default function WeTeamSection({ section }: Props) {
    const photo = normalizeImages(section.images)[0];

    const apiDisciplines: Discipline[] = normalizeItems(section.items).map((item) => ({
        label: item.title ?? "",
        icon: item.icon ?? "",
    }));

    // Fallback temporal (ver FRONTEND_NEXTJS_SITE_V3.md #41).
    const disciplines = apiDisciplines.length > 0 ? apiDisciplines : defaultDisciplines;

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
                        {eyebrow && (
                            <span className="inline-flex items-center text-xs font-semibold uppercase tracking-[0.2em] text-brand-red">
                                {eyebrow}
                            </span>
                        )}

                        {title && (
                            <h3 className="text-3xl md:text-4xl font-bold text-black leading-tight mt-2 mb-4">
                                {title}
                            </h3>
                        )}

                        {description && (
                            <p className="text-gray-700 text-base leading-relaxed mb-6">
                                {description}
                            </p>
                        )}

                        <div className="grid grid-cols-2 gap-3">
                            {disciplines.map((discipline) => (
                                <DisciplineBadge key={discipline.label} discipline={discipline} />
                            ))}
                        </div>
                    </motion.div>
                </div>
            </Container>
        </section>
    );
}
