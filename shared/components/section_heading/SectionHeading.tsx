// shared/components/section_heading/SectionHeading.tsx
//
// Encabezado ESTÁNDAR de una sección: eyebrow (section_subtitle) + título (section_title) +
// descripción (section_description). Mismo estilo en todo el sitio (ver sectionHeading.styles.ts):
//
//   ▬▬  NUESTRO PROCESO          <- rojo del logo + rayita amarilla
//   Así trabajamos contigo       <- negro, se achica en celular
//   Desde la medida hasta...     <- gris
//
// REGLA: ninguno de los 3 es obligatorio, y NINGUNO se rellena con texto inventado por el
// frontend. Si un campo viene null/vacío, esa línea NO se pinta. Si los 3 vienen vacíos, el
// componente no renderiza nada.
//
// Opciones:
//   align: "center" (por defecto) o "left".
//   tone:  "light" (fondo claro, por defecto) o "dark" (fondo oscuro: textos claros).
//   as:    "h2" (por defecto), "h1" para el título principal de una página (más grande),
//          o "h3" si la sección va dentro de otra.
//
// markElements: true (por defecto) pone data-el="header-subtitle|header-title|header-description"
// en cada línea (anclas del grupo "Encabezado" de la Apariencia, la vista previa del intranet
// las resalta). Pasar false cuando los textos NO son los de la sección (ej. bloques fijos del
// detalle de un trabajo), para no confundir el resaltado.
//
// *ClassName: SOLO para portadas (hero sobre foto, ej. Section1 del Home), que tienen su propio
// diseño grande. Las secciones normales NO deben pasarlos, así todas se ven iguales.
import { headingStyles as s, type HeadingTone } from "./sectionHeading.styles";

type Props = {
    subtitle?: string | null;
    title?: string | null;
    description?: string | null;
    align?: "center" | "left";
    tone?: HeadingTone;
    as?: "h1" | "h2" | "h3";
    markElements?: boolean;
    className?: string;
    subtitleClassName?: string;
    titleClassName?: string;
    descriptionClassName?: string;
};

export default function SectionHeading({
    subtitle,
    title,
    description,
    align = "center",
    tone = "light",
    as: TitleTag = "h2",
    markElements = true,
    className = "",
    subtitleClassName,
    titleClassName,
    descriptionClassName,
}: Props) {
    if (!subtitle && !title && !description) {
        return null;
    }

    const isCenter = align === "center";
    const titleSize = TitleTag === "h1" ? s.pageTitleSize : s.sectionTitleSize;
    // undefined = React no pinta el atributo.
    const el = (name: string) => (markElements ? name : undefined);

    return (
        <div className={`flex flex-col gap-3 ${isCenter ? "items-center text-center" : "items-start text-left"} ${className}`}>
            {subtitle &&
                (subtitleClassName ? (
                    <p data-el={el("header-subtitle")} className={subtitleClassName}>
                        {subtitle}
                    </p>
                ) : (
                    <p data-el={el("header-subtitle")} className={`m-0 ${s.eyebrow} ${s.eyebrowColor[tone]}`}>
                        <span aria-hidden="true" className={s.eyebrowBar} />
                        {subtitle}
                    </p>
                ))}

            {title && (
                <TitleTag data-el={el("header-title")} className={titleClassName ?? `${s.title} ${titleSize} ${s.titleColor[tone]}`}>
                    {title}
                </TitleTag>
            )}

            {description && (
                <p data-el={el("header-description")} className={descriptionClassName ?? `${s.description} ${s.descriptionColor[tone]} ${isCenter ? "mx-auto" : ""}`}>
                    {description}
                </p>
            )}
        </div>
    );
}
