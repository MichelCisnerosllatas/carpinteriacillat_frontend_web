// widget/main/section1/Section1.tsx
"use client";

import { useEffect, useState, useRef } from "react";

type Slide = {
    src: string;
    alt: string;
};

const slides: Slide[] = [
    {
        src: "https://demo.carpinteriacillat.com/storage/imgsistema/imgmuestra/fotocillat3.jpg",
        alt: "Cocina",
    },
    {
        src: "https://demo.carpinteriacillat.com/storage/imgsistema/imgmuestra/fotocillat1.jpg",
        alt: "Dormitorio",
    },
    {
        src: "https://demo.carpinteriacillat.com/storage/imgsistema/imgmuestra/fotocillat4.jpg",
        alt: "Oficina",
    },
];

type CounterProps = {
    target: number;
    suffix?: string;
    duration?: number;
    className?: string;
};

const Counter = ({
                     target,
                     suffix = "",
                     duration = 1500,
                     className,
                 }: CounterProps) => {
    const [value, setValue] = useState(0);
    const ref = useRef<HTMLSpanElement | null>(null);
    const hasAnimated = useRef(false);

    useEffect(() => {
        if (!ref.current) return;

        const el = ref.current;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !hasAnimated.current) {
                        hasAnimated.current = true;

                        const start = performance.now();

                        const animate = (time: number) => {
                            const progress = Math.min((time - start) / duration, 1);
                            const current = Math.floor(progress * target);
                            setValue(current);

                            if (progress < 1) {
                                requestAnimationFrame(animate);
                            }
                        };

                        requestAnimationFrame(animate);
                        observer.unobserve(el);
                    }
                });
            },
            { threshold: 0.3 }
        );

        observer.observe(el);

        return () => observer.disconnect();
    }, [target, duration]);

    return (
        <span ref={ref} className={className}>
      {value.toLocaleString("es-PE")}
            {suffix}
    </span>
    );
};

export default function Section1() {
    const [currentSlide, setCurrentSlide] = useState(0);

    // Auto-play del carrusel
    useEffect(() => {
        if (slides.length === 0) return;
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const goToSlide = (index: number) => {
        setCurrentSlide(index);
    };

    return (
        <section id="inicio" className="relative py-20 overflow-hidden flex items-center min-h-screen px-2 sm:px-0">
            {/* Carrusel de fondo */}
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

            {/* Contenido Hero */}
            <div className="container mx-auto relative z-10 pt-24 md:pt-32 md:pl-4">
                <div className="max-w-3xl">
                    <h2 className="text-4xl md:text-7xl font-extrabold text-white mb-6 leading-tight">
                        Creamos <span className="text-amber-400">Espacios</span>
                        <br />
                        Extraordinarios
                    </h2>
                    <p className="text-xl text-gray-200 mb-8 leading-relaxed">
                        Fabricación de muebles a medida con diseños únicos y calidad
                        premium. Transformamos tus ideas en realidad con más de 15 años de
                        experiencia.
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <a
                            href="#contacto"
                            className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-2xl hover:shadow-red-500/50 hover:scale-105"
                        >
                            <i className="fas fa-phone-alt mr-2" />
                            Cotizar Ahora
                        </a>
                        <a
                            href="#galeria"
                            className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white px-8 py-4 rounded-full font-bold text-lg transition-all border-2 border-white/30"
                        >
                            <i className="fas fa-images mr-2" />
                            Ver Trabajos
                        </a>
                    </div>

                    {/* Stats con contadores */}
                    <div className="grid grid-cols-3 gap-6 mt-5">
                        <div className="text-center">
                            <div className="text-4xl font-bold text-amber-400 mb-1">
                                <Counter target={15} suffix="+" />
                            </div>
                            <div className="text-gray-300 text-sm">Años Experiencia</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-bold text-amber-400 mb-1">
                                <Counter target={500} suffix="+" />
                            </div>
                            <div className="text-gray-300 text-sm">Proyectos</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-bold text-amber-400 mb-1">
                                <Counter target={98} suffix="%" />
                            </div>
                            <div className="text-gray-300 text-sm">Satisfacción</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Indicadores del carrusel */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-10">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        type="button"
                        onClick={() => goToSlide(index)}
                        className={clsx(
                            "slide-indicator w-3 h-3 rounded-full transition-all",
                            index === currentSlide ? "bg-white" : "bg-white/50"
                        )}
                        aria-label={`Ir al slide ${index + 1}`}
                    />
                ))}
            </div>
        </section>
    );
}

// helper clsx local si no quieres instalar el paquete:
function clsx(...classes: (string | boolean | undefined)[]) {
    return classes.filter(Boolean).join(" ");
}
