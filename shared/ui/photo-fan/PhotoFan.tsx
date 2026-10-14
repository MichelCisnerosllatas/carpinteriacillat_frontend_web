// shared/ui/photo-fan/PhotoFan.tsx
//
// El "abanico" de miniaturas del diseño (función fanOf): las fotos se ven apiladas y algo
// giradas en una esquina; al pasar el mouse se abren en fila. La foto elegida lleva borde
// amarillo y queda encima. Lo usan el hero de Servicios (esquina derecha, hasta 5) y el
// carrusel de categorías (esquina izquierda, hasta 4).
//
// En celular/tablet (sin hover) el abanico queda siempre abierto en el panel/tarjeta activa,
// y tocar una miniatura cambia la foto.
//
// Si hay más fotos que `maxVisible`, la última miniatura se cambia por una ficha "+N"
// (PhotoFanMore) que avisa cuántas fotos no entraron.
"use client";

import { useState } from "react";
import CoverImage from "@/shared/ui/cover-image/CoverImage";
import PhotoFanMore from "./PhotoFanMore";
import { EASE_IL } from "@/shared/lib/ilDesign";
import { useCanHover } from "@/shared/lib/useCanHover";
import type { Photo } from "@/shared/lib/photo";

type Props = {
    photos: Photo[];
    selected: number;
    onSelect: (index: number) => void;
    // Solo se muestra en el panel/tarjeta activa; en las demás queda invisible y sin clics.
    visible: boolean;
    side: "left" | "right";
    // Cuántas fichas se dibujan como máximo (contando la "+N"). Por defecto 4.
    maxVisible?: number;
    // Al tocar la ficha "+N": recibe el índice de la primera foto que no entró.
    // Si no se pasa, la ficha simplemente elige esa foto.
    onMoreClick?: (startIndex: number) => void;
};

const THUMB_WIDTH = 62;
const GAP_CLOSED = 10; // separación con el abanico cerrado (apiladas)

// Separación entre miniaturas con el abanico abierto. Con 5 se juntan un poco para que
// el abanico no tape el botón "ver en grande" ni se salga del panel en celular.
function openGap(canHover: boolean, count: number): number {
    if (canHover) return count > 4 ? 50 : 56; // con mouse
    return count > 4 ? 38 : 46; // celular (siempre abierto)
}

export default function PhotoFan({ photos, selected, onSelect, visible, side, maxVisible = 4, onMoreClick }: Props) {
    const canHover = useCanHover();
    const [hoverOpen, setHoverOpen] = useState(false);

    // Con una sola foto no hay nada que elegir.
    if (photos.length < 2) return null;

    // ¿Sobran fotos? Entonces se muestran (maxVisible - 1) miniaturas + la ficha "+N".
    const hasMore = photos.length > maxVisible;
    const shownPhotos = hasMore ? photos.slice(0, maxVisible - 1) : photos;
    const firstHidden = shownPhotos.length; // índice de la primera foto que no entró
    const hiddenCount = photos.length - firstHidden;
    const count = hasMore ? maxVisible : photos.length; // fichas que se dibujan

    // Con mouse se abre al pasar por encima; sin mouse (celular) está siempre abierto.
    const open = canHover ? hoverOpen : true;
    const middle = (count - 1) / 2;
    const gap = open ? openGap(canHover, count) : GAP_CLOSED;

    // Posición y giro de la ficha número k (igual para miniaturas y para la "+N").
    function placeStyle(k: number, isSelected: boolean) {
        // Gira más cuando está cerrado (se ve como un mazo de cartas) y casi nada abierto.
        const rotation = (k - middle) * (open ? 3 : 7);
        const lift = open && isSelected ? -6 : 0;
        return {
            top: 4,
            left: side === "left" ? k * gap : undefined,
            right: side === "right" ? k * gap : undefined,
            zIndex: isSelected ? 10 : count + 1 - k,
            transform: `rotate(${rotation}deg) translateY(${lift}px)`,
            transformOrigin: "50% 100%",
            transition: `all 500ms ${EASE_IL}`,
        };
    }

    // La foto principal es una de las ocultas -> se marca la ficha "+N".
    const moreSelected = hasMore && selected >= firstHidden;

    return (
        <div
            onMouseEnter={() => canHover && setHoverOpen(true)}
            onMouseLeave={() => setHoverOpen(false)}
            style={{
                position: "absolute",
                top: 18,
                left: side === "left" ? 18 : undefined,
                right: side === "right" ? 18 : undefined,
                width: THUMB_WIDTH + (count - 1) * gap,
                height: 96,
                zIndex: 2,
                opacity: visible ? 1 : 0,
                pointerEvents: visible ? "auto" : "none",
                transition: `opacity 500ms 250ms, width 500ms ${EASE_IL}`,
            }}
        >
            {shownPhotos.map((photo, k) => {
                const isSelected = k === selected;

                return (
                    <button
                        key={`${photo.url}-${k}`}
                        type="button"
                        aria-label={`Ver foto: ${photo.caption || photo.alt}`}
                        aria-pressed={isSelected}
                        onClick={(e) => {
                            // Sin esto el clic también llegaría al panel/tarjeta de abajo.
                            e.stopPropagation();
                            onSelect(k);
                        }}
                        className="absolute h-20 w-[62px] cursor-pointer overflow-hidden rounded-xl bg-il-neutro-100 p-0 shadow-[0_8px_20px_rgba(20,24,31,.3)]"
                        style={{
                            ...placeStyle(k, isSelected),
                            border: `3px solid ${isSelected ? "var(--color-il-amarillo-500)" : "#fff"}`,
                        }}
                    >
                        <span className="pointer-events-none absolute inset-0 block">
                            <CoverImage url={photo.url} alt="" />
                        </span>
                    </button>
                );
            })}

            {hasMore && (
                <PhotoFanMore
                    photo={photos[firstHidden]}
                    hiddenCount={hiddenCount}
                    isSelected={moreSelected}
                    style={placeStyle(firstHidden, moreSelected)}
                    onClick={() => (onMoreClick ? onMoreClick(firstHidden) : onSelect(firstHidden))}
                />
            )}
        </div>
    );
}
