// features/service/ui/shared/NumberedHeading.tsx
//
// Cabecera de las secciones numeradas de Servicios ("01 Muebles a medida", "02 Restauración"):
// número subrayado en amarillo (section_subtitle), título (section_title) y párrafo
// (section_description). Cada línea solo se pinta si tiene texto.
// Título y descripción usan el estándar del sitio (sectionHeading.styles.ts); solo el número
// tiene su estilo propio.
import { headingStyles as hs } from "@/shared/components/section_heading/sectionHeading.styles";

type Props = {
    number: string | null;
    title: string | null;
    description: string | null;
    // "center" para el carrusel de categorías; "left" para restauración.
    align: "center" | "left";
    // true = sobre fondo oscuro (textos claros).
    dark?: boolean;
};

export default function NumberedHeading({ number, title, description, align, dark = false }: Props) {
    const isCenter = align === "center";

    return (
        <div
            className={`flex flex-col gap-3.5 ${isCenter ? "mx-auto max-w-[620px] items-center text-center" : "items-start"}`}
        >
            {number && (
                <span
                    className={`il-display border-b-[3px] border-brand-gold pb-1.5 text-[13px] font-extrabold tracking-[.06em] md:text-[15px] ${
                        dark ? "text-white" : "text-il-neutro-900"
                    }`}
                >
                    {number}
                </span>
            )}
            {title && (
                <h2 className={`${hs.title} ${hs.sectionTitleSize} ${hs.titleColor[dark ? "dark" : "light"]}`}>
                    {title}
                </h2>
            )}
            {description && (
                <p className={`${hs.description} ${hs.descriptionColor[dark ? "dark" : "light"]}`}>
                    {description}
                </p>
            )}
        </div>
    );
}
