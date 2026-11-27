// features/gallery/ui/work-detail/related-works/useScrollArrows.ts
//
// Flechas de una fila con scroll horizontal:
//   - hasOverflow: hay tarjetas que no se ven (si es false, las flechas ni se muestran).
//   - canPrev / canNext: si todavía se puede mover hacia ese lado (si no, se deshabilita).
//   - scrollByCard(1 | -1): mueve la fila el ancho de una tarjeta.
// Se recalcula al hacer scroll y cuando cambia el tamaño de la fila (rotar el celular, etc.).
"use client";

import { useCallback, useEffect, useState, type RefObject } from "react";

export function useScrollArrows(rowRef: RefObject<HTMLElement | null>) {
    const [hasOverflow, setHasOverflow] = useState(false);
    const [canPrev, setCanPrev] = useState(false);
    const [canNext, setCanNext] = useState(false);

    const update = useCallback(() => {
        const row = rowRef.current;
        if (!row) return;
        const maxScroll = row.scrollWidth - row.clientWidth;
        // 2px de margen: algunos navegadores dejan decimales al final del scroll.
        setHasOverflow(maxScroll > 2);
        setCanPrev(row.scrollLeft > 2);
        setCanNext(row.scrollLeft < maxScroll - 2);
    }, [rowRef]);

    useEffect(() => {
        const row = rowRef.current;
        if (!row) return;

        update();
        row.addEventListener("scroll", update, { passive: true });
        const observer = new ResizeObserver(update);
        observer.observe(row);

        return () => {
            row.removeEventListener("scroll", update);
            observer.disconnect();
        };
    }, [rowRef, update]);

    function scrollByCard(direction: 1 | -1) {
        const row = rowRef.current;
        const firstCard = row?.firstElementChild as HTMLElement | null;
        if (!row || !firstCard) return;

        const gap = parseFloat(getComputedStyle(row).columnGap) || 0;
        row.scrollBy({ left: direction * (firstCard.offsetWidth + gap), behavior: "smooth" });
    }

    return { hasOverflow, canPrev, canNext, scrollByCard };
}
