// shared/ui/photo-fan/PhotoFanMore.tsx
//
// Ficha "+N" del abanico (PhotoFan): ocupa el lugar de la última miniatura cuando hay más
// fotos de las que entran. Muestra la foto de ese lugar con un velo oscuro y el texto "+N".
// Al tocarla se ven las fotos que no entraron (normalmente en el lightbox).
"use client";

import type { CSSProperties } from "react";
import CoverImage from "@/shared/ui/cover-image/CoverImage";
import type { Photo } from "@/shared/lib/photo";

type Props = {
    photo: Photo; // foto que se ve de fondo (la primera que no entró)
    hiddenCount: number; // N: cuántas fotos no se muestran
    isSelected: boolean; // la foto principal es una de las ocultas -> borde amarillo
    style: CSSProperties; // posición/giro, la calcula PhotoFan igual que en las miniaturas
    onClick: () => void;
};

export default function PhotoFanMore({ photo, hiddenCount, isSelected, style, onClick }: Props) {
    const label = `Ver ${hiddenCount} fotos más`;

    return (
        <button
            type="button"
            aria-label={label}
            title={label}
            onPointerDown={(e) => {
                // Que no empiece el swipe/arrastre del contenedor de abajo.
                e.stopPropagation();
            }}
            onClick={(e) => {
                // Sin esto el clic también cambiaría de panel o navegaría.
                e.preventDefault();
                e.stopPropagation();
                onClick();
            }}
            className="absolute h-20 w-[62px] cursor-pointer overflow-hidden rounded-xl bg-il-neutro-900 p-0 shadow-[0_8px_20px_rgba(20,24,31,.3)]"
            style={{
                ...style,
                border: `3px solid ${isSelected ? "var(--color-il-amarillo-500)" : "#fff"}`,
            }}
        >
            <span className="pointer-events-none absolute inset-0 block">
                <CoverImage url={photo.url} alt="" />
            </span>
            {/* Velo oscuro + "+N" */}
            <span
                aria-hidden="true"
                className="il-display pointer-events-none absolute inset-0 flex items-center justify-center bg-[rgba(20,24,31,.62)] text-lg font-extrabold text-white"
            >
                +{hiddenCount}
            </span>
        </button>
    );
}
