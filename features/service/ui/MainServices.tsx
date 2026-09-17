// features/service/ui/MainServices.tsx
//
// Mismo patron que features/home/ui/MainHome.tsx: recibe la navegacion
// "/services" ya traida por app/services/page.tsx (desde getSite()) y
// pinta sus secciones en el orden que ya llego (section_order), delegando
// en SectionRenderer que componente usar para cada section_type.
import type { SiteNavigationDto } from "@/shared/services/site_service/model/siteget.dto";
import { normalizeSections } from "@/shared/services/site_service/lib/normalizeSectionContent";
import SectionRenderer from "@/shared/components/section_renderer/SectionRenderer";

type Props = {
    navigation: SiteNavigationDto | null;
};

export default function MainServices({ navigation }: Props) {
    if (!navigation) {
        return null;
    }

    const sections = normalizeSections(navigation.sections);
    console.info("Servicio ======================");
    console.info(JSON.stringify(sections));

    return (
        <main>
            {sections.map((section) => (
                <SectionRenderer key={section.id_section} section={section} />
            ))}
        </main>
    );
}
