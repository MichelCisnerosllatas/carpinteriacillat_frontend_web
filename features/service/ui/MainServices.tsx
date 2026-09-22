// features/service/ui/MainServices.tsx
//
// Mismo patron que features/home/ui/MainHome.tsx: lee la navegacion
// "/services" del store de Zustand y pinta sus secciones en el orden que
// ya llego (section_order), delegando en SectionRenderer que componente
// usar para cada section_type.
"use client";

import { useSiteStore } from "@/shared/store/site/useSiteStore";
import { findSiteNavigationByUrl } from "@/shared/services/site_service/lib/findSiteNavigation";
import { normalizeSections } from "@/shared/services/site_service/lib/normalizeSectionContent";
import SectionRenderer from "@/shared/components/section_renderer/SectionRenderer";

export default function MainServices() {
    const site = useSiteStore((s) => s.site);
    const navigation = site ? findSiteNavigationByUrl(site.navigations, "/services") ?? null : null;

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
