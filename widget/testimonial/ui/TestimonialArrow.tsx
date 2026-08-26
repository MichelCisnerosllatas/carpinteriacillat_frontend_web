type TestimonialArrowProps = {
    direction: "left" | "right";
    onClick: () => void;
    className?: string;
};

export default function TestimonialArrow({
    direction,
    onClick,
    className = "",
}: TestimonialArrowProps) {
    const isLeft = direction === "left";

    return (
        <button
            type="button"
            aria-label={
                isLeft ? "Ver testimonio anterior" : "Ver siguiente testimonio"
            }
            onClick={onClick}
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