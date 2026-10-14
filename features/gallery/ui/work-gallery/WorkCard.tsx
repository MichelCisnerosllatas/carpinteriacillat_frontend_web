// features/gallery/ui/work-gallery/WorkCard.tsx
//
// Tarjeta de un trabajo en la galería: foto grande + 3 miniaturas a la derecha y el enlace
// "Ver aquí →" abajo. Si el trabajo tiene más de 4 fotos, la 3ª miniatura lleva un velo
// "+N" (fotos que no entran); el detalle (/gallery/{id}) las muestra todas.
//
// Navegación (un solo link, accesible): el <Link> "Ver aquí" estira su ::after
// (after:absolute after:inset-0) sobre TODA la tarjeta, así tocar cualquier parte lleva a
// /gallery/{id}. Las miniaturas y el botón "ver en grande" van con "relative z-10" para quedar
// por encima de ese ::after y hacer lo suyo.
//
// Con mouse (escritorio):
//   - Pasar por una miniatura cambia la foto grande (fundido); al salir vuelve a la portada.
//   - Clic en una miniatura -> /gallery/{id}?foto=k (abre directo en esa foto).
// En celular (sin hover):
//   - Tocar una miniatura cambia la foto grande (no navega).
//   - La tarjeta que está en el medio de la pantalla se "levanta" (como el hover) y va
//     rotando sus fotos sola cada 2,5 s.
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
import { formatPrice } from "@/features/gallery/lib/formatPrice";
import { formatRating } from "@/features/gallery/lib/formatRating";
import type { SiteWorkDto } from "@/shared/services/site_service/model/siteget.dto";

type Props = {
    work: SiteWorkDto;
    index: number; // posición en la grilla, para alternar el color de fondo
};

const MAX_THUMBS = 3;
const ROTATE_MS = 2500; // celular: cada cuánto cambia de foto la tarjeta centrada

function detailHref(id: number, photoIndex: number): string {
    return photoIndex > 0 ? `/gallery/${id}?foto=${photoIndex}` : `/gallery/${id}`;
}

export default function WorkCard({ work, index }: Props) {
    const router = useRouter();
    const [previewIndex, setPreviewIndex] = useState(0); // foto que muestra la parte grande
    const lightbox = useLightboxState();

    const title = getWorkTitle(work);
    const photos = getWorkPhotos(work);
    const thumbs = photos.slice(1, 1 + MAX_THUMBS);
    // Fotos que no entran en la tarjeta (portada + 3). Se avisan con "+N" en la última miniatura.
    const hiddenCount = Math.max(photos.length - (1 + MAX_THUMBS), 0);
    const testimonies = work.testimonies ?? [];

    // Celular: ¿esta tarjeta está en el medio de la pantalla?
    const canHover = useCanHover();
    const reducedMotion = useReducedMotion();
    const cardRef = useRef<HTMLElement>(null);
    const lifted = useInViewCenter(cardRef, !canHover);

    // Celular: la tarjeta centrada rota sus fotos sola (se pausa con el lightbox abierto).
    const photoCount = photos.length;
    useEffect(() => {
        if (!lifted || reducedMotion || lightbox.isOpen || photoCount < 2) return;
        const timer = window.setTimeout(() => setPreviewIndex((i) => (i + 1) % photoCount), ROTATE_MS);
        return () => window.clearTimeout(timer);
    }, [lifted, reducedMotion, lightbox.isOpen, photoCount, previewIndex]);

    const photoLabel = previewIndex > 0 ? `Foto ${previewIndex + 1} de ${photos.length}` : `Portada · ${photos.length} fotos`;
    const meta = [work.wood?.name, work.location].filter(Boolean).join(" · ");
    const rating = testimonies.length > 0 ? formatRating(work.rating_avg) : null;
    const price = formatPrice(work.price_approx);

    // Efecto "levantada": fijo en celular si está centrada; con mouse, solo al pasar por encima.
    const cardClass = lifted
        ? "-translate-y-1 shadow-[0_20px_44px_rgba(20,24,31,.12)]"
        : "hover:-translate-y-1 hover:shadow-[0_20px_44px_rgba(20,24,31,.12)]";
    const shapeClass = lifted ? "rounded-[20px_56px_20px_56px]" : "rounded-[20px] group-hover:rounded-[20px_56px_20px_56px]";
    const zoomClass = lifted ? "scale-105" : "group-hover:scale-105";

    function handleThumbClick(photoIndex: number) {
        // Con mouse se navega (como antes); en celular solo se cambia la foto grande.
        if (canHover) router.push(detailHref(work.id_furniture, photoIndex));
        else setPreviewIndex(photoIndex);
    }

    return (
        <article
            ref={cardRef}
            onMouseLeave={() => canHover && setPreviewIndex(0)}
            className={`group relative flex flex-col gap-3 rounded-[26px] border border-il-neutro-200 bg-white p-2.5 ${cardClass}`}
            style={{ transition: `box-shadow 400ms, transform 400ms ${EASE_IL}` }}
        >
            <div className="grid aspect-[4/3.2] grid-cols-[3fr_1fr] grid-rows-[repeat(3,minmax(0,1fr))] gap-1.5">
                <div
                    className={`relative row-span-3 overflow-hidden ${shapeClass} ${thumbs.length === 0 ? "col-span-2" : ""}`}
                    style={{ background: toneAt(index), transition: `border-radius 800ms ${EASE_IL}` }}
                >
                    <div className={`absolute inset-0 ${zoomClass}`} style={{ transition: `transform 1s ${EASE_IL}` }}>
                        <PhotoLayers photos={photos} activeIndex={previewIndex} fadeMs={450} />
                    </div>
                    {work.category?.name && (
                        <span className="il-display pointer-events-none absolute left-3 top-3 whitespace-nowrap rounded-full bg-white px-3 py-[5px] text-[13px] font-bold text-il-neutro-900">
                            {work.category.name}
                        </span>
                    )}
                    {photos.length > 0 && (
                        <>
                            <span className="pointer-events-none absolute bottom-3 left-3 whitespace-nowrap rounded-full bg-[rgba(20,24,31,.82)] px-3 py-[5px] text-[13px] font-semibold text-white">
                                {photoLabel}
                            </span>
                            <ExpandPhotoButton onClick={() => lightbox.open(previewIndex)} className="absolute right-3 top-3 z-10" />
                        </>
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
                            onMouseEnter={() => canHover && setPreviewIndex(photoIndex)}
                            onFocus={() => setPreviewIndex(photoIndex)}
                            onClick={() => handleThumbClick(photoIndex)}
                            aria-label={showMore ? `${baseLabel}. Ver ${hiddenCount} fotos más` : baseLabel}
                            aria-pressed={isOn}
                            className="relative z-10 cursor-pointer overflow-hidden rounded-xl border-0 p-0"
                            style={{ background: toneAt(index + photoIndex) }}
                        >
                            <CoverImage url={photo.url} alt="" />
                            {showMore && (
                                // Velo oscuro con "+N": el detalle del trabajo muestra todas.
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
                {work.style && (
                    <span className="il-display text-xs font-bold uppercase tracking-[.14em] text-il-neutro-600">{work.style}</span>
                )}
                <h3 className="il-display m-0 text-lg font-bold leading-[1.3] tracking-[-0.02em]">{title}</h3>
                {meta && <span className="text-[15px] text-il-neutro-600">{meta}</span>}

                {(rating || price) && (
                    <div className="mt-1.5 flex items-center justify-between gap-3 border-t border-il-neutro-200 pt-3">
                        {rating ? (
                            <span className="inline-flex items-center gap-1.5 text-[15px]">
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
                            <span className="text-[15px] text-il-neutro-600">
                                Aprox. <strong className="il-display text-il-neutro-900">{price}</strong>
                            </span>
                        )}
                    </div>
                )}

                {/* Link principal: su ::after cubre toda la tarjeta (ver comentario de arriba). */}
                <Link
                    href={detailHref(work.id_furniture, previewIndex)}
                    aria-label={`Ver aquí: ${title}`}
                    className="il-display mt-1 self-start text-[15px] font-bold text-il-amarillo-600 underline-offset-4 after:absolute after:inset-0 after:rounded-[26px] hover:underline focus-visible:underline"
                >
                    Ver aquí →
                </Link>
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
