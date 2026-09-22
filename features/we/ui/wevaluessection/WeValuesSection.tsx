// features/we/ui/wevaluessection/WeValuesSection.tsx
import Container from "@/shared/ui/container/Container";
import { defaultCoreValues, type CoreValue } from "@/widget/we/values/model/mock";
import CoreValueCard from "@/widget/we/values/ui/CoreValueCard";
import MissionVisionCard from "@/widget/we/values/ui/MissionVisionCard";
import { normalizeItems } from "@/shared/services/site_service/lib/normalizeSectionContent";
import SectionHeading from "@/shared/components/section_heading/SectionHeading";
import type { SiteSectionDto } from "@/shared/services/site_service/model/siteget.dto";

type Props = {
    // section_type === "value_grid". Misión/Visión son items con item_type
    // "mission"/"vision" (title/icon/description/variant). El resto de
    // items (item_type "value") son las tarjetas de valores centrales.
    section: SiteSectionDto;
};

function resolveAccent(variant: string | null): CoreValue["accent"] {
    return variant === "red" ? "red" : "gold";
}

export default function WeValuesSection({ section }: Props) {
    const items = normalizeItems(section.items);
    const mission = items.find((item) => item.item_type === "mission");
    const vision = items.find((item) => item.item_type === "vision");

    const apiValues: CoreValue[] = items
        .filter((item) => item.item_type === "value")
        .map((item) => ({
            label: item.title ?? "",
            icon: item.icon ?? "",
            accent: resolveAccent(item.variant),
        }));

    // Fallback temporal (ver FRONTEND_NEXTJS_SITE_V3.md #41).
    const values = apiValues.length > 0 ? apiValues : defaultCoreValues;

    return (
        <section className="py-16 bg-white">
            <Container>
                {/* Antes esta seccion no mostraba section_title/subtitle/
                    description en ningun lado — se agrega aca. */}
                <SectionHeading
                    subtitle={section.section_subtitle}
                    title={section.section_title}
                    description={section.section_description}
                    className="text-center mb-10"
                />
                <div className="grid md:grid-cols-2 gap-6">
                    <MissionVisionCard
                        title={mission?.title ?? "Misión"}
                        icon={mission?.icon ?? "fa-solid fa-bullseye"}
                        accent={mission ? resolveAccent(mission.variant) : "red"}
                        text={
                            mission?.description ??
                            "Fabricar muebles y soluciones de carpintería a medida, con materiales de calidad y acabados cuidados, acompañando a cada cliente desde la idea hasta la instalación final."
                        }
                    />

                    <MissionVisionCard
                        title={vision?.title ?? "Visión"}
                        icon={vision?.icon ?? "fa-solid fa-eye"}
                        accent={vision ? resolveAccent(vision.variant) : "gold"}
                        text={
                            vision?.description ??
                            "Ser la carpintería de referencia de la región, reconocida por la calidad de su trabajo, la puntualidad de sus entregas y la confianza que construye con cada proyecto."
                        }
                    />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
                    {values.map((value) => (
                        <CoreValueCard key={value.label} value={value} />
                    ))}
                </div>
            </Container>
        </section>
    );
}
