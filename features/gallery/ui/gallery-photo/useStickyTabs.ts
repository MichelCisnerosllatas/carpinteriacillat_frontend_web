"use client";

import { useEffect, useRef, useState } from "react";

// Detecta si la barra de tabs de la galería ya llegó "pegada" arriba del
// viewport, para darle una sombra/escala distinta mientras hace scroll.
export function useStickyTabs() {
    const tabRef = useRef<HTMLDivElement | null>(null);
    const [isStuck, setIsStuck] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (!tabRef.current) return;
            const rect = tabRef.current.getBoundingClientRect();
            setIsStuck(rect.top <= 8);
        };

        handleScroll(); // para setear bien al inicio
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return { tabRef, isStuck };
}
