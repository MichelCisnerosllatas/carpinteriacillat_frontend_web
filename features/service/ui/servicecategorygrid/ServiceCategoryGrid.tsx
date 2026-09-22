// features/service/ui/servicecategorygrid/ServiceCategoryGrid.tsx
//
// section_type === "category_grid" (estandarizado en el backend — antes
// esto vivia mal-metido dentro de "service_carousel", obligando al
// frontend a "adivinar" la UI mirando item_type; ahora tiene su propio
// type porque NO es un carrusel). Cada item (item_type "category") trae su
// propia sub-lista en item.details.
import Servicelabeltitle from "@/widget/services/mainzservicewidget/servicelabeltitle";
import ServiceGridHouseWidget from "@/widget/services/houseservicewidget/ServiceGridHouseWidget";
import Container from "@/shared/ui/container/Container";
import { normalizeDetails, normalizeItems } from "@/shared/services/site_service/lib/normalizeSectionContent";
import type { SiteSectionDto } from "@/shared/services/site_service/model/siteget.dto";
import type { ServiceCardHouseWidgetProps } from "@/widget/services/houseservicewidget/type/ServiceCardHouseWidgetProps";

type Props = {
    section: SiteSectionDto;
};

// Fallback temporal (ver FRONTEND_NEXTJS_SITE_V3.md #41).
const FALLBACK_ITEMS: ServiceCardHouseWidgetProps[] = [
    {
        title: "Muebles de Dormitorio",
        icono: "fa-solid fa-bed",
        listadescripcion: [{ title: "Camas y cabeceras" }, { title: "Mesas de noche" }, { title: "Cómodas y cajoneras" }],
    },
    {
        title: "Sala de Estar",
        icono: "fa-solid fa-tv",
        listadescripcion: [{ title: "Muebles para TV" }, { title: "Estanterías y libreros" }, { title: "Mesas de centro" }],
    },
    {
        title: "Comedor",
        icono: "fa-solid fa-utensils",
        listadescripcion: [{ title: "Mesas de comedor" }, { title: "Sillas y bancos" }, { title: "Vitrinas y buffets" }],
    },
    {
        title: "Baño",
        icono: "fa-solid fa-bath",
        listadescripcion: [{ title: "Muebles de baño" }, { title: "Gabinetes y vanitorios" }, { title: "Repisas y organizadores" }],
    },
    {
        title: "Espacios Exteriores",
        icono: "fa-solid fa-warehouse",
        listadescripcion: [{ title: "Pérgolas y decks" }, { title: "Muebles de jardín" }, { title: "Cercas y portones" }],
    },
    {
        title: "Habitación Infantil",
        icono: "fa-solid fa-child",
        listadescripcion: [{ title: "Camas infantiles" }, { title: "Escritorios y sillas" }, { title: "Jugueteros" }],
    },
];

export default function ServiceCategoryGrid({ section }: Props) {
    const apiItems: ServiceCardHouseWidgetProps[] = normalizeItems(section.items).map((item) => ({
        title: item.title ?? "",
        icono: item.icon ?? "",
        listadescripcion: normalizeDetails(item.details).map((detail) => ({ title: detail.title ?? "" })),
    }));

    const items = apiItems.length > 0 ? apiItems : FALLBACK_ITEMS;

    const hasHeading = section.section_subtitle || section.section_title || section.section_description;

    return (
        <section className="py-10">
            <Container>
                {/* section_title/subtitle/description: cada linea solo se
                    pinta si tiene contenido real (antes "Carpintería para
                    el Hogar" era un fallback fijo). */}
                {hasHeading && (
                    <div className="mb-4">
                        {section.section_subtitle && (
                            <p className="text-xs uppercase tracking-[0.2em] text-gray-500 font-semibold mb-1">
                                {section.section_subtitle}
                            </p>
                        )}
                        {section.section_title && <Servicelabeltitle title={section.section_title} />}
                        {section.section_description && (
                            <p className="text-gray-600 mt-2 max-w-2xl">{section.section_description}</p>
                        )}
                    </div>
                )}
                <ServiceGridHouseWidget items={items} />
            </Container>
        </section>
    );
}
