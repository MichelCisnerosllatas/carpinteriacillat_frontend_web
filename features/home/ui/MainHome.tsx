// features/home/ui/MainHome.tsx
//
// Ya no arma el Home a mano (Section1, Section4, SectionProcess...) en un
// orden fijo escrito aca: recibe la navegacion "/" que ya trajo
// app/page.tsx (desde getSite(), el mismo JSON que uso app/layout.tsx para
// Header/Footer) y pinta sus secciones en el orden que ya llego
// (section_order), delegando en SectionRenderer que componente usar para
// cada section_type.

import type { SiteNavigationDto } from "@/shared/services/site_service/model/siteget.dto";
import { normalizeSections } from "@/shared/services/site_service/lib/normalizeSectionContent";
import SectionRenderer from "@/shared/components/section_renderer/SectionRenderer";

type Props = {
    // null = /v1/public/site fallo (ver app/page.tsx) o esta navegacion no
    // existe/esta desactivada. No hay fallback hardcodeado para todo el
    // Home: si esto viene null, se prefiere no mostrar nada a mostrar un
    // Home "de mentira" con contenido inventado.
    navigation: SiteNavigationDto | null;
};

export default function MainHome({ navigation }: Props) {
    if (!navigation) {
        return null;
    }

    const sections = normalizeSections(navigation.sections);
    console.info("Inicio ======================");
    console.info(JSON.stringify(sections));


    return (
        <main>
            {sections.map((section) => (
                <SectionRenderer key={section.id_section} section={section} />
            ))}
        </main>
    );
}
