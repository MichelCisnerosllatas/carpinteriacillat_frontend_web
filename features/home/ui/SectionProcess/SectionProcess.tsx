// features/home/ui/SectionProcess/SectionProcess.tsx
import Container from "@/shared/ui/container/Container";
import { normalizeItems } from "@/shared/services/site_service/lib/normalizeSectionContent";
import type { SiteSectionDto } from "@/shared/services/site_service/model/siteget.dto";

type Step = {
    number: string;
    title: string;
    description: string;
    icon: string;
};

// Fallback temporal: se muestra solo si la seccion "process" todavia no
// tiene items cargados en el backend (ver FRONTEND_NEXTJS_SITE_V3.md #41).
const FALLBACK_STEPS: Step[] = [
    {
        number: "01",
        title: "Consulta y Medidas",
        description: "Conversamos sobre tu proyecto y tomamos las medidas exactas del espacio.",
        icon: "fa-solid fa-comments",
    },
    {
        number: "02",
        title: "Diseño Personalizado",
        description: "Diseñamos la pieza a tu medida, ajustando estilo, materiales y acabados.",
        icon: "fa-solid fa-pen-ruler",
    },
    {
        number: "03",
        title: "Fabricación",
        description: "Nuestro equipo fabrica cada pieza a mano, con control de calidad en cada paso.",
        icon: "fa-solid fa-hammer",
    },
    {
        number: "04",
        title: "Instalación y Garantía",
        description: "Instalamos en tu hogar o negocio y respaldamos el trabajo con garantía.",
        icon: "fa-solid fa-truck-fast",
    },
];

type Props = {
    // section_type === "process". Mapeo: number <- item.label, title <-
    // item.title, description <- item.description, icon <- item.icon
    // (ver FRONTEND_NEXTJS_SITE_V3.md #23).
    section: SiteSectionDto;
};

export default function SectionProcess({ section }: Props) {
    const apiSteps = normalizeItems(section.items).map((item) => ({
        number: item.label ?? "",
        title: item.title ?? "",
        description: item.description ?? "",
        icon: item.icon ?? "",
    }));

    const steps = apiSteps.length > 0 ? apiSteps : FALLBACK_STEPS;

    return (
        <section id="proceso" className="py-16 bg-white">
            <Container>
                <div className="text-center mb-10">
                    <p className="text-sm uppercase tracking-[0.2em] text-brand-red font-semibold">
                        {section.section_subtitle ?? "Nuestro Proceso"}
                    </p>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-2">
                        {section.section_title ?? "Cómo Trabajamos"}
                    </h2>
                    <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
                        {section.section_description ??
                            "De la idea al mueble terminado, en cuatro pasos claros y acompañados en todo momento."}
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {steps.map((step, index) => (
                        <div
                            key={`${step.number}-${index}`}
                            className="relative bg-white rounded-2xl border border-slate-200 p-6 text-center hover:shadow-md hover:-translate-y-[1px] transition-all"
                        >
                            <span className="absolute top-4 right-5 text-3xl font-extrabold text-gray-100">
                                {step.number}
                            </span>

                            <div className="relative w-14 h-14 mx-auto rounded-xl flex items-center justify-center bg-brand-red/10">
                                <i className={`${step.icon} text-2xl text-brand-red`} />
                            </div>

                            <h3 className="relative mt-5 text-lg font-bold text-slate-900">
                                {step.title}
                            </h3>
                            <p className="relative mt-2 text-sm text-slate-600 leading-relaxed">
                                {step.description}
                            </p>
                        </div>
                    ))}
                </div>
            </Container>
        </section>
    );
}
