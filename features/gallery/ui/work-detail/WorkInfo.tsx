// features/gallery/ui/work-detail/WorkInfo.tsx
//
// Columna de datos del detalle: etiquetas (estilo, fecha de entrega), título, descripción,
// ficha técnica, precio aproximado y botones "Siguiente trabajo" / "Más de {categoría}".
// Queda fija (sticky) al bajar, justo debajo del header.
//
// Cualquier dato que el admin no haya completado simplemente no se muestra (nada de "—").

import Link from "next/link";
import { formatMonthYear } from "@/features/gallery/lib/formatMonthYear";
import { formatPrice } from "@/features/gallery/lib/formatPrice";
import { getWorkTitle } from "@/shared/services/site_service/lib/workPhotos";
import { headingStyles as hs } from "@/shared/components/section_heading/sectionHeading.styles";
import type { SiteWorkDto } from "@/shared/services/site_service/model/siteget.dto";

type Props = {
    work: SiteWorkDto;
    nextWork: SiteWorkDto | null;
};

export default function WorkInfo({ work, nextWork }: Props) {
    const deliveredAt = formatMonthYear(work.delivered_at);
    const price = formatPrice(work.price_approx);
    const categoryName = work.category?.name ?? null;

    // [nombre, valor] — se quitan las filas sin valor.
    const specs = [
        ["Madera", work.wood?.name],
        ["Medidas", work.measures],
        ["Acabado", work.finish],
        ["Fabricación", work.build_time],
        ["Lugar", work.location],
        ["Categoría", categoryName],
    ].filter((row): row is [string, string] => Boolean(row[1]));

    return (
        <div className="sticky flex min-w-0 flex-col gap-6" style={{ top: "calc(var(--app-header-height, 0px) + 16px)" }}>
            {(work.style || deliveredAt) && (
                <div className="flex flex-wrap gap-2">
                    {work.style && (
                        <span className="il-display rounded-full bg-il-amarillo-500 px-3.5 py-1.5 text-sm font-bold text-il-neutro-900">
                            Estilo {work.style}
                        </span>
                    )}
                    {deliveredAt && (
                        <span className="rounded-full bg-il-neutro-100 px-3.5 py-1.5 text-sm text-il-neutro-700">Entregado en {deliveredAt}</span>
                    )}
                </div>
            )}

            <h1 className={`${hs.title} ${hs.pageTitleSize} ${hs.titleColor.light}`}>
                {getWorkTitle(work)}
            </h1>

            {work.description && <p className="m-0 text-base leading-[1.6] text-il-neutro-600">{work.description}</p>}

            {specs.length > 0 && (
                <dl className="m-0 grid grid-cols-2 border-t border-il-neutro-200">
                    {specs.map(([label, value]) => (
                        <div key={label} className="flex flex-col gap-0.5 border-b border-il-neutro-200 py-3.5 pr-3">
                            <dt className="il-display text-[13px] font-bold uppercase tracking-[.1em] text-il-neutro-600">{label}</dt>
                            <dd className="m-0 text-[17px] text-il-neutro-900">{value}</dd>
                        </div>
                    ))}
                </dl>
            )}

            {price && (
                <div className="flex flex-wrap items-baseline gap-2.5">
                    <span className="text-[15px] text-il-neutro-600">Precio aproximado</span>
                    <span className="il-display text-2xl font-extrabold tracking-[-0.02em]">{price}</span>
                    <span className="text-sm text-il-neutro-600">· varía según medidas y madera</span>
                </div>
            )}

            <div className="flex flex-wrap gap-3">
                {nextWork && (
                    <Link
                        href={`/gallery/${nextWork.id_furniture}`}
                        className="il-display inline-flex min-h-14 flex-[1_1_240px] items-center justify-between gap-3 rounded-full bg-brand-gold text-black hover:bg-brand-gold-dark py-0 pl-[26px] pr-2.5 text-base font-bold transition-colors"
                    >
                        Siguiente trabajo
                        <span aria-hidden="true" className="inline-flex size-[38px] items-center justify-center rounded-full bg-white text-black">
                            →
                        </span>
                    </Link>
                )}
                {categoryName && (
                    <Link
                        href={`/gallery?cat=${encodeURIComponent(categoryName)}`}
                        className="il-display inline-flex min-h-14 items-center rounded-full border-[1.5px] border-il-neutro-300 bg-white px-[22px] text-base font-bold text-il-neutro-900 transition-colors hover:border-brand-gold"
                    >
                        Más de {categoryName}
                    </Link>
                )}
            </div>
        </div>
    );
}
