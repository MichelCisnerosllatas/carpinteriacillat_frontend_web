// features/gallery/ui/work-gallery/FilterDropdown.tsx
//
// Botón de filtro ("Madera", "Estilo") que abre un panel con opciones de selección múltiple.
//
// El panel es "absolute" y se posiciona respecto de la FILA entera de filtros (el padre con
// "relative" en WorkGallery.tsx), no del botón: así en móvil puede usar todo el ancho.
// Por eso este componente devuelve el botón y el panel sueltos (un fragmento <>…</>).
//
// Se cierra con: el botón "Ver N trabajos", la tecla Escape, o tocando/haciendo clic fuera
// del panel y del botón.
"use client";

import { useEffect, useRef } from "react";
import { EASE_IL } from "@/shared/lib/ilDesign";
import { worksLabel } from "@/features/gallery/lib/filterWorks";

export type FilterOption = {
    value: string;
    // Texto a mostrar si es distinto del valor (ej. tipo: value "restoration", label "Restauración").
    label?: string;
    count: number;
};

type Props = {
    label: string; // texto del botón: "Madera" (Apariencia: search.filter_*_label)
    dataEl?: string; // ancla data-el del botón (ej. "gallery-filter-wood")
    panelTitle: string; // título dentro del panel: "Tipo de madera"
    options: FilterOption[];
    selected: string[];
    isOpen: boolean;
    resultsCount: number; // para el botón "Ver N trabajos"
    onToggleOpen: () => void;
    onToggleValue: (value: string) => void;
    onClear: () => void;
    onClose: () => void;
};

export default function FilterDropdown({
    label,
    dataEl,
    panelTitle,
    options,
    selected,
    isOpen,
    resultsCount,
    onToggleOpen,
    onToggleValue,
    onClear,
    onClose,
}: Props) {
    // Se ve "activo" (oscuro) si está abierto o si tiene algo marcado.
    const isHighlighted = isOpen || selected.length > 0;

    const buttonRef = useRef<HTMLButtonElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);

    // Mientras está abierto: escuchar toques/clics en toda la página y la tecla Escape.
    useEffect(() => {
        if (!isOpen) return;

        function handlePointerDown(e: PointerEvent) {
            const target = e.target as Node;
            // Tocar el propio botón no cuenta como "fuera" (el botón ya abre/cierra solo).
            if (buttonRef.current?.contains(target) || panelRef.current?.contains(target)) return;
            onClose();
        }

        function handleKeyDown(e: KeyboardEvent) {
            if (e.key !== "Escape") return;
            onClose();
            buttonRef.current?.focus(); // el foco vuelve al botón (teclado)
        }

        document.addEventListener("pointerdown", handlePointerDown);
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("pointerdown", handlePointerDown);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen, onClose]);

    return (
        <>
            <button
                ref={buttonRef}
                data-el={dataEl}
                type="button"
                onClick={onToggleOpen}
                aria-expanded={isOpen}
                className="il-display inline-flex min-h-11 cursor-pointer items-center gap-2.5 rounded-full border-[1.5px] py-0 pl-[18px] pr-4 text-sm font-bold transition-all duration-200"
                style={{
                    borderColor: isHighlighted ? "var(--color-il-neutro-900)" : "var(--color-il-neutro-300)",
                    background: isHighlighted ? "var(--color-il-neutro-900)" : "#fff",
                    color: isHighlighted ? "#fff" : "var(--color-il-neutro-900)",
                }}
            >
                {selected.length > 0 ? `${label} · ${selected.length}` : label}
                <span
                    aria-hidden="true"
                    className="inline-block text-xs"
                    style={{ transform: `rotate(${isOpen ? 180 : 0}deg)`, transition: "transform 300ms" }}
                >
                    ▼
                </span>
            </button>

            {isOpen && (
                <div
                    ref={panelRef}
                    className="absolute left-0 top-[calc(100%+10px)] z-30 flex w-[min(460px,100%)] flex-col gap-4 rounded-[20px] border border-il-neutro-200 bg-white p-5 shadow-[0_24px_50px_rgba(20,24,31,.16)]"
                >
                    <div className="flex items-baseline justify-between gap-3">
                        <span className="il-display text-base font-bold">{panelTitle}</span>
                        <span className="text-sm text-il-neutro-600">Puede elegir varias</span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {options.map((option) => {
                            const isOn = selected.includes(option.value);
                            return (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => onToggleValue(option.value)}
                                    aria-pressed={isOn}
                                    className="inline-flex min-h-11 cursor-pointer items-center gap-2.5 rounded-full border-[1.5px] py-0 pl-2 pr-3.5 text-[15px] font-semibold text-il-neutro-900"
                                    style={{
                                        borderColor: isOn ? "var(--color-il-neutro-900)" : "var(--color-il-neutro-200)",
                                        background: isOn ? "var(--color-il-amarillo-100)" : "#fff",
                                        transition: `all 200ms ${EASE_IL}`,
                                    }}
                                >
                                    <span
                                        aria-hidden="true"
                                        className="inline-flex size-[26px] items-center justify-center rounded-full border-[1.5px] text-xs font-extrabold transition-all duration-200"
                                        style={{
                                            background: isOn ? "var(--color-il-amarillo-500)" : "#fff",
                                            borderColor: isOn ? "var(--color-il-amarillo-500)" : "var(--color-il-neutro-300)",
                                        }}
                                    >
                                        {isOn ? "✓" : ""}
                                    </span>
                                    {option.label ?? option.value}
                                    <span className="text-[13px] text-il-neutro-600">{option.count}</span>
                                </button>
                            );
                        })}
                    </div>

                    <div className="flex items-center justify-between gap-2.5 border-t border-il-neutro-200 pt-3.5">
                        <button
                            type="button"
                            onClick={onClear}
                            className="min-h-11 cursor-pointer border-0 bg-transparent px-1.5 text-[15px] font-semibold text-il-neutro-900 underline"
                        >
                            Quitar selección
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="il-display min-h-11 cursor-pointer rounded-full border-0 bg-brand-gold text-black hover:bg-brand-gold-dark px-5 text-[15px] font-bold transition-colors"
                        >
                            Ver {worksLabel(resultsCount)}
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
