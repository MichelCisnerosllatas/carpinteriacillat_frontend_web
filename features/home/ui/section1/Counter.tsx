"use client";

import { useEffect, useRef, useState } from "react";

type CounterProps = {
    target: number;
    suffix?: string;
    duration?: number;
    className?: string;
};

export default function Counter({
    target,
    suffix = "",
    duration = 1500,
    className,
}: CounterProps) {
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
}
