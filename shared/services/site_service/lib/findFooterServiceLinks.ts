// shared/services/site_service/lib/findFooterServiceLinks.ts
//
// La columna "Servicios" del footer (ver Footer.tsx) antes tenia 5 links escritos a mano, que
// duplicaban a ojo los section_items reales de la seccion "home-services" (mismo carrusel de
// servicios del home) — mismo problema que resolvio findFloatingWhatsapp.ts para el boton de
// WhatsApp: en vez de una tabla/columna nueva, se reutiliza contenido que YA es administrable
// desde el intranet (Secciones > home-services > Items), asi agregar/quitar/renombrar un
// servicio ahi tambien actualiza el footer, sin tocar codigo.
//
// `sectionitem_link` viene vacio para estos items (no hay pagina propia por servicio todavia),
// asi que el fallback es el mismo anchor "#servicios" que ya usaba el footer hardcodeado.

import type { SiteDataDto } from "../model/siteget.dto";

export type FooterServiceLink = {
    href: string;
    label: string;
};

const SERVICES_SECTION_KEY = "home-services";
const SERVICES_FALLBACK_HREF = "/#servicios";

export function findFooterServiceLinks(site: SiteDataDto | null): FooterServiceLink[] {
    if (!site) return [];

    for (const navigation of site.navigations) {
        const section = navigation.sections.find((s) => s.section_key === SERVICES_SECTION_KEY);
        if (!section) continue;

        return section.items
            .filter((item) => item.state && item.title)
            .map((item) => ({
                href: item.link || SERVICES_FALLBACK_HREF,
                label: item.title as string,
            }));
    }

    return [];
}
