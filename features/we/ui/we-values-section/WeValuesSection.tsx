// features/we/ui/we-values-section/WeValuesSection.tsx
//
// Qué se muestra lo decide la "Apariencia" de la sección (catálogo value_grid.php del backend,
// leído en features/we/lib/weDisplaySettings.ts). Cada bloque lleva su ancla data-el (la vista
// previa del intranet lo resalta). Sin datos de ejemplo: si un bloque no tiene items, no se pinta.
import Container from "@/shared/ui/container/Container";
import type { CoreValue, ValueAccent } from "@/features/we/ui/we-values-section/we-values-section.types";
import CoreValueCard from "@/features/we/ui/we-values-section/CoreValueCard";
import MissionVisionCard from "@/features/we/ui/we-values-section/MissionVisionCard";
import { getValuesSettings } from "@/features/we/lib/weDisplaySettings";
import { normalizeItems } from "@/shared/services/site_service/lib/normalizeSectionContent";
import SectionHeading from "@/shared/components/section_heading/SectionHeading";
import type { SiteSectionDto } from "@/shared/services/site_service/model/siteget.dto";
import { previewAnchorId, PREVIEW_ANCHOR_STYLE } from "@/shared/lib/previewAnchor";

type Props = {
    // section_type === "value_grid". Misión/Visión son items con item_type
    // "mission"/"vision" (title/icon/description/variant). Los items con
    // item_type "value" son las tarjetas de valores centrales.
    section: SiteSectionDto;
};

function resolveAccent(variant: string | null): ValueAccent {
    return variant === "red" ? "red" : "gold";
}

export default function WeValuesSection({ section }: Props) {
    const settings = getValuesSettings(section);

    const items = normalizeItems(section.items);
    const mission = items.find((item) => item.item_type === "mission");
    const vision = items.find((item) => item.item_type === "vision");

    const values: CoreValue[] = items
        .filter((item) => item.item_type === "value")
        .map((item) => ({
            id: item.id_section_item,
            label: item.title ?? "",
            icon: item.icon ?? "",
            accent: resolveAccent(item.variant),
        }));

    // Cada bloque se pinta solo si está activado en la Apariencia y tiene datos.
    const showMissionVision = settings.showMissionVision && Boolean(mission || vision);
    const showValues = settings.showValues && values.length > 0;
    const hasHeading = Boolean(section.section_subtitle || section.section_title || section.section_description);

    // Sección sin nada que mostrar: no se pinta (evita un bloque blanco vacío).
    if (!hasHeading && !showMissionVision && !showValues) {
        return null;
    }

    return (
        <section className="py-16 bg-white">
            <Container>
                <SectionHeading
                    subtitle={section.section_subtitle}
                    title={section.section_title}
                    description={section.section_description}
                    className="mb-10"
                />

                <div className="flex flex-col gap-10">
                    {showMissionVision && (
                        <div data-el="values-missionvision" className="grid md:grid-cols-2 gap-6">
                            {/* "Misión"/"Visión" solo como título si el item no trae uno. */}
                            {mission && (
                                <div id={previewAnchorId("section-item", mission.id_section_item)} style={PREVIEW_ANCHOR_STYLE}>
                                    <MissionVisionCard
                                        title={mission.title ?? "Misión"}
                                        text={mission.description}
                                        icon={mission.icon}
                                        accent={resolveAccent(mission.variant)}
                                        showIcon={settings.showMissionVisionIcons}
                                    />
                                </div>
                            )}

                            {vision && (
                                <div id={previewAnchorId("section-item", vision.id_section_item)} style={PREVIEW_ANCHOR_STYLE}>
                                    <MissionVisionCard
                                        title={vision.title ?? "Visión"}
                                        text={vision.description}
                                        icon={vision.icon}
                                        accent={resolveAccent(vision.variant)}
                                        showIcon={settings.showMissionVisionIcons}
                                    />
                                </div>
                            )}
                        </div>
                    )}

                    {showValues && (
                        <div data-el="values-grid" className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {values.map((value) => (
                                <div key={value.id} id={previewAnchorId("section-item", value.id)} style={PREVIEW_ANCHOR_STYLE}>
                                    <CoreValueCard value={value} showIcon={settings.showValuesIcons} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </Container>
        </section>
    );
}
