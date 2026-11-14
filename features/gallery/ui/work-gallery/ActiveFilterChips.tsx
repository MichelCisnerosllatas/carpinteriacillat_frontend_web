// features/gallery/ui/work-gallery/ActiveFilterChips.tsx
//
// Fichas amarillas con cada filtro aplicado (tocar una la quita), el enlace "Limpiar todo" y
// el resumen "N de M trabajos" alineado a la derecha.

import type { FilterListKey, WorkFilters } from "@/features/gallery/lib/filterWorks";

type Props = {
    filters: WorkFilters;
    resultsCount: number;
    totalCount: number;
    // Apariencia search.show_results_summary: false = sin el texto "N de M trabajos".
    showSummary?: boolean;
    // Texto de la ficha de cada valor (ej. tipo "restoration" → "Restauración"). Sin él, el valor.
    labelFor?: (key: FilterListKey, value: string) => string;
    onRemove: (key: FilterListKey, value: string) => void;
    onClearQuery: () => void;
    onResetAll: () => void;
};

type Chip = {
    id: string; // clave única para React (un mismo texto podría estar en dos listas)
    text: string;
    onRemove: () => void;
};

const LIST_KEYS: FilterListKey[] = ["types", "categories", "woods", "styles"];

export default function ActiveFilterChips({ filters, resultsCount, totalCount, showSummary = true, labelFor, onRemove, onClearQuery, onResetAll }: Props) {
    // Una ficha por cada valor marcado, y una más para el texto buscado.
    const chips: Chip[] = LIST_KEYS.flatMap((key) =>
        filters[key].map((value) => ({
            id: `${key}-${value}`,
            text: labelFor ? labelFor(key, value) : value,
            onRemove: () => onRemove(key, value),
        }))
    );
    if (filters.query.trim()) {
        chips.push({ id: "query", text: `«${filters.query}»`, onRemove: onClearQuery });
    }

    return (
        <>
            {chips.map((chip) => (
                <button
                    key={chip.id}
                    type="button"
                    onClick={chip.onRemove}
                    aria-label={`Quitar filtro ${chip.text}`}
                    className="inline-flex min-h-9 cursor-pointer items-center gap-2 rounded-full border-0 bg-il-amarillo-100 py-0 pl-3.5 pr-[5px] text-sm font-semibold text-il-neutro-900"
                >
                    {chip.text}
                    <span aria-hidden="true" className="inline-flex size-[26px] items-center justify-center rounded-full bg-white text-[11px]">
                        ✕
                    </span>
                </button>
            ))}

            {chips.length > 0 && (
                <button
                    type="button"
                    onClick={onResetAll}
                    className="il-display min-h-9 cursor-pointer border-0 bg-transparent px-2.5 text-sm font-bold text-il-neutro-900 underline"
                >
                    Limpiar todo
                </button>
            )}

            {/* aria-live: un lector de pantalla anuncia cuántos resultados quedan al filtrar. */}
            {showSummary && (
                <span data-el="gallery-results-summary" aria-live="polite" className="ml-auto text-[15px] text-il-neutro-600">
                    {resultsCount} de {totalCount} trabajos
                </span>
            )}
        </>
    );
}
