// shared/components/section_heading/SectionHeading.tsx
//
// Encabezado estandar de una seccion: subtitulo (eyebrow) + titulo +
// descripcion — section_subtitle / section_title / section_description.
//
// REGLA (pedida explicitamente): ninguno de los 3 es obligatorio, y
// NINGUNO se rellena con texto inventado por el frontend. Si un campo
// viene null/vacio, esa linea NO se pinta — no queda un <h2> o <p> vacio
// reservando espacio en el documento. Si los 3 vienen vacios, el
// componente entero no renderiza nada (ni siquiera el div contenedor).
//
// Cada seccion tiene su propia tipografia/color ya definidos desde antes
// de esta migracion — se pasan por *ClassName para no perder esa
// identidad visual section por seccion; los defaults son solo un estilo
// neutro para secciones que nunca tuvieron uno propio (ver Section4,
// WeValuesSection, GalleryPhoto).

type Props = {
    subtitle?: string | null;
    title?: string | null;
    description?: string | null;
    className?: string;
    subtitleClassName?: string;
    titleClassName?: string;
    descriptionClassName?: string;
};

export default function SectionHeading({
    subtitle,
    title,
    description,
    className,
    subtitleClassName = "text-sm uppercase tracking-[0.2em] text-red-600 font-semibold",
    titleClassName = "text-3xl md:text-4xl font-extrabold text-gray-900 mt-2",
    descriptionClassName = "text-gray-600 mt-3 max-w-2xl mx-auto",
}: Props) {
    if (!subtitle && !title && !description) {
        return null;
    }

    return (
        <div className={className}>
            {subtitle && <p className={subtitleClassName}>{subtitle}</p>}
            {title && <h2 className={titleClassName}>{title}</h2>}
            {description && <p className={descriptionClassName}>{description}</p>}
        </div>
    );
}
