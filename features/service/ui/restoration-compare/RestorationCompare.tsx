// features/service/ui/restoration-compare/RestorationCompare.tsx
//
// Sección "Restauración de muebles" de Servicios (section_type "restoration_compare"):
// fondo oscuro, textos de la sección a la izquierda y el comparador antes/después a la
// derecha (abajo en móvil).
//
// Los trabajos a comparar son los trabajos del portafolio de tipo "restoration" con al menos
// un par Antes/Después (ver buildRestorationCards.ts); la sección ya no tiene items propios.
// Si no hay ninguno, solo se muestran los textos.
//
// Estado: trabajo elegido (miniaturas de la izquierda), par elegido dentro de ese trabajo
// (selector de pares debajo del comparador) y posición de la línea. Al cambiar de trabajo o
// de par la línea vuelve al centro (50).
// Lo que el intranet oculte en la Apariencia de la sección (display_settings, grupo "compare")
// no se pinta; el texto del botón «Ver la restauración completa» también sale de ahí. Cada
// parte lleva su ancla data-el (la vista previa del intranet la resalta).
"use client";

import { useState } from "react";
import Link from "next/link";
import Container from "@/shared/ui/container/Container";
import PhotoLightbox from "@/shared/ui/photo-lightbox/PhotoLightbox";
import BeforeAfterSlider, { type BeforeAfterFrame } from "@/shared/ui/before-after/BeforeAfterSlider";
import BeforeAfterPairNav from "@/shared/ui/before-after/BeforeAfterPairNav";
import { toPairLightboxSlides } from "@/shared/ui/before-after/toPairLightboxSlides";
import NumberedHeading from "@/features/service/ui/shared/NumberedHeading";
import RestorationThumbs from "./RestorationThumbs";
import { buildRestorationCards, getRestorationDisplay } from "@/features/service/lib/buildRestorationCards";
import { useSiteWorks } from "@/shared/store/site/useSiteWorks";
import { useLightboxState } from "@/shared/lib/useLightboxState";
import type { SiteSectionDto } from "@/shared/services/site_service/model/siteget.dto";

type Props = {
    section: SiteSectionDto;
};

export default function RestorationCompare({ section }: Props) {
    const allWorks = useSiteWorks();
    const works = buildRestorationCards(section, allWorks);

    // Apariencia de la sección (lo que falte usa el default del catálogo: visible).
    const display = getRestorationDisplay(section);
    const { showThumbs, showPairNav, showDetailButton } = display;

    const [activeIndex, setActiveIndex] = useState(0);
    const [pairIndex, setPairIndex] = useState(0);
    const [sliderValue, setSliderValue] = useState(50);

    const safeIndex = works.length > 0 ? activeIndex % works.length : 0;
    const activeWork = works[safeIndex];
    // Si el selector de pares está apagado, siempre se compara el primer par.
    const pairCount = activeWork?.pairs.length ?? 0;
    const safePair = showPairNav && pairCount > 0 ? pairIndex % pairCount : 0;
    const activePair = activeWork?.pairs[safePair];

    // Todos los pares de todos los trabajos apilados en el comparador (fundido al cambiar).
    const frames: BeforeAfterFrame[] = works.flatMap((work) =>
        work.pairs.map((pair) => ({ key: `${work.key}-${pair.key}`, title: work.title, before: pair.before, after: pair.after }))
    );
    const activeFrame = activeWork && activePair ? frames.findIndex((f) => f.key === `${activeWork.key}-${activePair.key}`) : 0;

    // Lightbox con las dos fotos del par elegido: primero "Antes", después "Después".
    const lightbox = useLightboxState();
    const slides = toPairLightboxSlides(activePair);

    // Al elegir otro trabajo: su primer par y el comparador al centro.
    function pickWork(index: number) {
        setActiveIndex(index);
        setPairIndex(0);
        setSliderValue(50);
    }

    // Al elegir otro par del mismo trabajo: el comparador al centro.
    function pickPair(index: number) {
        setPairIndex(index);
        setSliderValue(50);
    }

    return (
        <section className="il-scope bg-il-neutro-900 py-[clamp(3.5rem,8vw,6rem)] text-white">
            <Container className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] items-center gap-[clamp(36px,6vw,72px)]">
                <div className="flex min-w-0 flex-col gap-5">
                    <NumberedHeading
                        number={section.section_subtitle}
                        title={section.section_title}
                        description={section.section_description}
                        align="left"
                        dark
                    />

                    {showThumbs && works.length > 1 && (
                        <div data-el="restoration-thumbs">
                            <RestorationThumbs works={works} activeIndex={safeIndex} onPick={pickWork} />
                        </div>
                    )}

                    {/* Todo trabajo de works está publicado: su página /gallery/<id> siempre existe. */}
                    {showDetailButton && activeWork && (
                        <Link
                            href={`/gallery/${activeWork.idWebWork}`}
                            data-el="restoration-detail-button"
                            className="il-display inline-flex min-h-12 items-center gap-3 self-start rounded-full border-[1.5px] border-white/35 bg-transparent py-0 pl-5 pr-2 text-[15px] font-bold text-white transition-all duration-200 hover:gap-4 hover:border-white"
                        >
                            {display.detailButtonLabel}
                            <span
                                aria-hidden="true"
                                className="inline-flex size-[34px] items-center justify-center rounded-full bg-il-amarillo-500 text-il-neutro-900"
                            >
                                →
                            </span>
                        </Link>
                    )}
                </div>

                {works.length > 0 && (
                    <div className="flex min-w-0 flex-col gap-3.5">
                        <BeforeAfterSlider
                            frames={frames}
                            activeIndex={Math.max(activeFrame, 0)}
                            value={sliderValue}
                            onChange={setSliderValue}
                            onExpand={() => lightbox.open(0)}
                            showLabels={display.showLabels}
                            showHint={display.showHint}
                            showExpand={display.showExpand}
                            autoSweep={display.autoSweep}
                            elements={{
                                slider: "restoration-slider",
                                labels: "restoration-labels",
                                hint: "restoration-hint",
                                expand: "restoration-expand",
                            }}
                        />
                        {showPairNav && activeWork && (
                            <div data-el="restoration-pair-nav">
                                <BeforeAfterPairNav pairs={activeWork.pairs} activeIndex={safePair} onPick={pickPair} tone="dark" />
                            </div>
                        )}
                    </div>
                )}
            </Container>

            {/* Fuera del comparador para que sus toques no muevan la línea. */}
            <PhotoLightbox slides={slides} index={lightbox.index} open={lightbox.isOpen} onClose={lightbox.close} />
        </section>
    );
}
