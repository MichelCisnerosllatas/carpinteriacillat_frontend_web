// features/service/ui/restoration-compare/RestorationCompare.tsx
//
// Sección "Restauración de muebles" de Servicios (section_type "restoration_compare"):
// fondo oscuro, textos de la sección a la izquierda y el comparador antes/después a la
// derecha (abajo en móvil).
//
// Los trabajos a comparar son los items de la sección (intranet, pestaña Trabajos). Cada uno
// usa sus fotos propias "antes"/"después" o, si no tiene, las del mueble en la galería
// (ver buildRestorationCards.ts). Si no hay ninguno, solo se muestran los textos.
// Lo que el intranet oculte en "Elementos de las tarjetas" (card_settings) no se pinta.
"use client";

import { useState } from "react";
import Link from "next/link";
import Container from "@/shared/ui/container/Container";
import PhotoLightbox, { type LightboxSlide } from "@/shared/ui/photo-lightbox/PhotoLightbox";
import NumberedHeading from "@/features/service/ui/shared/NumberedHeading";
import RestorationThumbs from "./RestorationThumbs";
import BeforeAfterSlider from "./BeforeAfterSlider";
import { buildRestorationCards, RESTORATION_CARD_SETTINGS } from "@/features/service/lib/buildRestorationCards";
import { isCardElementVisible } from "@/shared/services/site_service/lib/cardSettings";
import { useSiteWorks } from "@/shared/store/site/useSiteWorks";
import { useLightboxState } from "@/shared/lib/useLightboxState";
import type { SiteSectionDto } from "@/shared/services/site_service/model/siteget.dto";

type Props = {
    section: SiteSectionDto;
};

export default function RestorationCompare({ section }: Props) {
    const allWorks = useSiteWorks();
    const works = buildRestorationCards(section, allWorks);

    // "Elementos de las tarjetas" que el intranet puede ocultar (ausente = visible).
    const showThumbs = isCardElementVisible(section, RESTORATION_CARD_SETTINGS.thumbs);
    const showDetailButton = isCardElementVisible(section, RESTORATION_CARD_SETTINGS.detailButton);

    const [activeIndex, setActiveIndex] = useState(0);
    const [sliderValue, setSliderValue] = useState(50);

    const safeIndex = works.length > 0 ? activeIndex % works.length : 0;
    const activeWork = works[safeIndex];

    // Lightbox con las dos fotos del trabajo elegido: primero "Antes", después "Después".
    const lightbox = useLightboxState();
    const slides: LightboxSlide[] = activeWork
        ? [
              { src: activeWork.before.url, alt: activeWork.before.alt, title: "Antes" },
              { src: activeWork.after.url, alt: activeWork.after.alt, title: "Después" },
          ]
        : [];

    // Al elegir otro trabajo, el comparador vuelve al centro.
    function pickWork(index: number) {
        setActiveIndex(index);
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

                    {showThumbs && works.length > 1 && <RestorationThumbs works={works} activeIndex={safeIndex} onPick={pickWork} />}

                    {/* Solo si se sabe a qué mueble lleva (el key trae su id). */}
                    {showDetailButton && activeWork?.idFurniture != null && (
                        <Link
                            href={`/gallery/${activeWork.idFurniture}`}
                            className="il-display inline-flex min-h-12 items-center gap-3 self-start rounded-full border-[1.5px] border-white/35 bg-transparent py-0 pl-5 pr-2 text-[15px] font-bold text-white transition-all duration-200 hover:gap-4 hover:border-white"
                        >
                            Ver la restauración completa
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
                            works={works}
                            activeIndex={safeIndex}
                            value={sliderValue}
                            onChange={setSliderValue}
                            onExpand={() => lightbox.open(0)}
                            showLabels={isCardElementVisible(section, RESTORATION_CARD_SETTINGS.labels)}
                            showHint={isCardElementVisible(section, RESTORATION_CARD_SETTINGS.hint)}
                            showExpand={isCardElementVisible(section, RESTORATION_CARD_SETTINGS.expand)}
                            autoSweep={isCardElementVisible(section, RESTORATION_CARD_SETTINGS.autoSweep)}
                        />
                    </div>
                )}
            </Container>

            {/* Fuera del comparador para que sus toques no muevan la línea. */}
            <PhotoLightbox slides={slides} index={lightbox.index} open={lightbox.isOpen} onClose={lightbox.close} />
        </section>
    );
}
