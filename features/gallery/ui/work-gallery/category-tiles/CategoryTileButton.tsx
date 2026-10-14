// features/gallery/ui/work-gallery/category-tiles/CategoryTileButton.tsx
//
// Un botón de la fila de categorías: foto chiquita + nombre + "N trabajos". Marcado se ve
// oscuro y muestra un check amarillo en la esquina.

import CoverImage from "@/shared/ui/cover-image/CoverImage";
import { EASE_IL } from "@/shared/lib/ilDesign";
import { worksLabel } from "@/features/gallery/lib/filterWorks";

type Props = {
    label: string;
    count: number;
    photoUrl: string | null;
    isOn: boolean;
    showCheck: boolean;
    onClick: () => void;
};

export default function CategoryTileButton({ label, count, photoUrl, isOn, showCheck, onClick }: Props) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-pressed={isOn}
            className="relative flex min-h-[60px] flex-none cursor-pointer items-center gap-3 rounded-[18px] border-[1.5px] py-1.5 pl-1.5 pr-[18px] text-left hover:-translate-y-0.5"
            style={{
                borderColor: isOn ? "var(--color-il-neutro-900)" : "var(--color-il-neutro-200)",
                background: isOn ? "var(--color-il-neutro-900)" : "#fff",
                color: isOn ? "#fff" : "var(--color-il-neutro-900)",
                transition: `all 250ms ${EASE_IL}`,
            }}
        >
            <span className="relative size-[46px] flex-none overflow-hidden rounded-xl bg-il-neutro-100">
                <span className="pointer-events-none absolute inset-0 block">
                    <CoverImage url={photoUrl} alt="" />
                </span>
            </span>
            <span className="flex flex-col gap-px">
                <span className="il-display whitespace-nowrap text-[15px] font-bold">{label}</span>
                <span
                    className="whitespace-nowrap text-[13px]"
                    style={{ color: isOn ? "var(--color-il-neutro-300)" : "var(--color-il-neutro-600)" }}
                >
                    {worksLabel(count)}
                </span>
            </span>
            <span
                aria-hidden="true"
                className="absolute -right-[7px] -top-[7px] flex size-6 items-center justify-center rounded-full border-2 border-white bg-il-amarillo-500 text-xs font-extrabold text-il-neutro-900"
                style={{ transform: `scale(${showCheck ? 1 : 0})`, transition: `transform 300ms ${EASE_IL}` }}
            >
                ✓
            </span>
        </button>
    );
}
