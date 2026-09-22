// features/gallery/ui/MainGallery.tsx
//
// Mismo patron que features/home/ui/MainHome.tsx.
"use client";

import { useSiteStore } from "@/shared/store/site/useSiteStore";
import { findSiteNavigationByUrl } from "@/shared/services/site_service/lib/findSiteNavigation";
import { normalizeSections } from "@/shared/services/site_service/lib/normalizeSectionContent";
import SectionRenderer from "@/shared/components/section_renderer/SectionRenderer";

export default function MainGallery() {
    const site = useSiteStore((s) => s.site);
    const navigation = site ? findSiteNavigationByUrl(site.navigations, "/gallery") ?? null : null;

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
