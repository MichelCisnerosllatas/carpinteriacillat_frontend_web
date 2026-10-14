// features/gallery/ui/work-detail/photo-viewer/PhotoDots.tsx
//
// Flechas anterior/siguiente + puntitos (el activo es más largo). En Abanico hay un punto por
// foto; en Libro, uno por "página" (ver WorkDetail.tsx).

type Props = {
    count: number;
    activeIndex: number;
    dotLabel: (index: number) => string;
    onGo: (index: number) => void;
    onPrevious: () => void;
    onNext: () => void;
};

export default function PhotoDots({ count, activeIndex, dotLabel, onGo, onPrevious, onNext }: Props) {
    return (
        <div className="flex items-center justify-center gap-4">
            <button
                type="button"
                onClick={onPrevious}
                aria-label="Anterior"
                className="size-12 cursor-pointer rounded-full border-[1.5px] border-il-neutro-300 bg-white text-[17px] transition-colors hover:border-brand-gold hover:bg-brand-gold hover:text-black"
            >
                ←
            </button>
            <div className="flex flex-wrap items-center justify-center gap-2">
                {Array.from({ length: count }, (_, i) => {
                    const isActive = i === activeIndex;
                    return (
                        <button
                            key={i}
                            type="button"
                            onClick={() => onGo(i)}
                            aria-label={dotLabel(i)}
                            aria-current={isActive}
                            className="h-2.5 cursor-pointer rounded-full border-0 p-0 transition-all duration-300"
                            style={{
                                width: isActive ? 28 : 10,
                                background: isActive ? "var(--color-il-neutro-900)" : "var(--color-il-neutro-300)",
                            }}
                        />
                    );
                })}
            </div>
            <button
                type="button"
                onClick={onNext}
                aria-label="Siguiente"
                className="size-12 cursor-pointer rounded-full border-0 bg-brand-gold text-black hover:bg-brand-gold-dark text-[17px] transition-colors"
            >
                →
            </button>
        </div>
    );
}
