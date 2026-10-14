// features/gallery/ui/work-detail/photo-viewer/PhotoFanViewer.tsx
//
// Vista "Abanico" del detalle: las fotos apiladas como cartas, la elegida al frente. Tocar una
// foto la trae al frente.
//   - Con mouse: al pasar el mouse el abanico se abre (cada foto gira y se separa más).
//   - En celular (sin hover): tocar el abanico lo abre/cierra, y deslizar el dedo a los
//     costados (más de 40px) pasa a la foto anterior/siguiente.
"use client";

import { useRef, useState } from "react";
import CoverImage from "@/shared/ui/cover-image/CoverImage";
import { EASE_IL, toneAt } from "@/shared/lib/ilDesign";
import { useCanHover } from "@/shared/lib/useCanHover";
import type { Photo } from "@/shared/lib/photo";

type Props = {
    photos: Photo[];
    selected: number;
    onSelect: (index: number) => void;
};

const SWIPE_MIN_PX = 40; // menos que esto se toma como un toque, no como deslizar

export default function PhotoFanViewer({ photos, selected, onSelect }: Props) {
    const canHover = useCanHover();
    const [open, setOpen] = useState(false);
    const middle = (photos.length - 1) / 2;
    const total = photos.length;

    // Swipe (solo celular): dónde empezó el dedo y si el último gesto fue un deslizamiento.
    const swipeStartX = useRef<number | null>(null);
    const justSwiped = useRef(false);

    function handlePointerUp(clientX: number) {
        const start = swipeStartX.current;
        swipeStartX.current = null;
        if (canHover || start === null || total < 2) return;
        const delta = clientX - start;
        if (Math.abs(delta) <= SWIPE_MIN_PX) return;
        // Deslizar hacia la izquierda avanza; hacia la derecha retrocede.
        onSelect(delta < 0 ? (selected + 1) % total : (selected - 1 + total) % total);
        justSwiped.current = true; // el "clic" que llega después del swipe se ignora
    }

    return (
        <div
            onMouseEnter={() => canHover && setOpen(true)}
            onMouseLeave={() => canHover && setOpen(false)}
            onPointerDown={(e) => {
                swipeStartX.current = e.clientX;
                justSwiped.current = false; // un gesto nuevo empieza "limpio"
            }}
            onPointerUp={(e) => handlePointerUp(e.clientX)}
            onClickCapture={(e) => {
                // Si recién se deslizó, este clic no debe elegir foto ni abrir/cerrar.
                if (justSwiped.current) {
                    justSwiped.current = false;
                    e.stopPropagation();
                }
            }}
            onClick={() => {
                // Celular: tocar el abanico lo abre o lo cierra.
                if (!canHover) setOpen(!open);
            }}
            className="relative aspect-[1/0.9] w-full select-none rounded-3xl bg-il-neutro-050 [touch-action:pan-y]"
        >
            {photos.map((photo, i) => {
                const isSelected = i === selected;
                const fromMiddle = i - middle; // negativo = a la izquierda del centro

                // Abierto: todas giran y se separan. Cerrado: solo las de atrás giran un poco.
                const angle = open ? fromMiddle * 11 : isSelected ? 0 : fromMiddle * 3.5;
                const shiftX = open ? fromMiddle * 16 : 0;
                const shiftY = isSelected && open ? -18 : 0;
                const scale = isSelected ? 1.02 : 0.97;

                return (
                    <button
                        key={`${photo.url}-${i}`}
                        type="button"
                        onClick={() => onSelect(i)}
                        aria-label={`Ver foto ${i + 1}${photo.caption ? `: ${photo.caption}` : ""}`}
                        aria-pressed={isSelected}
                        className="absolute left-[24%] top-[8%] aspect-[3/4] w-[52%] cursor-pointer overflow-hidden rounded-2xl border-[6px] border-white p-0 shadow-[0_18px_40px_rgba(20,24,31,.16)]"
                        style={{
                            background: toneAt(i),
                            transformOrigin: "50% 130%",
                            transform: `translateX(${shiftX}%) translateY(${shiftY}px) rotate(${angle}deg) scale(${scale})`,
                            zIndex: isSelected ? 20 : 10 - Math.abs(i - selected),
                            transition: `transform 700ms ${EASE_IL}`,
                        }}
                    >
                        <CoverImage url={photo.url} alt={photo.alt} loading={isSelected ? "eager" : "lazy"} />
                    </button>
                );
            })}
        </div>
    );
}
