// features/gallery/ui/work-detail/WorkInfo.tsx
//
// Columna de datos del detalle: etiquetas (estilo, fecha de entrega), título, descripción,
// ficha técnica, precio aproximado, botón de contacto («Cotizar uno similar») y botones
// "Siguiente trabajo" / "Más de {categoría}". Queda fija (sticky) al bajar, justo debajo del header.
//
// Qué se muestra y sus textos vienen de la Apariencia (grupo "info"; el contacto, del grupo
// "contact" ya resuelto en WorkDetail). La ficha técnica sigue el orden, los nombres y las filas
// visibles de info.specs.
//
// Cualquier dato que el admin no haya completado simplemente no se muestra (nada de "—").

import Link from "next/link";
import { formatMonthYear } from "@/features/gallery/lib/formatMonthYear";
import { formatPrice } from "@/features/gallery/lib/formatPrice";
import { DEFAULT_DETAIL_SETTINGS, type ContactTarget, type DetailInfoSettings } from "@/features/gallery/lib/workGallerySettings";
import { getWorkTitle } from "@/shared/services/site_service/lib/workPhotos";
import { headingStyles as hs } from "@/shared/components/section_heading/sectionHeading.styles";
import type { SiteWorkDto } from "@/shared/services/site_service/model/siteget.dto";

type WorkContact = {
    href: string;
    label: string;
    target: ContactTarget;
};

type Props = {
    work: SiteWorkDto;
    nextWork: SiteWorkDto | null;
    settings?: DetailInfoSettings;
    // Botón «Cotizar uno similar» (null = no se pinta).
    contact?: WorkContact | null;
};

// Valor de cada fila de la ficha técnica según su key (ver DEFAULT_SPEC_ROWS). Key desconocida → sin dato.
function specValue(work: SiteWorkDto, key: string): string | null | undefined {
    switch (key) {
        case "wood":
            return work.wood?.name;
        case "measures":
            return work.measures;
        case "finish":
            return work.finish;
        case "build_time":
            return work.build_time;
        case "location":
            return work.location;
        case "category":
            return work.category?.name;
        default:
            return null;
    }
}

export default function WorkInfo({ work, nextWork, settings = DEFAULT_DETAIL_SETTINGS.info, contact = null }: Props) {
    const deliveredAt = settings.showMeta ? formatMonthYear(work.delivered_at) : null;
    const style = settings.showMeta ? work.style : null;
    // Precio apagado en el intranet → como si no tuviera precio (no se pinta).
    const price = settings.showPrice ? formatPrice(work.price_approx) : null;
    const categoryName = work.category?.name ?? null;

    // [key, nombre, valor] en el orden del intranet — se quitan las filas ocultas y las sin valor.
    const specs = settings.specs
        .filter((row) => row.visible)
        .map((row) => ({ key: row.key, label: row.label, value: specValue(work, row.key) }))
        .filter((row): row is { key: string; label: string; value: string } => Boolean(row.value));

    // Enlaces externos (WhatsApp o un http…) se abren en otra pestaña.
    const isExternal = contact ? /^https?:\/\//i.test(contact.href) : false;

    return (
        <div className="sticky flex min-w-0 flex-col gap-6" style={{ top: "calc(var(--app-header-height, 0px) + 16px)" }}>
            {(style || deliveredAt) && (
                <div data-el="detail-meta" className="flex flex-wrap gap-2">
                    {style && (
                        <span className="il-display rounded-full bg-il-amarillo-500 px-3.5 py-1.5 text-sm font-bold text-il-neutro-900">
                            Estilo {style}
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

            {settings.showDescription && work.description && (
                <p data-el="detail-description" className="m-0 text-base leading-[1.6] text-il-neutro-600">
                    {work.description}
                </p>
            )}

            {settings.showSpecs && specs.length > 0 && (
                <dl data-el="detail-specs" className="m-0 grid grid-cols-2 border-t border-il-neutro-200">
                    {specs.map((row) => (
                        <div key={row.key} className="flex flex-col gap-0.5 border-b border-il-neutro-200 py-3.5 pr-3">
                            <dt className="il-display text-[13px] font-bold uppercase tracking-[.1em] text-il-neutro-600">{row.label}</dt>
                            <dd className="m-0 text-[17px] text-il-neutro-900">{row.value}</dd>
                        </div>
                    ))}
                </dl>
            )}

            {price && (
                <div data-el="detail-price" className="flex flex-wrap items-baseline gap-2.5">
                    {settings.priceLabel && <span className="text-[15px] text-il-neutro-600">{settings.priceLabel}</span>}
                    <span className="il-display text-2xl font-extrabold tracking-[-0.02em]">{price}</span>
                    {settings.priceNote && <span className="text-sm text-il-neutro-600">· {settings.priceNote}</span>}
                </div>
            )}

            {contact && (
                <a
                    href={contact.href}
                    data-el="detail-contact"
                    target={isExternal ? "_blank" : undefined}
                    rel={isExternal ? "noopener noreferrer" : undefined}
                    className="il-display inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-il-neutro-900 px-[26px] text-base font-bold text-white transition-colors hover:bg-il-neutro-700"
                >
                    <i className={contact.target === "whatsapp" ? "fab fa-whatsapp text-xl" : "fas fa-arrow-right text-sm"} aria-hidden="true" />
                    {contact.label}
                </a>
            )}

            {((settings.showNext && nextWork) || (settings.showMoreCategory && categoryName)) && (
                <div className="flex flex-wrap gap-3">
                    {settings.showNext && nextWork && (
                        <Link
                            href={`/gallery/${nextWork.id_web_work}`}
                            data-el="detail-next"
                            className="il-display inline-flex min-h-14 flex-[1_1_240px] items-center justify-between gap-3 rounded-full bg-brand-gold text-black hover:bg-brand-gold-dark py-0 pl-[26px] pr-2.5 text-base font-bold transition-colors"
                        >
                            {settings.nextLabel}
                            <span aria-hidden="true" className="inline-flex size-[38px] items-center justify-center rounded-full bg-white text-black">
                                →
                            </span>
                        </Link>
                    )}
                    {settings.showMoreCategory && categoryName && (
                        <Link
                            href={`/gallery?cat=${encodeURIComponent(categoryName)}`}
                            data-el="detail-more-category"
                            className="il-display inline-flex min-h-14 items-center rounded-full border-[1.5px] border-il-neutro-300 bg-white px-[22px] text-base font-bold text-il-neutro-900 transition-colors hover:border-brand-gold"
                        >
                            {settings.moreCategoryLabel} {categoryName}
                        </Link>
                    )}
                </div>
            )}
        </div>
    );
}
