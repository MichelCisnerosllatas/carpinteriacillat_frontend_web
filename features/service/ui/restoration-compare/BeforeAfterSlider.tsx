// features/service/ui/restoration-compare/BeforeAfterSlider.tsx
//
// Comparador "antes / después": la foto de DESPUÉS va encima de la de ANTES y se recorta con
// clip-path desde la izquierda hasta `value` (en %). Mover la manija cambia ese porcentaje.
//
// - Se arrastra con mouse o dedo (pointer events + setPointerCapture: aunque el dedo se salga
//   del recuadro, se sigue recibiendo el movimiento hasta soltar).
// - Con teclado: foco en la manija y flechas ← → (de 5 en 5).
// - La primera vez que el comparador entra en pantalla hace un "barrido" automático
//   (24% → 76% → 50%) para mostrar que se puede mover. No se hace con "reducir movimiento"
//   ni si el intranet lo apagó (autoSweep).
// - Etiquetas, ayuda y botón "ver en grande" se pueden ocultar desde el intranet (props show*).
// - Anclas de la vista previa: "section-item-<id>" en cada trabajo y "section-image-<id>" en
//   sus fotos propias.
//
// Es un componente "controlado": el porcentaje lo guarda el padre (RestorationCompare), que
// también lo vuelve a 50 al elegir otro trabajo.
"use client";

import { useEffect, useRef, useState } from "react";
import CoverImage from "@/shared/ui/cover-image/CoverImage";
import ExpandPhotoButton from "@/shared/ui/expand-photo-button/ExpandPhotoButton";
import { useReducedMotion } from "@/shared/lib/useReducedMotion";
import { EASE_IL, EASE_IL_PAGE } from "@/shared/lib/ilDesign";
import { PREVIEW_ANCHOR_STYLE } from "@/shared/lib/previewAnchor";
import type { RestorationCard } from "@/features/service/lib/buildRestorationCards";

type Props = {
    works: RestorationCard[];
    activeIndex: number;
    value: number; // 0 a 100
    onChange: (value: number) => void;
    onExpand: () => void; // abre "antes" y "después" en grande
    // "Elementos de las tarjetas" (card_settings de la sección):
    showLabels: boolean; // etiquetas "Antes" / "Después"
    showHint: boolean; // ayuda "Toque y arrastre para comparar"
    showExpand: boolean; // botón "ver foto en grande"
    autoSweep: boolean; // barrido automático al aparecer
};

// [milisegundos desde que se ve, posición en %]
const SWEEP_STEPS: [number, number][] = [
    [0, 24],
    [950, 76],
    [1900, 50],
];
const SWEEP_TOTAL_MS = 2900;
const KEY_STEP = 5;

function clamp(value: number): number {
    return Math.max(2, Math.min(98, value));
}

export default function BeforeAfterSlider({
    works,
    activeIndex,
    value,
    onChange,
    onExpand,
    showLabels,
    showHint,
    showExpand,
    autoSweep,
}: Props) {
    const containerRef = useRef<HTMLDivElement>(null);
    const alreadySwept = useRef(false);
    const reducedMotion = useReducedMotion();

    const [dragging, setDragging] = useState(false);
    const [touched, setTouched] = useState(false); // la persona ya lo movió: se oculta la ayuda
    const [sweeping, setSweeping] = useState(false);

    // Barrido automático la primera vez que el comparador se ve al menos a la mitad.
    useEffect(() => {
        const element = containerRef.current;
        if (!element || !autoSweep || reducedMotion || alreadySwept.current || !("IntersectionObserver" in window)) return;

        const timers: number[] = [];
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting) return;
                alreadySwept.current = true;
                observer.disconnect();
                setSweeping(true);
                for (const [delay, position] of SWEEP_STEPS) {
                    timers.push(window.setTimeout(() => onChange(position), delay + 60));
                }
                timers.push(window.setTimeout(() => setSweeping(false), SWEEP_TOTAL_MS));
            },
            { threshold: 0.5 }
        );
        observer.observe(element);

        return () => {
            observer.disconnect();
            timers.forEach((timer) => window.clearTimeout(timer));
        };
    }, [autoSweep, reducedMotion, onChange]);

    // Convierte la posición del puntero en un porcentaje del ancho del recuadro.
    function valueFromPointer(e: React.PointerEvent<HTMLDivElement>): number {
        const rect = e.currentTarget.getBoundingClientRect();
        const percent = ((e.clientX - rect.left) / rect.width) * 100;
        return Math.round(clamp(percent) * 10) / 10;
    }

    function handlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
        if (sweeping) return; // no pelear con el barrido automático
        e.currentTarget.setPointerCapture(e.pointerId);
        onChange(valueFromPointer(e));
        setDragging(true);
        setTouched(true);
    }

    function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
        if (dragging) onChange(valueFromPointer(e));
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLButtonElement>) {
        const step = e.key === "ArrowLeft" ? -KEY_STEP : e.key === "ArrowRight" ? KEY_STEP : 0;
        if (step === 0) return;
        e.preventDefault(); // que la flecha no mueva la página
        onChange(clamp(value + step));
        setTouched(true);
    }

    // Durante el barrido se anima el movimiento; arrastrando, la línea sigue al dedo sin demora.
    const sweepTransition = sweeping ? `900ms ${EASE_IL_PAGE}` : null;

    return (
        <div
            ref={containerRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={() => setDragging(false)}
            onPointerCancel={() => setDragging(false)}
            className="relative aspect-[4/4.6] select-none overflow-hidden rounded-[28px] bg-il-neutro-700 shadow-[0_30px_70px_rgba(0,0,0,.45)] outline outline-1 outline-white/10 [touch-action:pan-y]"
            style={{
                cursor: dragging ? "grabbing" : "grab",
                transform: `scale(${dragging ? 0.99 : 1})`,
                transition: `transform 300ms ${EASE_IL}`,
            }}
        >
            {works.map((work, i) => (
                <div
                    key={work.key}
                    id={work.anchorId}
                    className="absolute inset-0"
                    style={{ ...PREVIEW_ANCHOR_STYLE, opacity: i === activeIndex ? 1 : 0, transition: "opacity 500ms" }}
                >
                    <div id={work.before.anchorId} className="absolute inset-0" style={PREVIEW_ANCHOR_STYLE}>
                        <CoverImage url={work.before.url} alt={`Antes: ${work.title}`} />
                    </div>
                    <div
                        id={work.after.anchorId}
                        className="absolute inset-0 bg-il-neutro-600"
                        style={{
                            ...PREVIEW_ANCHOR_STYLE,
                            clipPath: `inset(0 0 0 ${value}%)`,
                            transition: sweepTransition ? `clip-path ${sweepTransition}` : "none",
                        }}
                    >
                        <CoverImage url={work.after.url} alt={`Después: ${work.title}`} />
                    </div>
                </div>
            ))}

            {/* Línea divisoria */}
            <div
                className="pointer-events-none absolute inset-y-0 w-0.5 -translate-x-px bg-white shadow-[0_0_0_1px_rgba(20,24,31,.15)]"
                style={{ left: `${value}%`, transition: sweepTransition ? `left ${sweepTransition}` : "none" }}
            />

            {/* Manija: es un botón real para poder usarla con teclado. */}
            <button
                type="button"
                onKeyDown={handleKeyDown}
                aria-label="Arrastre para comparar antes y después"
                className="absolute top-1/2 flex size-[60px] cursor-grab items-center justify-center gap-1.5 rounded-full border-4 border-white bg-il-amarillo-500 text-lg font-extrabold text-il-neutro-900 shadow-[0_10px_24px_rgba(0,0,0,.35)]"
                style={{
                    left: `${value}%`,
                    transform: `translate(-50%, -50%) scale(${dragging ? 1.12 : 1})`,
                    transition: sweepTransition ? `left ${sweepTransition}, transform 200ms` : "transform 200ms",
                }}
            >
                <span aria-hidden="true">‹</span>
                <span aria-hidden="true">›</span>
            </button>

            {showLabels && (
                <>
                    <span
                        className="il-display pointer-events-none absolute left-[18px] top-[18px] rounded-full bg-[rgba(20,24,31,.85)] px-3.5 py-[7px] text-sm font-bold text-white transition-opacity duration-300"
                        style={{ opacity: value > 14 ? 1 : 0 }}
                    >
                        Antes
                    </span>
                    <span
                        className="il-display pointer-events-none absolute right-[18px] top-[18px] rounded-full bg-il-amarillo-500 px-3.5 py-[7px] text-sm font-bold text-il-neutro-900 transition-opacity duration-300"
                        style={{ opacity: value < 86 ? 1 : 0 }}
                    >
                        Después
                    </span>
                </>
            )}
            {/* Ver en grande: arriba al centro, entre "Antes" y "Después". El botón corta el
                pointerdown, así tocarlo no mueve la línea del comparador. */}
            {showExpand && <ExpandPhotoButton onClick={onExpand} className="absolute left-1/2 top-[14px] z-10 -translate-x-1/2" />}
            {showHint && (
                <span
                    className="pointer-events-none absolute bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-white px-4 py-2 text-sm font-semibold text-il-neutro-900 transition-opacity duration-[400ms]"
                    style={{ opacity: touched || sweeping ? 0 : 1 }}
                >
                    Toque y arrastre para comparar
                </span>
            )}
        </div>
    );
}
