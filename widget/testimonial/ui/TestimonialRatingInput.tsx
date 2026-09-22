"use client";

import { useState } from "react";
import { motion } from "framer-motion";

type TestimonialRatingInputProps = {
    value: number | null;
    onChange: (value: number) => void;
};

const RATING_LABELS: Record<number, string> = {
    1: "Malo",
    2: "Regular",
    3: "Bueno",
    4: "Muy bueno",
    5: "Excelente",
};

// Estrellas 1 a 5, animadas al hover/click con framer-motion (ya es dependencia del proyecto,
// no se agrega nada nuevo) — mismo ícono (`fas fa-star`) que `TestimonialStars.tsx`, que es de
// solo lectura, para que la vista previa del testimonio luzca idéntica a esta selección. Más
// grandes en desktop, más chicas en mobile vía los tamaños de texto responsivos de Tailwind
// (el ícono hereda font-size).
export default function TestimonialRatingInput({ value, onChange }: TestimonialRatingInputProps) {
    const [hovered, setHovered] = useState<number | null>(null);
    const active = hovered ?? value ?? 0;

    return (
        <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 sm:gap-3 md:gap-4" onMouseLeave={() => setHovered(null)}>
                {Array.from({ length: 5 }).map((_, index) => {
                    const starValue = index + 1;
                    const filled = starValue <= active;

                    return (
                        <motion.button
                            key={starValue}
                            type="button"
                            onClick={() => onChange(starValue)}
                            onMouseEnter={() => setHovered(starValue)}
                            whileHover={{ scale: 1.25, rotate: -6 }}
                            whileTap={{ scale: 0.9 }}
                            transition={{ type: "spring", stiffness: 400, damping: 15 }}
                            aria-label={`${starValue} de 5 estrellas`}
                            className="text-5xl leading-none focus:outline-none sm:text-6xl md:text-7xl"
                        >
                            <i className={`fas fa-star ${filled ? "text-amber-400" : "text-slate-300"}`} />
                        </motion.button>
                    );
                })}
            </div>

            <span className="text-base font-medium text-slate-500 sm:text-lg md:text-xl">
                {active > 0 ? RATING_LABELS[active] : "Sin valorar"}
            </span>
        </div>
    );
}
