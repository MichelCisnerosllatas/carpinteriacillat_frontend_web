// features/service/ui/category-coverflow/CoverflowCard.tsx
//
// Una tarjeta del carrusel 3D de categorías. Su posición depende de `offset`: cuántos lugares
// está de la tarjeta del centro (0 = centro, -1 = a la izquierda, 2 = dos a la derecha…).
// Con ese número se calcula el desplazamiento, el giro 3D, el tamaño y la opacidad, y CSS
// anima el cambio (igual que el diseño).
//
// Efecto "hover" de la tarjeta del centro (zoom + esquinas tipo hoja):
//   - Con mouse: al pasar el mouse.
//   - En celular: cuando la tarjeta está en el medio de la pantalla (useInViewCenter).
"use client";

import { useRef } from "react";
import Link from "next/link";
import PhotoLayers from "@/shared/ui/photo-layers/PhotoLayers";
import PhotoFan from "@/shared/ui/photo-fan/PhotoFan";
import ExpandPhotoButton from "@/shared/ui/expand-photo-button/ExpandPhotoButton";
import { EASE_IL } from "@/shared/lib/ilDesign";
import { PREVIEW_ANCHOR_STYLE } from "@/shared/lib/previewAnchor";
import { useCanHover } from "@/shared/lib/useCanHover";
import { useInViewCenter } from "@/shared/lib/useInViewCenter";
import type { CategoryCard, CoverflowCardShow } from "@/features/service/lib/categoryCard";

type Props = {
    card: CategoryCard;
    offset: number;
    tone: string;
    isMobile: boolean;
    show: CoverflowCardShow; // qué partes de la tarjeta se pintan (Apariencia, grupo "card")
    mainPhoto: number;
    onPickPhoto: (index: number) => void;
    onPick: () => void;
    onExpand: () => void; // abre la foto actual en grande
};

export default function CoverflowCard({ card, offset, tone, isMobile, show, mainPhoto, onPickPhoto, onPick, onExpand }: Props) {
    const distance = Math.abs(offset);
    const isCenter = offset === 0;
    const isHidden = distance > 2; // más allá de 2 lugares no se ve

    // En celular, la tarjeta del centro se "levanta" cuando está en el medio de la pantalla.
    const canHover = useCanHover();
    const cardRef = useRef<HTMLDivElement>(null);
    const inCenter = useInViewCenter(cardRef, isCenter && !canHover);
    const lifted = isCenter && inCenter;

    // En móvil las tarjetas se separan un poco más (son más angostas respecto a la pantalla).
    const shiftPercent = offset * (isMobile ? 70 : 64);
    const transform = `translateX(calc(-50% + ${shiftPercent}%)) rotateY(${-offset * 28}deg) scale(${1 - distance * 0.13})`;

    const name = card.name.toLowerCase();

    // Esquinas y zoom: fijos si está "levantada" (celular); si no, solo al pasar el mouse.
    const shapeClass = lifted
        ? "rounded-[56px_20px_56px_20px]"
        : `rounded-[20px] ${isCenter ? "group-hover:rounded-[56px_20px_56px_20px]" : ""}`;
    const zoomClass = lifted ? "scale-105" : isCenter ? "group-hover:scale-105" : "";

    return (
        <div
            ref={cardRef}
            // Ancla de la vista previa del intranet ("section-item-<id>"); solo en tarjetas de items.
            id={card.anchorId}
            className="group absolute left-1/2 top-0 h-full w-[68%] min-[760px]:w-[340px]"
            style={{
                ...PREVIEW_ANCHOR_STYLE,
                transform,
                zIndex: 10 - distance,
                opacity: isHidden ? 0 : 1 - distance * 0.22,
                pointerEvents: isHidden ? "none" : "auto",
                transition: `transform 800ms ${EASE_IL}, opacity 600ms`,
            }}
        >
            <div
                className={`absolute inset-0 overflow-hidden shadow-[0_24px_50px_rgba(20,24,31,.16)] ${shapeClass}`}
                style={{ background: tone, transition: `border-radius 800ms ${EASE_IL}` }}
            >
                {/* Zoom suave al pasar el mouse, solo en la tarjeta del centro. */}
                <div className={`absolute inset-0 ${zoomClass}`} style={{ transition: `transform 1s ${EASE_IL}` }}>
                    <PhotoLayers photos={card.photos} activeIndex={mainPhoto} />
                </div>

                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(0deg,rgba(20,24,31,.86)_0%,rgba(20,24,31,0)_50%)]" />

                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-[22px]">
                    <div className="pointer-events-none flex flex-col gap-1">
                        {show.count && (
                            <span data-el="coverflow-card-count" className="il-display text-xs font-bold tracking-[.14em] text-il-amarillo-500">
                                {card.count} {card.count === 1 ? "TRABAJO" : "TRABAJOS"}
                            </span>
                        )}
                        {show.title && (
                            <span data-el="coverflow-card-title" className="il-display text-[22px] font-extrabold tracking-[-0.02em] text-white">
                                {card.name}
                            </span>
                        )}
                    </div>
                    <div className="flex flex-none items-center gap-2">
                        {/* Ver en grande: solo en la tarjeta del centro (el abanico está arriba a la izquierda). */}
                        {show.expand && isCenter && card.photos.length > 0 && <ExpandPhotoButton onClick={onExpand} dataEl="coverflow-card-expand" />}
                        {show.link && (
                            <Link
                                href={`/gallery?cat=${encodeURIComponent(card.name)}`}
                                aria-label={`Ver trabajos de ${name}`}
                                data-el="coverflow-card-link"
                                tabIndex={isCenter ? undefined : -1}
                                className="inline-flex size-12 flex-none items-center justify-center rounded-full bg-il-amarillo-500 text-lg text-il-neutro-900 hover:scale-110"
                                style={{
                                    opacity: isCenter ? 1 : 0,
                                    pointerEvents: isCenter ? "auto" : "none",
                                    transition: "opacity 400ms, transform 300ms",
                                }}
                            >
                                →
                            </Link>
                        )}
                    </div>
                </div>

                {/* Las tarjetas de los costados son un botón para traerlas al centro. */}
                <button
                    type="button"
                    onClick={onPick}
                    aria-label={`Mostrar ${name}`}
                    tabIndex={isCenter ? -1 : undefined}
                    className="absolute inset-0 cursor-pointer border-0 bg-transparent"
                    style={{ pointerEvents: isCenter ? "none" : "auto" }}
                />

                {show.thumbs && (
                    <PhotoFan
                        photos={card.photos}
                        selected={mainPhoto}
                        onSelect={onPickPhoto}
                        visible={isCenter}
                        side="left"
                        dataEl="coverflow-card-thumbs"
                    />
                )}
            </div>
        </div>
    );
}
