// features/gallery/ui/work-gallery/GalleryEmptyState.tsx
//
// Mensaje cuando la búsqueda/filtros no dejan ningún trabajo, con un botón para volver a
// ver todos.

type Props = {
    onReset: () => void;
};

export default function GalleryEmptyState({ onReset }: Props) {
    return (
        <div className="flex flex-col items-center gap-3.5 rounded-[32px] bg-il-neutro-050 px-6 py-16 text-center">
            <h3 className="il-display m-0 text-2xl font-extrabold">No hay trabajos con esa combinación.</h3>
            <p className="m-0 text-base text-il-neutro-600">Quite algún filtro o vuelva a ver todos los trabajos.</p>
            <button
                type="button"
                onClick={onReset}
                className="il-display min-h-11 cursor-pointer rounded-full border-0 bg-brand-gold text-black hover:bg-brand-gold-dark px-[22px] text-[15px] font-bold transition-colors"
            >
                Ver todos los trabajos
            </button>
        </div>
    );
}
