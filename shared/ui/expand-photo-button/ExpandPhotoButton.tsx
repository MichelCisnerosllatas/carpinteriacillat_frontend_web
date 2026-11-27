// shared/ui/expand-photo-button/ExpandPhotoButton.tsx
//
// Botón redondo blanco (semitransparente) con el ícono de "expandir" que abre la foto en
// grande (PhotoLightbox). Se pone encima de fotos que ya hacen otra cosa al tocarlas
// (navegar, arrastrar, cambiar de panel), por eso corta el evento acá:
//   - preventDefault: si está dentro de un <Link>, no navega.
//   - stopPropagation: el clic/toque no llega al panel, carrusel o comparador de abajo.
//
// La posición la decide quien lo usa con `className` (ej. "absolute right-3 top-3 z-10").
// `dataEl`: ancla data-el de la Apariencia de la sección (la vista previa del intranet lo resalta).
"use client";

type Props = {
    onClick: () => void;
    className?: string;
    dataEl?: string;
};

export default function ExpandPhotoButton({ onClick, className = "", dataEl }: Props) {
    return (
        <button
            type="button"
            data-el={dataEl}
            aria-label="Ver foto en grande"
            title="Ver foto en grande"
            onPointerDown={(e) => {
                // Que no empiece el arrastre del comparador ni el swipe del carrusel.
                e.stopPropagation();
            }}
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onClick();
            }}
            className={`inline-flex size-10 min-h-10 min-w-10 flex-none cursor-pointer items-center justify-center rounded-full bg-white/85 text-[15px] text-il-neutro-900 shadow-[0_6px_16px_rgba(20,24,31,.22)] backdrop-blur-sm transition-transform duration-200 hover:scale-110 hover:bg-white ${className}`}
        >
            <i className="fa-solid fa-expand" aria-hidden="true" />
        </button>
    );
}
