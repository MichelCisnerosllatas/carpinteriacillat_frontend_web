// shared/lib/useAutoRotate.ts
//
// Índice que avanza solo cada `intervalMs` (0, 1, 2, ... y vuelve a 0). Lo usa el hero de
// Servicios para cambiar de panel cada 6 s.
//
// - `paused` en true frena el avance (ej. mouse encima, o "reducir movimiento").
// - Usa setTimeout (no setInterval) y depende de `index`: así, si la persona elige un panel a
//   mano, el conteo vuelve a empezar desde cero y no salta enseguida al siguiente.
"use client";

import { useEffect, useState } from "react";

export function useAutoRotate(count: number, intervalMs: number, paused: boolean) {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        if (paused || count < 2) return;
        const timer = setTimeout(() => setIndex((i) => (i + 1) % count), intervalMs);
        return () => clearTimeout(timer);
    }, [index, count, intervalMs, paused]);

    // Si la lista se achica (ej. se borra un item en la vista previa), el índice guardado
    // podría quedar fuera de rango: se ajusta al leerlo.
    const safeIndex = count > 0 ? index % count : 0;

    return [safeIndex, setIndex] as const;
}
