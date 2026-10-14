import { forwardRef } from "react";

type TestimonialArrowProps = {
    direction: "left" | "right";
    className?: string;
};

// forwardRef: el modulo Navigation de Swiper necesita el nodo <button> real
// (prevEl/nextEl) para engancharse — ver SectionTestimonial.tsx. Ya no recibe
// onClick por prop: el propio modulo maneja el click (y el loop, y el estado
// disabled si loop=false).
const TestimonialArrow = forwardRef<HTMLButtonElement, TestimonialArrowProps>(
    function TestimonialArrow({ direction, className = "" }, ref) {
        const isLeft = direction === "left";

        return (
            <button
                ref={ref}
                type="button"
                aria-label={
                    isLeft ? "Ver testimonio anterior" : "Ver siguiente testimonio"
                }
                className={className}
            >
                <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                >
                    {isLeft ? (
                        <path d="M15 18l-6-6 6-6" />
                    ) : (
                        <path d="M9 18l6-6-6-6" />
                    )}
                </svg>
            </button>
        );
    }
);

export default TestimonialArrow;
