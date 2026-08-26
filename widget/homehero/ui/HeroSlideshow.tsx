"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import type { Slide } from "../model/types";

type HeroSlideshowProps = {
    slides: Slide[];
    intervalMs?: number;
};

// Carrusel de fondo del hero de la home (autoplay + indicadores). Antes
// vivía mezclado dentro de Section1.tsx junto con el Counter y el resto
// del contenido.
export default function HeroSlideshow({
    slides,
    intervalMs = 5000,
}: HeroSlideshowProps) {
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        if (slides.length === 0) return;

        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, intervalMs);

        return () => clearInterval(interval);
    }, [slides.length, intervalMs]);

    return (
        <>
            <div className="absolute inset-0 z-0">
                {slides.map((slide, index) => (
                    <div
                        key={slide.alt}
                        className={`slide ${
                            index === currentSlide ? "slide-active" : ""
                        } absolute inset-0`}
                    >
                        <img
                            src={slide.src}
                            alt={slide.alt}
                            className="w-full h-full object-fill"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/70 to-transparent" />
                    </div>
                ))}
            </div>

            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-10">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        type="button"
                        onClick={() => setCurrentSlide(index)}
                        className={clsx(
                            "slide-indicator w-3 h-3 rounded-full transition-all",
                            index === currentSlide ? "bg-white" : "bg-white/50"
                        )}
                        aria-label={`Ir al slide ${index + 1}`}
                    />
                ))}
            </div>
        </>
    );
}
