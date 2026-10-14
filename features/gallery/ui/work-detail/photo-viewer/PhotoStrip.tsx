// features/gallery/ui/work-detail/photo-viewer/PhotoStrip.tsx
//
// Tira de miniaturas "PORTADA Y FOTOS DEL TRABAJO" debajo del visor. Las fotos que se están
// viendo (una en Abanico, dos en Libro) se marcan con anillo amarillo. A la derecha del
// título va el botón "ver en grande" (abre todas las fotos en la que se está viendo).

import CoverImage from "@/shared/ui/cover-image/CoverImage";
import ExpandPhotoButton from "@/shared/ui/expand-photo-button/ExpandPhotoButton";
import { EASE_IL, toneAt } from "@/shared/lib/ilDesign";
import type { Photo } from "@/shared/lib/photo";

type Props = {
    photos: Photo[];
    visibleIndexes: number[];
    onPick: (index: number) => void;
    onExpand: () => void;
};

// "isla de desayuno" -> "Isla de desayuno". La primera siempre se llama "Portada".
function photoLabel(photo: Photo, index: number): string {
    if (index === 0) return "Portada";
    if (!photo.caption) return `Foto ${index + 1}`;
    return photo.caption.charAt(0).toUpperCase() + photo.caption.slice(1);
}

export default function PhotoStrip({ photos, visibleIndexes, onPick, onExpand }: Props) {
    return (
        <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between gap-3">
                <span className="il-display text-[13px] font-bold tracking-[.14em] text-il-neutro-600">PORTADA Y FOTOS DEL TRABAJO</span>
                <ExpandPhotoButton onClick={onExpand} className="border border-il-neutro-200" />
            </div>
            <div className="grid grid-cols-4 gap-2.5">
                {photos.map((photo, k) => {
                    const isOn = visibleIndexes.includes(k);
                    const label = photoLabel(photo, k);
                    return (
                        <button
                            key={`${photo.url}-${k}`}
                            type="button"
                            onClick={() => onPick(k)}
                            aria-label={`Ver ${label.toLowerCase()}`}
                            aria-pressed={isOn}
                            className="flex cursor-pointer flex-col gap-1.5 border-0 bg-transparent p-0 text-left"
                        >
                            <span
                                className="relative block aspect-[4/3] w-full overflow-hidden rounded-[14px]"
                                style={{
                                    background: toneAt(k),
                                    transform: `translateY(${isOn ? -3 : 0}px)`,
                                    transition: `transform 300ms ${EASE_IL}`,
                                }}
                            >
                                <CoverImage url={photo.url} alt="" />
                                <span
                                    className="pointer-events-none absolute inset-0 rounded-[14px] transition-shadow duration-200"
                                    style={{ boxShadow: `inset 0 0 0 3px ${isOn ? "var(--color-il-amarillo-500)" : "transparent"}` }}
                                />
                            </span>
                            <span
                                className="text-[13px] leading-[1.3]"
                                style={{
                                    color: isOn ? "var(--color-il-neutro-900)" : "var(--color-il-neutro-600)",
                                    fontWeight: isOn || k === 0 ? 700 : 500,
                                }}
                            >
                                {label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
