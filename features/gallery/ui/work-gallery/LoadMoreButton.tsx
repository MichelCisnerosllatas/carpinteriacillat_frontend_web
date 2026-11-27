// features/gallery/ui/work-gallery/LoadMoreButton.tsx
//
// Debajo de la grilla de la Galería: «Mostrando 12 de 48 trabajos» y el botón «Ver más trabajos».
// No se pinta si ya se ven todos. Textos y contador vienen de la Apariencia (grupo "pagination":
// pagination.button_label y pagination.show_counter); su ancla es "gallery-load-more".

type Props = {
    shown: number; // trabajos que se están viendo
    total: number; // trabajos que hay con los filtros actuales
    buttonLabel: string;
    showCounter: boolean;
    onLoadMore: () => void;
};

export default function LoadMoreButton({ shown, total, buttonLabel, showCounter, onLoadMore }: Props) {
    if (shown >= total) return null;

    return (
        <div data-el="gallery-load-more" className="mt-10 flex flex-col items-center gap-3">
            {showCounter && (
                <p className="text-[15px] text-il-neutro-600" aria-live="polite">
                    Mostrando {shown} de {total} {total === 1 ? "trabajo" : "trabajos"}
                </p>
            )}
            <button
                type="button"
                onClick={onLoadMore}
                className="il-display inline-flex min-h-12 items-center justify-center rounded-full border-[1.5px] border-il-neutro-900 bg-white px-8 text-[15px] font-bold text-il-neutro-900 transition-colors hover:bg-il-neutro-900 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-il-amarillo-500"
            >
                {buttonLabel}
            </button>
        </div>
    );
}
