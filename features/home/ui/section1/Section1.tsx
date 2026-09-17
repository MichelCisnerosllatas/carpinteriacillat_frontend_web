// home/ui/section1/Section1.tsx
import Container from "@/shared/ui/container/Container";
import HeroSlideshow from "@/widget/homehero/ui/HeroSlideshow";
import Counter from "@/widget/homehero/ui/Counter";
import { heroSlides, heroStats } from "@/widget/homehero/model/mock";
import {
    normalizeButtons,
    normalizeImages,
    normalizeItems,
} from "@/shared/services/site_service/lib/normalizeSectionContent";
import { resolveImageFit } from "@/shared/services/site_service/lib/resolveImageFit";
import type { SiteSectionDto } from "@/shared/services/site_service/model/siteget.dto";

type Props = {
    // section_type === "hero". Ver FRONTEND_NEXTJS_SITE_V3.md #21.
    section: SiteSectionDto;
};

// Unico par de variantes visuales que usa este Hero hoy: "secondary" es el
// boton translucido, cualquier otro valor (incluido null) cae en el rojo
// "primary". El backend solo manda el string en button.variant — las
// clases CSS reales viven aca, nunca vienen de Laravel (ver
// FRONTEND_NEXTJS_SITE_V3.md #54).
const BUTTON_PRIMARY_CLASS = "bg-red-600 hover:bg-red-700 text-white shadow-2xl hover:shadow-red-500/50 hover:scale-105";
const BUTTON_SECONDARY_CLASS = "bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border-2 border-white/30";

export default function Section1({ section }: Props) {
    // Slides: si la seccion todavia no tiene imagenes cargadas en el
    // backend, se usa el mock local como respaldo temporal (fallback, ver
    // FRONTEND_NEXTJS_SITE_V3.md #41 — se retira cuando /site este
    // estable con contenido real en todas las secciones).
    const apiImages = normalizeImages(section.images);
    const slides = apiImages.length > 0
        ? apiImages.map((image) => ({ src: image.url, alt: image.alt ?? "", fit: resolveImageFit(image.fix) }))
        : heroSlides;

    // Estadisticas: items con item_type === "stat".
    const apiStats = normalizeItems(section.items)
        .filter((item) => item.item_type === "stat")
        .map((item) => ({
            target: Number(item.value ?? 0),
            suffix: item.suffix ?? undefined,
            label: item.label ?? "",
        }));
    const stats = apiStats.length > 0 ? apiStats : heroStats;

    const buttons = normalizeButtons(section.buttons);

    const title = section.section_title ?? "Creamos Espacios Extraordinarios";
    const description =
        section.section_description ??
        "Fabricación de muebles a medida con diseños únicos y calidad premium. Transformamos tus ideas en realidad con más de 15 años de experiencia.";

    return (
        <section id="inicio" className="relative py-20 overflow-hidden flex items-center min-h-screen">
            {/* Carrusel de fondo */}
            <HeroSlideshow slides={slides} />

            {/* Contenido Hero */}
            {/* padding-top dinámico: el header fijo (banners + navbar) puede
                medir bastante más en mobile que en desktop, ver Header.tsx */}
            <Container
                className="relative z-10 w-full"
                style={{ paddingTop: "calc(var(--app-header-height, 6rem) + 1.5rem)" }}
            >
                <div className="max-w-3xl">
                    <h2 className="text-4xl md:text-7xl font-extrabold text-white mb-6 leading-tight">
                        {title}
                    </h2>
                    <p className="text-xl text-gray-200 mb-8 leading-relaxed">
                        {description}
                    </p>
                    <div className="flex flex-wrap gap-4">
                        {buttons.length > 0 ? (
                            buttons.map((button) => (
                                <a
                                    key={button.id_section_button}
                                    href={button.url ?? "#"}
                                    className={`${button.variant === "secondary" ? BUTTON_SECONDARY_CLASS : BUTTON_PRIMARY_CLASS} px-8 py-4 rounded-full font-bold text-lg transition-all`}
                                >
                                    {button.icon && <i className={`${button.icon} mr-2`} />}
                                    {button.label}
                                </a>
                            ))
                        ) : (
                            <>
                                <a
                                    href="#contacto"
                                    className={`${BUTTON_PRIMARY_CLASS} px-8 py-4 rounded-full font-bold text-lg transition-all`}
                                >
                                    <i className="fas fa-phone-alt mr-2" />
                                    Cotizar Ahora
                                </a>
                                <a
                                    href="#galeria"
                                    className={`${BUTTON_SECONDARY_CLASS} px-8 py-4 rounded-full font-bold text-lg transition-all`}
                                >
                                    <i className="fas fa-images mr-2" />
                                    Ver Trabajos
                                </a>
                            </>
                        )}
                    </div>

                    {/* Stats con contadores */}
                    <div className="grid grid-cols-3 gap-6 mt-5">
                        {stats.map((stat) => (
                            <div key={stat.label} className="text-center">
                                <div className="text-4xl font-bold text-amber-400 mb-1">
                                    <Counter target={stat.target} suffix={stat.suffix} />
                                </div>
                                <div className="text-gray-300 text-sm">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </Container>
        </section>
    );
}
