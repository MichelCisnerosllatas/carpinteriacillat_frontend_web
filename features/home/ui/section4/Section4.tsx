// home/ui/section4/Section4.tsx
import Container from "@/shared/ui/container/Container";
import { defaultWhyUsItems } from "@/widget/whyus/model/mock";
import WhyUsCard from "@/widget/whyus/ui/WhyUsCard";
import { normalizeItems } from "@/shared/services/site_service/lib/normalizeSectionContent";
import SectionHeading from "@/shared/components/section_heading/SectionHeading";
import type { SiteSectionDto } from "@/shared/services/site_service/model/siteget.dto";
import { previewAnchorId, PREVIEW_ANCHOR_STYLE } from "@/shared/lib/previewAnchor";

type Props = {
    // section_type === "feature_grid". Ver FRONTEND_NEXTJS_SITE_V3.md #22.
    section: SiteSectionDto;
};

export default function Section4({ section }: Props) {
    const apiItems = normalizeItems(section.items).map((item) => ({
        id: item.id_section_item as number | undefined,
        title: item.title ?? "",
        text: item.description ?? "",
        icon: item.icon ?? "",
    }));

    // Fallback temporal mientras el backend no tenga cargados los items de
    // esta seccion (ver FRONTEND_NEXTJS_SITE_V3.md #41).
    const items = apiItems.length > 0 ? apiItems : defaultWhyUsItems.map((item) => ({ ...item, id: undefined }));

    return (
        <section className="py-16 bg-gray-100">
            <Container>
                {/* Antes esta seccion no mostraba section_title/subtitle/
                    description en ningun lado — se agrega aca. */}
                <SectionHeading
                    subtitle={section.section_subtitle}
                    title={section.section_title}
                    description={section.section_description}
                    className="text-center mb-10"
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {items.map((item) => (
                        <div key={item.title} id={previewAnchorId("section-item", item.id)} style={PREVIEW_ANCHOR_STYLE}>
                            <WhyUsCard item={item} />
                        </div>
                    ))}
                </div>
            </Container>
        </section>
    );
}
