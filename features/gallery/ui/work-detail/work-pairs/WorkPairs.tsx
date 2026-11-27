// features/gallery/ui/work-detail/work-pairs/WorkPairs.tsx
//
// Bloque "Antes y después" del detalle de un trabajo (/gallery/[id]): el mismo comparador de
// la sección Restauración de Servicios (shared/ui/before-after), con los pares Antes/Después
// del trabajo (work.pairs, solo restauraciones).
//
// - Si el trabajo tiene varios pares, debajo va el selector de pares (miniaturas); al cambiar
//   de par la línea vuelve al centro (50). Si el intranet apagó el selector, se compara el
//   primer par.
// - "Ver en grande" abre el par elegido en el lightbox (Antes y Después).
// - Textos y partes del comparador salen de la Apariencia (grupo "pairs": eyebrow, título,
//   etiquetas, ayuda, barrido, ver en grande, selector). Ancla data-el="detail-pairs".
// - Lo pinta WorkDetail solo si hay pares válidos y el intranet no apagó pairs.show.
//   Las fotos de galería (photos) no incluyen las de los pares: no se repiten arriba.
"use client";

import { useState } from "react";
import Container from "@/shared/ui/container/Container";
import SectionHeading from "@/shared/components/section_heading/SectionHeading";
import PhotoLightbox from "@/shared/ui/photo-lightbox/PhotoLightbox";
import BeforeAfterSlider, { type BeforeAfterFrame } from "@/shared/ui/before-after/BeforeAfterSlider";
import BeforeAfterPairNav from "@/shared/ui/before-after/BeforeAfterPairNav";
import { toPairLightboxSlides } from "@/shared/ui/before-after/toPairLightboxSlides";
import { useLightboxState } from "@/shared/lib/useLightboxState";
import { DEFAULT_DETAIL_SETTINGS, type DetailPairsSettings } from "@/features/gallery/lib/workGallerySettings";
import type { WorkPair } from "@/shared/services/site_service/lib/workPhotos";

type Props = {
    title: string; // título del trabajo (texto alternativo de las fotos)
    pairs: WorkPair[]; // pares válidos (al menos 1), ver getWorkPairs()
    settings?: DetailPairsSettings;
};

export default function WorkPairs({ title, pairs, settings = DEFAULT_DETAIL_SETTINGS.pairs }: Props) {
    const [pairIndex, setPairIndex] = useState(0);
    const [sliderValue, setSliderValue] = useState(50);
    const lightbox = useLightboxState();

    // Sin selector de pares, siempre el primero.
    const safeIndex = settings.showPairNav && pairs.length > 0 ? pairIndex % pairs.length : 0;
    const activePair = pairs[safeIndex];
    const frames: BeforeAfterFrame[] = pairs.map((pair) => ({ key: pair.key, title, before: pair.before, after: pair.after }));
    const showNav = settings.showPairNav && pairs.length > 1;

    function pickPair(index: number) {
        setPairIndex(index);
        setSliderValue(50);
    }

    if (pairs.length === 0) return null;

    return (
        <section data-el="detail-pairs" className="pb-[clamp(3.5rem,8vw,6rem)]">
            <Container className="flex flex-col gap-7">
                {/* markElements={false}: estos textos son del grupo "pairs", no del Encabezado de la sección. */}
                <SectionHeading subtitle={settings.eyebrow} title={settings.title} align="left" markElements={false} />

                <div className="flex w-full max-w-[640px] flex-col gap-3.5">
                    <BeforeAfterSlider
                        frames={frames}
                        activeIndex={safeIndex}
                        value={sliderValue}
                        onChange={setSliderValue}
                        onExpand={() => lightbox.open(0)}
                        showLabels={settings.showLabels}
                        showHint={settings.showHint}
                        showExpand={settings.showExpand}
                        autoSweep={settings.autoSweep}
                        className="aspect-[4/3.4]"
                    />
                    {/* Con un solo par (o sin selector) no se pinta el selector; el pie se muestra igual. */}
                    {showNav ? (
                        <BeforeAfterPairNav pairs={pairs} activeIndex={safeIndex} onPick={pickPair} tone="light" />
                    ) : (
                        activePair?.caption && <span className="text-[15px] text-il-neutro-600">{activePair.caption}</span>
                    )}
                </div>
            </Container>

            {/* Fuera del comparador para que sus toques no muevan la línea. */}
            <PhotoLightbox slides={toPairLightboxSlides(activePair)} index={lightbox.index} open={lightbox.isOpen} onClose={lightbox.close} />
        </section>
    );
}
