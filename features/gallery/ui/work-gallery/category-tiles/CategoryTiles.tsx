// features/gallery/ui/work-gallery/category-tiles/CategoryTiles.tsx
//
// Fila de botones de categoría con foto ("Todos", "Cocinas", "Roperos"…). Se pueden marcar
// varias a la vez. La fila se desliza de costado (con el dedo o con las flechas ← →; sin barra
// de scroll visible). Cada flecha se oculta cuando ya no hay más categorías hacia ese lado.
// El padding de arriba/derecha deja lugar al check amarillo, que sobresale del botón.
"use client";

import { useEffect, useRef, useState } from "react";
import CategoryTileButton from "./CategoryTileButton";

export type CategoryTile = {
    name: string;
    count: number;
    photoUrl: string | null;
};

type Props = {
    allCount: number; // número a mostrar en "Todos"
    allPhotoUrl: string | null;
    tiles: CategoryTile[];
    selected: string[];
    onToggle: (name: string) => void;
    onShowAll: () => void;
};

const SCROLL_STEP = 0.8; // cada flecha mueve el 80% del ancho visible
const EDGE_PX = 2; // margen para no mostrar una flecha por un pixel de diferencia

const ARROW_CLASS =
    "absolute top-1/2 z-10 inline-flex size-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-il-neutro-200 bg-white text-base text-il-neutro-900 shadow-[0_6px_16px_rgba(20,24,31,.16)] transition-colors hover:border-brand-gold hover:bg-brand-gold hover:text-black";

export default function CategoryTiles({ allCount, allPhotoUrl, tiles, selected, onToggle, onShowAll }: Props) {
    const rowRef = useRef<HTMLDivElement>(null);
    const [canLeft, setCanLeft] = useState(false);
    const [canRight, setCanRight] = useState(false);

    // Revisa si queda contenido escondido a cada lado (al hacer scroll y al cambiar el tamaño).
    useEffect(() => {
        const row = rowRef.current;
        if (!row) return;

        function update() {
            if (!row) return;
            setCanLeft(row.scrollLeft > EDGE_PX);
            setCanRight(row.scrollLeft + row.clientWidth < row.scrollWidth - EDGE_PX);
        }

        // Primera revisión en el próximo cuadro (cuando las fotos/botones ya tienen tamaño).
        const frame = window.requestAnimationFrame(update);
        row.addEventListener("scroll", update, { passive: true });
        window.addEventListener("resize", update);
        return () => {
            window.cancelAnimationFrame(frame);
            row.removeEventListener("scroll", update);
            window.removeEventListener("resize", update);
        };
    }, [tiles.length]);

    function scrollByStep(direction: 1 | -1) {
        const row = rowRef.current;
        if (!row) return;
        row.scrollBy({ left: direction * row.clientWidth * SCROLL_STEP, behavior: "smooth" });
    }

    return (
        <div className="relative">
            {canLeft && (
                <button type="button" onClick={() => scrollByStep(-1)} aria-label="Ver categorías anteriores" className={`${ARROW_CLASS} left-0`}>
                    <span aria-hidden="true">←</span>
                </button>
            )}

            <div
                ref={rowRef}
                role="group"
                aria-label="Categorías"
                className="il-no-scrollbar -mb-1 -mt-2 flex gap-2.5 overflow-x-auto py-2 pl-0.5 pr-2"
            >
                <CategoryTileButton
                    label="Todos"
                    count={allCount}
                    photoUrl={allPhotoUrl}
                    isOn={selected.length === 0}
                    showCheck={false}
                    onClick={onShowAll}
                />
                {tiles.map((tile) => {
                    const isOn = selected.includes(tile.name);
                    return (
                        <CategoryTileButton
                            key={tile.name}
                            label={tile.name}
                            count={tile.count}
                            photoUrl={tile.photoUrl}
                            isOn={isOn}
                            showCheck={isOn}
                            onClick={() => onToggle(tile.name)}
                        />
                    );
                })}
            </div>

            {canRight && (
                <button type="button" onClick={() => scrollByStep(1)} aria-label="Ver más categorías" className={`${ARROW_CLASS} right-0`}>
                    <span aria-hidden="true">→</span>
                </button>
            )}
        </div>
    );
}
