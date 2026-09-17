// features/service/ui/servicegrid/ServiceGrid.tsx
//
// Antes existian DOS componentes casi identicos: ServicesMain.tsx
// ("Servicios Principales", tema dorado) y ServiceComercial.tsx
// ("Carpintería Comercial", tema rojo). SectionRenderer solo puede elegir
// UN componente por section_type, y ambas secciones en el backend son la
// MISMA forma de contenido (titulo + grid de icono/titulo/descripcion) —
// se unifican en un solo componente, section_type === "service_grid", que
// decide su tema con section.section_variant ("red" | lo que sea -> oro).
import Servicelabeltitle from "@/widget/services/mainzservicewidget/servicelabeltitle";
import ServicesGrid from "@/widget/services/mainzservicewidget/ServicesGrid";
import Container from "@/shared/ui/container/Container";
import { normalizeItems } from "@/shared/services/site_service/lib/normalizeSectionContent";
import type { SiteSectionDto } from "@/shared/services/site_service/model/siteget.dto";

type Props = {
    section: SiteSectionDto;
};

// Las clases Tailwind del tema viven aca — el backend solo manda el
// string en section_variant, nunca clases CSS (mismo criterio que
// Section1.tsx con los botones del hero).
const THEME = {
    red: { barColor: "bg-brand-red", iconBgClass: "bg-brand-red/10", iconColorClass: "text-brand-red" },
    gold: { barColor: "bg-brand-gold", iconBgClass: "bg-brand-gold/10", iconColorClass: "text-brand-gold-dark" },
} as const;

// Fallbacks temporales (ver FRONTEND_NEXTJS_SITE_V3.md #41): se elige uno
// u otro segun el tema, para no perder fidelidad visual mientras el
// backend no tenga cargados los items de esta seccion en particular.
const FALLBACK_MAIN = [
    { title: "Muebles a Medida", description: "Diseño y fabricación personalizada", iconClass: "fa-solid fa-couch" },
    { title: "Cocinas Integrales", description: "Diseño moderno y funcional", iconClass: "fa-solid fa-kitchen-set" },
    { title: "Closets & Vestidores", description: "Organización inteligente", iconClass: "fa-solid fa-door-closed" },
    { title: "Puertas & Ventanas", description: "Instalación y fabricación", iconClass: "fa-solid fa-warehouse" },
];

const FALLBACK_COMERCIAL = [
    { title: "Locales Comerciales", description: "Mostradores, vitrinas, displays", iconClass: "fa-solid fa-store" },
    { title: "Oficinas", description: "Escritorios, recepción, salas", iconClass: "fa-solid fa-building" },
    { title: "Hoteles & Restaurantes", description: "Mobiliario a gran escala", iconClass: "fa-solid fa-hotel" },
    { title: "Proyectos Corporativos", description: "Ambientación completa", iconClass: "fa-solid fa-briefcase" },
];

export default function ServiceGrid({ section }: Props) {
    const isRed = section.section_variant === "red";
    const theme = isRed ? THEME.red : THEME.gold;
    const fallbackItems = isRed ? FALLBACK_COMERCIAL : FALLBACK_MAIN;

    const apiItems = normalizeItems(section.items).map((item) => ({
        id: item.id_section_item,
        title: item.title ?? "",
        description: item.description ?? "",
        iconClass: item.icon ?? "",
        iconBgClass: theme.iconBgClass,
        iconColorClass: theme.iconColorClass,
    }));

    const items = apiItems.length > 0
        ? apiItems
        : fallbackItems.map((item, index) => ({
              id: index,
              ...item,
              iconBgClass: theme.iconBgClass,
              iconColorClass: theme.iconColorClass,
          }));

    const title = section.section_title ?? (isRed ? "Carpintería Comercial" : "Servicios Principales");

    return (
        <section className="py-10">
            <Container>
                <Servicelabeltitle title={title} barColor={theme.barColor} />
                <ServicesGrid items={items} />
            </Container>
        </section>
    );
}
