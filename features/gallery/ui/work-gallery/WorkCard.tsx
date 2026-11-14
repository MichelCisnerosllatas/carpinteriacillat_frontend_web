// features/gallery/ui/work-gallery/WorkCard.tsx
//
// Tarjeta de un trabajo en la galería: foto grande + N miniaturas a la derecha (3 por defecto,
// Apariencia card.thumbs_max) y el enlace "Ver aquí →" abajo. Si el trabajo tiene más fotos de
// las que entran, la última miniatura lleva un velo "+N"; el detalle (/gallery/{id}) las
// muestra todas.
//
// Qué partes se pintan y sus textos («Aprox.», «Ver aquí») vienen de la Apariencia de la
// sección (grupo "card", lo calcula WorkGallery). Cada parte lleva su ancla data-el.
//
// Navegación (un solo link, accesible): el <Link> "Ver aquí" estira su ::after
// (after:absolute after:inset-0) sobre TODA la tarjeta, así tocar cualquier parte lleva a
// /gallery/{id}. Las miniaturas y el botón "ver en grande" van con "relative z-10" para quedar
// por encima de ese ::after y hacer lo suyo.
//
// Miniaturas (igual en escritorio y celular): tocar/clic en una miniatura SOLO cambia la foto
// grande, nunca navega al detalle. La miniatura con "+N" abre el visor a pantalla completa
// para ver todas las fotos sin salir de la galería.
//
// Con mouse (escritorio):
//   - Pasar por una miniatura la muestra en grande (fundido); al salir vuelve a la que se
//     eligió con clic (o a la portada si no se eligió ninguna).
// Si el trabajo es una restauración, lleva una etiqueta amarilla con el nombre de su tipo
// ("Restauración") junto a la de categoría (apagable con card.show_type_badge).
//
// En celular (sin hover):
//   - La tarjeta que está en el medio de la pantalla se "levanta" (como el hover) y va
//     rotando sus fotos sola cada 2,5 s (apagable con card.autorotate_mobile).
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import PhotoLayers from "@/shared/ui/photo-layers/PhotoLayers";
import CoverImage from "@/shared/ui/cover-image/CoverImage";
import ExpandPhotoButton from "@/shared/ui/expand-photo-button/ExpandPhotoButton";
import PhotoLightbox from "@/shared/ui/photo-lightbox/PhotoLightbox";
import { toLightboxSlides } from "@/shared/ui/photo-lightbox/toLightboxSlides";
import { EASE_IL, toneAt } from "@/shared/lib/ilDesign";
import { useCanHover } from "@/shared/lib/useCanHover";
import { useInViewCenter } from "@/shared/lib/useInViewCenter";
import { useReducedMotion } from "@/shared/lib/useReducedMotion";
import { useLightboxState } from "@/shared/lib/useLightboxState";
import { getWorkPhotos, getWorkTitle } from "@/shared/services/site_service/lib/workPhotos";
import { getWorkTypeName, isRestorationWork } from "@/shared/services/site_service/lib/workTypes";
import { formatPrice } from "@/features/gallery/lib/formatPrice";
import { formatRating } from "@/features/gallery/lib/formatRating";
import { DEFAULT_LISTING_SETTINGS, type WorkCardSettings } from "@/features/gallery/lib/workGallerySettings";
import type { SiteWorkDto } from "@/shared/services/site_service/model/siteget.dto";

type Props = {
    work: SiteWorkDto;
    index: number; // posición en la grilla, para alternar el color de fondo
    // Apariencia de la tarjeta (grupo "card" de la sección, lo calcula WorkGallery).
    settings?: WorkCardSettings;
};

const ROTATE_MS = 2500; // celular: cada cuánto cambia de foto la tarjeta centrada

function detailHref(id: number, photoIndex: number): string {
    return photoIndex > 0 ? `/gallery/${id}?foto=${photoIndex}` : `/gallery/${id}`;
}

export default function WorkCard({ work, index, settings = DEFAULT_LISTING_SETTINGS.card }: Props) {
    const [previewIndex, setPreviewIndex] = useState(0); // foto que muestra la parte grande
    // Foto elegida con clic: al sacar el mouse de la tarjeta se vuelve a esta (no a la portada).
    const [pinnedIndex, setPinnedIndex] = useState(0);
    const lightbox = useLightboxState();

    const title = getWorkTitle(work);
    const photos = getWorkPhotos(work);
    // Miniaturas apagadas en el intranet → lista vacía (la foto grande ocupa todo el ancho).
    const maxThumbs = settings.thumbsMax;
    const thumbs = settings.showThumbs ? photos.slice(1, 1 + maxThumbs) : [];
    // Fotos que no entran en la tarjeta (portada + miniaturas). Se avisan con "+N" en la última miniatura.
    const hiddenCount = Math.max(photos.length - (1 + maxThumbs), 0);
    const testimonies = work.testimonies ?? [];
    // Etiqueta de tipo: solo para restauraciones (la fabricación es lo "normal" de la galería).
    const typeBadge = settings.showTypeBadge && isRestorationWork(work) ? getWorkTypeName(work) : null;
    const categoryBadge = settings.showCategory ? work.category?.name : null;

    // Celular: ¿esta tarjeta está en el medio de la pantalla?
    const canHover = useCanHover();
    const reducedMotion = useReducedMotion();
    const cardRef = useRef<HTMLElement>(null);
    const lifted = useInViewCenter(cardRef, !canHover);

    // Celular: la tarjeta centrada rota sus fotos sola (se pausa con el lightbox abierto).
    // Si el intranet apagó card.autorotate_mobile, no rota (se cambia tocando las miniaturas).
    const photoCount = photos.length;
    const autorotate = settings.autorotateMobile;
    useEffect(() => {
        if (!autorotate || !lifted || reducedMotion || lightbox.isOpen || photoCount < 2) return;
        const timer = window.setTimeout(() => setPreviewIndex((i) => (i + 1) % photoCount), ROTATE_MS);
        return () => window.clearTimeout(timer);
    }, [autorotate, lifted, reducedMotion, lightbox.isOpen, photoCount, previewIndex]);

    const photoLabel = previewIndex > 0 ? `Foto ${previewIndex + 1} de ${photos.length}` : `Portada · ${photos.length} fotos`;
    // Lo que el intranet apagó queda vacío/null y no se pinta.
    const meta = settings.showMeta ? [work.wood?.name, work.location].filter(Boolean).join(" · ") : "";
    const rating = settings.showRating && testimonies.length > 0 ? formatRating(work.rating_avg) : null;
    const price = settings.showPrice ? formatPrice(work.price_approx) : null;

    // Efecto "levantada": fijo en celular si está centrada; con mouse, solo al pasar por encima.
    const cardClass = lifted
        ? "-translate-y-1 shadow-[0_20px_44px_rgba(20,24,31,.12)]"
        : "hover:-translate-y-1 hover:shadow-[0_20px_44px_rgba(20,24,31,.12)]";
    const shapeClass = lifted ? "rounded-[20px_56px_20px_56px]" : "rounded-[20px] group-hover:rounded-[20px_56px_20px_56px]";
    const zoomClass = lifted ? "scale-105" : "group-hover:scale-105";

    // Clic/toque en una miniatura: nunca navega. La de "+N" abre el visor a pantalla completa
    // (para ver todas las fotos); las demás quedan elegidas como foto grande.
    function handleThumbClick(photoIndex: number, isMore: boolean) {
        if (isMore) {
            lightbox.open(photoIndex);
            return;
        }
        setPreviewIndex(photoIndex);
        setPinnedIndex(photoIndex);
    }

    return (
        <article
            ref={cardRef}
            onMouseLeave={() => canHover && setPreviewIndex(pinnedIndex)}
            className={`group relative flex flex-col gap-3 rounded-[26px] border border-il-neutro-200 bg-white p-2.5 ${cardClass}`}
            style={{ transition: `box-shadow 400ms, transform 400ms ${EASE_IL}` }}
        >
            <div className="grid aspect-[4/3.2] grid-cols-[3fr_1fr] grid-rows-[repeat(3,minmax(0,1fr))] gap-1.5">
                <div
                    data-el="card-photo"
                    className={`relative row-span-3 overflow-hidden ${shapeClass} ${thumbs.length === 0 ? "col-span-2" : ""}`}
                    style={{ background: toneAt(index), transition: `border-radius 800ms ${EASE_IL}` }}
                >
                    <div className={`absolute inset-0 ${zoomClass}`} style={{ transition: `transform 1s ${EASE_IL}` }}>
                        <PhotoLayers photos={photos} activeIndex={previewIndex} fadeMs={450} />
                    </div>
                    {(typeBadge || categoryBadge) && (
                        // right-14: deja libre la esquina del botón "ver en grande".
                        <div className="pointer-events-none absolute left-3 right-14 top-3 flex flex-wrap gap-1.5">
                            {typeBadge && (
                                <span data-el="card-type-badge" className="il-display whitespace-nowrap rounded-full bg-il-amarillo-500 px-3 py-[5px] text-[13px] font-bold text-il-neutro-900">
                                    {typeBadge}
                                </span>
                            )}
                            {categoryBadge && (
                                <span data-el="card-category" className="il-display whitespace-nowrap rounded-full bg-white px-3 py-[5px] text-[13px] font-bold text-il-neutro-900">
                                    {categoryBadge}
                                </span>
                            )}
                        </div>
                    )}
                    {settings.showPhotoCount && photos.length > 0 && (
                        <span data-el="card-photo-count" className="pointer-events-none absolute bottom-3 left-3 whitespace-nowrap rounded-full bg-[rgba(20,24,31,.82)] px-3 py-[5px] text-[13px] font-semibold text-white">
                            {photoLabel}
                        </span>
                    )}
                    {settings.showExpand && photos.length > 0 && (
                        <ExpandPhotoButton onClick={() => lightbox.open(previewIndex)} className="absolute right-3 top-3 z-10" dataEl="card-expand" />
                    )}
                </div>

                {thumbs.map((photo, j) => {
                    const photoIndex = j + 1; // la 0 es la portada (parte grande)
                    const isOn = previewIndex === photoIndex;
                    // La última miniatura lleva el velo "+N" si sobran fotos.
                    const showMore = hiddenCount > 0 && j === thumbs.length - 1;
                    const baseLabel = `${title}: ${photo.caption || `foto ${photoIndex + 1}`}`;
                    return (
                        <button
                            key={`${photo.url}-${photoIndex}`}
                            type="button"
                            data-el="card-thumbs"
                            onMouseEnter={() => canHover && setPreviewIndex(photoIndex)}
                            onFocus={() => setPreviewIndex(photoIndex)}
                            onClick={() => handleThumbClick(photoIndex, showMore)}
                            aria-label={showMore ? `${baseLabel}. Ver todas las fotos (${hiddenCount} más)` : `Ver en grande: ${baseLabel}`}
                            aria-pressed={isOn}
                            className="relative z-10 cursor-pointer overflow-hidden rounded-xl border-0 p-0"
                            style={{ background: toneAt(index + photoIndex) }}
                        >
                            <CoverImage url={photo.url} alt="" />
                            {showMore && (
                                // Velo oscuro con "+N": al tocarla se abre el visor con todas las fotos.
                                <span
                                    aria-hidden="true"
                                    className="il-display pointer-events-none absolute inset-0 flex items-center justify-center bg-[rgba(20,24,31,.6)] text-lg font-extrabold text-white"
                                >
                                    +{hiddenCount}
                                </span>
                            )}
                            <span
                                className="pointer-events-none absolute inset-0 rounded-xl transition-shadow duration-200"
                                style={{ boxShadow: `inset 0 0 0 3px ${isOn ? "var(--color-il-amarillo-500)" : "transparent"}` }}
                            />
                        </button>
                    );
                })}
            </div>

            <div className="flex flex-col gap-1.5 px-2 pb-1.5 pt-1">
                {settings.showStyle && work.style && (
                    <span data-el="card-style" className="il-display text-xs font-bold uppercase tracking-[.14em] text-il-neutro-600">{work.style}</span>
                )}
                <h3 className="il-display m-0 text-lg font-bold leading-[1.3] tracking-[-0.02em]">{title}</h3>
                {meta && (
                    <span data-el="card-meta" className="text-[15px] text-il-neutro-600">
                        {meta}
                    </span>
                )}

                {(rating || price) && (
                    <div className="mt-1.5 flex items-center justify-between gap-3 border-t border-il-neutro-200 pt-3">
                        {rating ? (
                            <span data-el="card-rating" className="inline-flex items-center gap-1.5 text-[15px]">
                                <span aria-hidden="true" className="text-il-amarillo-600">
                                    ★
                                </span>
                                <strong className="il-display">{rating}</strong>
                                <span className="text-il-neutro-600">({testimonies.length})</span>
                            </span>
                        ) : (
                            <span />
                        )}
                        {price && (
                            <span data-el="card-price" className="text-[15px] text-il-neutro-600">
                                {settings.pricePrefix && `${settings.pricePrefix} `}
                                <strong className="il-display text-il-neutro-900">{price}</strong>
                            </span>
                        )}
                    </div>
                )}

                {/* Link principal: su ::after cubre toda la tarjeta (ver comentario de arriba).
                    Si el intranet apaga el enlace (card.show_link), el link se queda SIN texto visible: la
                    tarjeta sigue llevando al detalle, solo desaparece el enlace amarillo. */}
                {settings.showLink ? (
                    <Link
                        href={detailHref(work.id_web_work, previewIndex)}
                        aria-label={`${settings.linkLabel}: ${title}`}
                        data-el="card-link"
                        className="il-display mt-1 self-start text-[15px] font-bold text-il-amarillo-600 underline-offset-4 after:absolute after:inset-0 after:rounded-[26px] hover:underline focus-visible:underline"
                    >
                        {settings.linkLabel} →
                    </Link>
                ) : (
                    <Link
                        href={detailHref(work.id_web_work, previewIndex)}
                        aria-label={`Ver: ${title}`}
                        // absolute: cubre la tarjeta igual que el ::after y no ocupa lugar en la columna.
                        className="absolute inset-0 rounded-[26px]"
                    />
                )}
            </div>

            {/* El lightbox no tiene padres con eventos de puntero que molesten acá. */}
            <PhotoLightbox
                slides={toLightboxSlides(photos)}
                index={lightbox.index}
                open={lightbox.isOpen}
                onClose={lightbox.close}
            />
        </article>
    );
}
