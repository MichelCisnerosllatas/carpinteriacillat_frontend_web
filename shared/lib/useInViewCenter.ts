// shared/lib/useInViewCenter.ts
//
// true cuando el elemento está pasando por la franja central de la pantalla (el 20% del medio).
// En celular se usa en lugar del hover: la tarjeta que la persona tiene "enfrente" al hacer
// scroll se ve como si tuviera el mouse encima.
//
// - `enabled` en false apaga el observador (ej. en escritorio, donde ya hay hover) y el hook
//   devuelve false.
"use client";

import { useEffect, useState, type RefObject } from "react";

// Recorta 40% arriba y 40% abajo de la pantalla: solo cuenta la franja del medio.
const CENTER_BAND = "-40% 0px -40% 0px";

export function useInViewCenter(ref: RefObject<Element | null>, enabled = true): boolean {
    const [inCenter, setInCenter] = useState(false);

    useEffect(() => {
        const element = ref.current;
        if (!enabled || !element || !("IntersectionObserver" in window)) return;

        const observer = new IntersectionObserver(([entry]) => setInCenter(entry.isIntersecting), {
            rootMargin: CENTER_BAND,
        });
        observer.observe(element);
        return () => observer.disconnect();
    }, [ref, enabled]);

    return enabled && inCenter;
}
