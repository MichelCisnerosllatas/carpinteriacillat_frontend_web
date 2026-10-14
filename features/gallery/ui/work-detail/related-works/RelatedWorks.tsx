// features/gallery/ui/work-detail/related-works/RelatedWorks.tsx
//
// "Otros trabajos que le pueden gustar": trabajos parecidos (ver getRelatedWorks.ts) en una
// fila con scroll horizontal. Las flechas mueven la fila de a una tarjeta y SOLO aparecen
// cuando hay tarjetas que no se ven (useScrollArrows); al llegar a un extremo, esa flecha se
// deshabilita. Cada tarjeta está en RelatedWorkCard.tsx.
"use client";

import { useRef } from "react";
import Container from "@/shared/ui/container/Container";
import { headingStyles as hs } from "@/shared/components/section_heading/sectionHeading.styles";
import RelatedWorkCard from "./RelatedWorkCard";
import { useScrollArrows } from "./useScrollArrows";
import { getRelatedWorks } from "@/features/gallery/lib/getRelatedWorks";
import type { SiteWorkDto } from "@/shared/services/site_service/model/siteget.dto";

type Props = {
    work: SiteWorkDto;
    works: SiteWorkDto[];
};

const ARROW_CLASS =
    "inline-flex size-[52px] cursor-pointer items-center justify-center rounded-full text-lg transition-colors disabled:cursor-not-allowed disabled:opacity-35";

export default function RelatedWorks({ work, works }: Props) {
    const related = getRelatedWorks(work, works);
    const rowRef = useRef<HTMLDivElement>(null);
    const { hasOverflow, canPrev, canNext, scrollByCard } = useScrollArrows(rowRef);

    if (related.length === 0) return null;

    return (
        <section className="pb-[clamp(3.5rem,8vw,6.5rem)]">
            <Container className="flex flex-col gap-7">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <h2 className={`${hs.title} ${hs.sectionTitleSize} ${hs.titleColor.light}`}>
                        Otros trabajos que le pueden gustar
                    </h2>
                    {hasOverflow && (
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => scrollByCard(-1)}
                                disabled={!canPrev}
                                aria-label="Ver trabajos anteriores"
                                className={`${ARROW_CLASS} border-[1.5px] border-il-neutro-300 bg-white text-il-neutro-900 enabled:hover:border-brand-gold enabled:hover:bg-brand-gold enabled:hover:text-black`}
                            >
                                ←
                            </button>
                            <button
                                type="button"
                                onClick={() => scrollByCard(1)}
                                disabled={!canNext}
                                aria-label="Ver más trabajos"
                                className={`${ARROW_CLASS} border-0 bg-brand-gold text-black enabled:hover:bg-brand-gold-dark`}
                            >
                                →
                            </button>
                        </div>
                    )}
                </div>

                {/* Fila con scroll horizontal (también se puede deslizar con el dedo).
                    Tarjetas por vista: ~1 en celular, 2 en tablet, 3 en desktop. */}
                <div
                    ref={rowRef}
                    className="flex snap-x snap-mandatory gap-7 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                >
                    {related.map((item, i) => (
                        <div
                            key={item.id_furniture}
                            className="flex-none basis-[80%] snap-start sm:basis-[calc((100%-28px)/2)] lg:basis-[calc((100%-56px)/3)]"
                        >
                            <RelatedWorkCard work={item} index={i} />
                        </div>
                    ))}
                </div>
            </Container>
        </section>
    );
}
