// features/service/ui/restoration-compare/RestorationThumbs.tsx
//
// Miniaturas para elegir qué restauración se compara. La elegida sube un poco, lleva anillo
// amarillo y cambia a la forma "hoja".

import CoverImage from "@/shared/ui/cover-image/CoverImage";
import { EASE_IL, SHAPE_LEAF, SHAPE_SOFT } from "@/shared/lib/ilDesign";
import type { RestorationCard } from "@/features/service/lib/buildRestorationCards";

type Props = {
    works: RestorationCard[];
    activeIndex: number;
    onPick: (index: number) => void;
};

export default function RestorationThumbs({ works, activeIndex, onPick }: Props) {
    return (
        <div className="flex flex-col gap-3 pt-2">
            <span className="il-display text-[13px] font-bold tracking-[.14em] text-il-neutro-400">
                TOQUE UN TRABAJO PARA COMPARARLO
            </span>
            <div className="flex flex-wrap gap-3.5">
                {works.map((work, i) => {
                    const isActive = i === activeIndex;
                    return (
                        <button
                            key={work.key}
                            type="button"
                            onClick={() => onPick(i)}
                            aria-label={`Comparar ${work.title}`}
                            aria-pressed={isActive}
                            className="flex w-24 cursor-pointer flex-col items-start gap-2 border-0 bg-transparent p-0 text-left"
                        >
                            <span
                                className="relative block size-24 overflow-hidden bg-il-neutro-700"
                                style={{
                                    borderRadius: isActive ? SHAPE_LEAF : SHAPE_SOFT,
                                    outline: `3px solid ${isActive ? "var(--color-il-amarillo-500)" : "transparent"}`,
                                    outlineOffset: 3,
                                    transform: `translateY(${isActive ? -4 : 0}px)`,
                                    transition: `all 400ms ${EASE_IL}`,
                                }}
                            >
                                <span className="pointer-events-none absolute inset-0 block">
                                    <CoverImage url={work.after.url} alt="" />
                                </span>
                            </span>
                            <span
                                className="text-sm font-semibold leading-[1.3]"
                                style={{ color: isActive ? "#fff" : "var(--color-il-neutro-300)" }}
                            >
                                {work.title}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
