type TestimonialStarsProps = {
    rating?: number;
};

export default function TestimonialStars({
    rating = 5,
}: TestimonialStarsProps) {
    const safeRating = Math.min(
        Math.max(rating, 0),
        5
    );

    return (
        <div
            className="mt-1 flex items-center gap-1"
            aria-label={`${safeRating} de 5 estrellas`}
        >
            {Array.from({ length: 5 }).map(
                (_, index) => (
                    <i
                        key={index}
                        className={`fas fa-star text-xs ${
                            index < safeRating
                                ? "text-amber-400"
                                : "text-slate-600"
                        }`}
                    />
                )
            )}
        </div>
    );
}