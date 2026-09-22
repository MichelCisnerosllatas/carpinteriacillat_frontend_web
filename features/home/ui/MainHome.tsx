// features/home/ui/MainHome.tsx
//
// Ya no arma el Home a mano (Section1, Section4, SectionProcess...) en un
// orden fijo escrito aca: lee la navegacion "/" del store de Zustand
// (hidratado una sola vez en app/providers.tsx con el JSON que trajo
// app/layout.tsx) y pinta sus secciones en el orden que ya llego
// (section_order), delegando en SectionRenderer que componente usar para
// cada section_type.
"use client";

import { useSiteStore } from "@/shared/store/site/useSiteStore";
import { findSiteNavigationByUrl } from "@/shared/services/site_service/lib/findSiteNavigation";
import { normalizeSections } from "@/shared/services/site_service/lib/normalizeSectionContent";
import SectionRenderer from "@/shared/components/section_renderer/SectionRenderer";

export default function MainHome() {
    // null = /v1/public/site fallo (ver app/layout.tsx) o esta navegacion
    // no existe/esta desactivada. No hay fallback hardcodeado para todo el
    // Home: si esto viene null, se prefiere no mostrar nada a mostrar un
    // Home "de mentira" con contenido inventado.
    const site = useSiteStore((s) => s.site);
    const navigation = site ? findSiteNavigationByUrl(site.navigations, "/") ?? null : null;

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
