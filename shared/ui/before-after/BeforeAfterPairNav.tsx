// shared/ui/before-after/BeforeAfterPairNav.tsx
//
// Selector de pares del comparador "antes / después", para cuando un trabajo tiene VARIOS
// pares (ej. "Frente", "Costado", "Detalle del tirador"):
//
//   PAR 2 DE 3 · Costado
//   [mini] [mini] [mini]      <- miniatura = foto de DESPUÉS de cada par
//
// - Cada miniatura es un botón real (Tab + Enter/Espacio) con aria-pressed; la elegida lleva
//   anillo amarillo y sube un poco (mismo lenguaje que RestorationThumbs).
// - Con un solo par no se pinta nada (no hay qué elegir).
// - tone "dark" para fondos oscuros (Servicios) y "light" para fondos claros (detalle Galería).
//
// Es "controlado": el par activo lo guarda el padre, que también vuelve el comparador a 50.

import CoverImage from "@/shared/ui/cover-image/CoverImage";
import { EASE_IL } from "@/shared/lib/ilDesign";
import type { PhotoPair } from "@/shared/lib/photo";

type Props = {
    pairs: PhotoPair[];
    activeIndex: number;
    onPick: (index: number) => void;
    tone?: "dark" | "light";
};

export default function BeforeAfterPairNav({ pairs, activeIndex, onPick, tone = "dark" }: Props) {
    if (pairs.length < 2) return null;

    const active = pairs[activeIndex];
    const isDark = tone === "dark";

    return (
        <div className="flex flex-col gap-2.5">
            {/* aria-live: al cambiar de par, el lector de pantalla anuncia cuál se ve. */}
            <span aria-live="polite" className={`text-sm ${isDark ? "text-il-neutro-300" : "text-il-neutro-600"}`}>
                <strong className={`il-display font-bold tracking-[.08em] ${isDark ? "text-white" : "text-il-neutro-900"}`}>
                    PAR {activeIndex + 1} DE {pairs.length}
                </strong>
                {active?.caption ? ` · ${active.caption}` : ""}
            </span>
            <div className="flex flex-wrap gap-2.5">
                {pairs.map((pair, i) => {
                    const isActive = i === activeIndex;
                    return (
                        <button
                            key={pair.key}
                            type="button"
                            onClick={() => onPick(i)}
                            aria-label={`Ver par ${i + 1}${pair.caption ? `: ${pair.caption}` : ""}`}
                            aria-pressed={isActive}
                            className={`relative size-14 cursor-pointer overflow-hidden rounded-xl border-0 p-0 ${isDark ? "bg-il-neutro-700" : "bg-il-neutro-100"}`}
                            style={{
                                outline: `3px solid ${isActive ? "var(--color-il-amarillo-500)" : "transparent"}`,
                                outlineOffset: 2,
                                transform: `translateY(${isActive ? -3 : 0}px)`,
                                opacity: isActive ? 1 : 0.75,
                                transition: `all 300ms ${EASE_IL}`,
                            }}
                        >
                            <span className="pointer-events-none absolute inset-0 block">
                                <CoverImage url={pair.after.url} alt="" />
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
