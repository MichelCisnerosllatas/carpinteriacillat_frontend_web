// home/ui/section4/Section4.tsx
import Container from "@/shared/ui/container/Container";
import { defaultWhyUsItems } from "@/widget/whyus/model/mock";
import WhyUsCard from "@/widget/whyus/ui/WhyUsCard";
import { normalizeItems } from "@/shared/services/site_service/lib/normalizeSectionContent";
import type { SiteSectionDto } from "@/shared/services/site_service/model/siteget.dto";

type Props = {
    // section_type === "feature_grid". Ver FRONTEND_NEXTJS_SITE_V3.md #22.
    section: SiteSectionDto;
};

export default function Section4({ section }: Props) {
    const apiItems = normalizeItems(section.items).map((item) => ({
        title: item.title ?? "",
        text: item.description ?? "",
        icon: item.icon ?? "",
    }));

    // Fallback temporal mientras el backend no tenga cargados los items de
    // esta seccion (ver FRONTEND_NEXTJS_SITE_V3.md #41).
    const items = apiItems.length > 0 ? apiItems : defaultWhyUsItems;

    return (
        <section className="py-16 bg-gray-100">
            <Container className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {items.map((item) => (
                    <WhyUsCard key={item.title} item={item} />
                ))}
            </Container>
        </section>
    );
}
