// features/gallery/ui/MainGallery.tsx
//
// Mismo patron que features/home/ui/MainHome.tsx.
import type { SiteNavigationDto } from "@/shared/services/site_service/model/siteget.dto";
import { normalizeSections } from "@/shared/services/site_service/lib/normalizeSectionContent";
import SectionRenderer from "@/shared/components/section_renderer/SectionRenderer";

type Props = {
    navigation: SiteNavigationDto | null;
};

export default function MainGallery({ navigation }: Props) {
    if (!navigation) {
        return null;
    }

    const sections = normalizeSections(navigation.sections);
    console.info("Galeria ======================");
    console.info(JSON.stringify(sections));

    return (
        <main>
            {sections.map((section) => (
                <SectionRenderer key={section.id_section} section={section} />
            ))}
        </main>
    );
}
