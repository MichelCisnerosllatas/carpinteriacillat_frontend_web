// features/gallery/ui/work-gallery/GalleryEmptyState.tsx
//
// Mensaje cuando la búsqueda/filtros no dejan ningún trabajo, con un botón para volver a
// ver todos. Título, texto y botón se editan en la Apariencia de la sección (grupo "empty");
// el texto puede quedar vacío (entonces no se pinta).

import type { GalleryEmptySettings } from "@/features/gallery/lib/workGallerySettings";

type Props = {
    onReset: () => void;
    texts: GalleryEmptySettings;
};

export default function GalleryEmptyState({ onReset, texts }: Props) {
    return (
        <div data-el="gallery-empty" className="flex flex-col items-center gap-3.5 rounded-[32px] bg-il-neutro-050 px-6 py-16 text-center">
            <h3 className="il-display m-0 text-2xl font-extrabold">{texts.title}</h3>
            {texts.text && <p className="m-0 text-base text-il-neutro-600">{texts.text}</p>}
            <button
                type="button"
                onClick={onReset}
                className="il-display min-h-11 cursor-pointer rounded-full border-0 bg-brand-gold text-black hover:bg-brand-gold-dark px-[22px] text-[15px] font-bold transition-colors"
            >
                {texts.buttonLabel}
            </button>
        </div>
    );
}
