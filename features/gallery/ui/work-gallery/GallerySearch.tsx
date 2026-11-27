// features/gallery/ui/work-gallery/GallerySearch.tsx
//
// Buscador grande de la galería (forma de píldora). Busca en título, categoría, madera,
// estilo, lugar y acabado (ver filterWorks.ts). El texto de ayuda (placeholder) se edita en la
// Apariencia de la sección (search.placeholder).

type Props = {
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
};

export default function GallerySearch({ value, onChange, placeholder }: Props) {
    return (
        <label data-el="gallery-search" className="flex min-h-16 items-center gap-3.5 rounded-full bg-il-neutro-100 py-0 pl-6 pr-2.5">
            <span aria-hidden="true" className="text-[22px] text-il-neutro-600">
                ⌕
            </span>
            <input
                type="search"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                aria-label="Buscar trabajos"
                className="h-[60px] min-w-0 flex-1 border-0 bg-transparent text-[17px] text-il-neutro-900 outline-none"
            />
            {value && (
                <button
                    type="button"
                    onClick={() => onChange("")}
                    aria-label="Borrar búsqueda"
                    className="size-11 flex-none cursor-pointer rounded-full border-0 bg-white text-base"
                >
                    ✕
                </button>
            )}
        </label>
    );
}
