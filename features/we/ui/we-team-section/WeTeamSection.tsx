// features/we/ui/we-team-section/WeTeamSection.tsx
//
// Qué se muestra lo decide la "Apariencia" de la sección (catálogo team_grid.php del backend,
// leído en features/we/lib/weDisplaySettings.ts). Cada bloque lleva su ancla data-el (la vista
// previa del intranet lo resalta). Sin datos de ejemplo: sin foto o sin disciplinas, ese bloque
// no se pinta.
"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { canOptimizeImage } from "@/shared/lib/imageOptimization";
import Container from "@/shared/ui/container/Container";
import SectionHeading from "@/shared/components/section_heading/SectionHeading";
import type { Discipline } from "@/features/we/ui/we-team-section/we-team-section.types";
import DisciplineBadge from "@/features/we/ui/we-team-section/DisciplineBadge";
import { getTeamSettings } from "@/features/we/lib/weDisplaySettings";
import { normalizeImages, normalizeItems } from "@/shared/services/site_service/lib/normalizeSectionContent";
import { resolveImageFit } from "@/shared/services/site_service/lib/resolveImageFit";
import type { SiteSectionDto } from "@/shared/services/site_service/model/siteget.dto";
import { previewAnchorId, PREVIEW_ANCHOR_STYLE } from "@/shared/lib/previewAnchor";

type Props = {
    // section_type === "team_grid". Foto <- section.images[0] (solo la primera).
    // Disciplinas <- section.items con item_type "discipline" (title -> label, icon -> icon).
    section: SiteSectionDto;
};

export default function WeTeamSection({ section }: Props) {
    const settings = getTeamSettings(section);

    const photo = normalizeImages(section.images)[0];

    const disciplines: Discipline[] = normalizeItems(section.items)
        .filter((item) => item.item_type === "discipline")
        .map((item) => ({
            id: item.id_section_item,
            label: item.title ?? "",
            icon: item.icon ?? "",
        }));

    // Cada bloque se pinta solo si está activado en la Apariencia y tiene datos.
    const showPhoto = settings.showPhoto && Boolean(photo);
    const showDisciplines = settings.showDisciplines && disciplines.length > 0;
    const hasHeading = Boolean(section.section_subtitle || section.section_title || section.section_description);
    const hasText = hasHeading || showDisciplines;

    // Sección sin nada que mostrar: no se pinta.
    if (!showPhoto && !hasText) {
        return null;
    }

    // Lado de la foto en escritorio (en celular siempre va arriba). Clases completas para que
    // Tailwind las encuentre.
    const photoOnLeft = settings.photoPosition === "left";

    return (
        <section className="relative py-16 bg-gray-100 overflow-x-hidden">
            <Container>
                <div className="flex flex-col md:flex-row gap-10 items-center">
                    {/* Columna IMAGEN */}
                    {showPhoto && photo && (
                        <motion.div
                            initial={{ opacity: 0, x: photoOnLeft ? -20 : 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.4 }}
                            className={`order-1 w-full flex justify-center ${photoOnLeft ? "md:order-1 md:justify-start" : "md:order-2 md:justify-end"}`}
                        >
                            <div
                                data-el="team-photo"
                                id={previewAnchorId("section-image", photo.id_section_image)}
                                style={PREVIEW_ANCHOR_STYLE}
                                className="relative w-full max-w-md md:max-w-lg rounded-3xl shadow-2xl bg-white overflow-hidden border border-gray-200"
                            >
                                {/* Navegacion opcional de la imagen (image.link) — si no
                                    trae link, es una foto simple sin envoltorio clickeable. */}
                                {photo.link ? (
                                    <a href={photo.link} target="_blank" rel="noopener noreferrer">
                                        <Image
                                            src={photo.url}
                                            unoptimized={!canOptimizeImage(photo.url)}
                                            alt={photo.alt ?? "Equipo de Carpintería CILLAT"}
                                            width={800}
                                            height={600}
                                            className={`w-full h-72 md:h-80 ${resolveImageFit(photo.fix)}`}
                                        />
                                    </a>
                                ) : (
                                    <Image
                                        src={photo.url}
                                        unoptimized={!canOptimizeImage(photo.url)}
                                        alt={photo.alt ?? "Equipo de Carpintería CILLAT"}
                                        width={800}
                                        height={600}
                                        className={`w-full h-72 md:h-80 ${resolveImageFit(photo.fix)}`}
                                    />
                                )}
                            </div>
                        </motion.div>
                    )}

                    {/* Columna TEXTO */}
                    {hasText && (
                        <motion.div
                            initial={{ opacity: 0, x: photoOnLeft ? 20 : -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.4 }}
                            className={`order-2 w-full ${photoOnLeft ? "md:order-2" : "md:order-1"}`}
                        >
                            <SectionHeading
                                subtitle={section.section_subtitle}
                                title={section.section_title}
                                description={section.section_description}
                                align="left"
                                className={showDisciplines ? "mb-6" : ""}
                            />

                            {showDisciplines && (
                                <div data-el="team-disciplines" className="grid grid-cols-2 gap-3">
                                    {disciplines.map((discipline) => (
                                        <div key={discipline.id} id={previewAnchorId("section-item", discipline.id)} style={PREVIEW_ANCHOR_STYLE}>
                                            <DisciplineBadge discipline={discipline} showIcon={settings.showDisciplineIcons} />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    )}
                </div>
            </Container>
        </section>
    );
}
