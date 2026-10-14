// features/service/ui/category-coverflow/CategoryCoverflow.tsx
//
// Sección "Muebles a medida" de Servicios (section_type "category_coverflow"): cabecera
// centrada + carrusel 3D con una tarjeta por categoría de mueble.
//
// Las tarjetas salen de los items visibles de tipo "category" de la sección (intranet). Si no
// hay ninguno, solo se muestra la cabecera (ver buildCategoryCards.ts).
// Se cambia de tarjeta con las flechas, los puntos, tocando una tarjeta lateral o deslizando con el dedo/mouse.
"use client";

import { useRef, useState } from "react";
import Container from "@/shared/ui/container/Container";
import NumberedHeading from "@/features/service/ui/shared/NumberedHeading";
import PhotoLightbox from "@/shared/ui/photo-lightbox/PhotoLightbox";
import { toLightboxSlides } from "@/shared/ui/photo-lightbox/toLightboxSlides";
import CoverflowCard from "./CoverflowCard";
import { buildCategoryCards } from "@/features/service/lib/buildCategoryCards";
import { useSiteWorks } from "@/shared/store/site/useSiteWorks";
import { useIsMobile } from "@/shared/lib/useIsMobile";
import { useLightboxState } from "@/shared/lib/useLightboxState";
import { toneAt } from "@/shared/lib/ilDesign";
import { isCardElementVisible } from "@/shared/services/site_service/lib/cardSettings";
import { COVERFLOW_CARD_SETTINGS, type CoverflowCardShow } from "@/features/service/lib/categoryCard";
import type { SiteSectionDto } from "@/shared/services/site_service/model/siteget.dto";

type Props = {
    section: SiteSectionDto;
};

const SWIPE_MIN_PX = 40; // menos que esto se toma como un clic, no como deslizar

// Distancia de la tarjeta `index` a la del centro, por el camino más corto (el carrusel da la
// vuelta: con 6 tarjetas, la última queda a la izquierda de la primera).
function getOffset(index: number, current: number, total: number): number {
    let offset = (((index - current) % total) + total) % total;
    if (offset > total / 2) offset -= total;
    return offset;
}

export default function CategoryCoverflow({ section }: Props) {
    const works = useSiteWorks();
    const cards = buildCategoryCards(section, works);
    const total = cards.length;

    // "Elementos de las tarjetas" que el intranet puede ocultar (ausente = visible).
    const show: CoverflowCardShow = {
        title: isCardElementVisible(section, COVERFLOW_CARD_SETTINGS.title),
        count: isCardElementVisible(section, COVERFLOW_CARD_SETTINGS.count),
        thumbs: isCardElementVisible(section, COVERFLOW_CARD_SETTINGS.thumbs),
        expand: isCardElementVisible(section, COVERFLOW_CARD_SETTINGS.expand),
        link: isCardElementVisible(section, COVERFLOW_CARD_SETTINGS.link),
    };
    const showNav = isCardElementVisible(section, COVERFLOW_CARD_SETTINGS.nav);

    const isMobile = useIsMobile();
    const [current, setCurrent] = useState(0);
    // Foto elegida en el abanico de cada tarjeta: { [card.key]: índice }.
    const [mainPhotos, setMainPhotos] = useState<Record<string, number>>({});
    // Dónde empezó a deslizar (no hace falta re-renderizar por esto, por eso es un ref).
    const swipeStartX = useRef<number | null>(null);

    const lightbox = useLightboxState();

    // Si cambia la cantidad de tarjetas, el índice guardado podría quedar fuera de rango.
    const safeCurrent = total > 0 ? current % total : 0;
    const centerCard = cards[safeCurrent];

    function go(step: number) {
        setCurrent((safeCurrent + step + total) % total);
    }

    function handlePointerUp(clientX: number) {
        const start = swipeStartX.current;
        swipeStartX.current = null;
        if (start === null) return;
        const delta = clientX - start;
        // Deslizar hacia la izquierda avanza; hacia la derecha retrocede.
        if (Math.abs(delta) > SWIPE_MIN_PX) go(delta < 0 ? 1 : -1);
    }

    return (
        // overflow-hidden: las tarjetas laterales se salen del contenedor y no deben generar
        // scroll horizontal en móvil.
        <section className="il-scope overflow-hidden bg-white py-[clamp(3.5rem,8vw,6rem)]">
            <Container className="flex flex-col gap-[clamp(28px,4vw,44px)]">
                <NumberedHeading
                    number={section.section_subtitle}
                    title={section.section_title}
                    description={section.section_description}
                    align="center"
                />

                {total > 0 && (
                    <>
                        <div
                            onPointerDown={(e) => {
                                swipeStartX.current = e.clientX;
                            }}
                            onPointerUp={(e) => handlePointerUp(e.clientX)}
                            className="relative h-[380px] select-none [perspective:1600px] [touch-action:pan-y] min-[760px]:h-[460px]"
                        >
                            {cards.map((card, i) => (
                                <CoverflowCard
                                    key={card.key}
                                    card={card}
                                    offset={getOffset(i, safeCurrent, total)}
                                    tone={toneAt(i)}
                                    isMobile={isMobile}
                                    show={show}
                                    mainPhoto={mainPhotos[card.key] ?? 0}
                                    onPickPhoto={(k) => setMainPhotos({ ...mainPhotos, [card.key]: k })}
                                    onPick={() => setCurrent(i)}
                                    onExpand={() => lightbox.open(mainPhotos[card.key] ?? 0)}
                                />
                            ))}
                        </div>

                        {/* Flechas y puntos (se pueden ocultar; igual queda tocar o deslizar las tarjetas). */}
                        {showNav && (
                            <div className="flex items-center justify-center gap-4">
                                <button
                                    type="button"
                                    onClick={() => go(-1)}
                                    aria-label="Anterior"
                                    className="size-12 cursor-pointer rounded-full border-[1.5px] border-il-neutro-300 bg-white text-[17px] transition-colors hover:border-brand-gold hover:bg-brand-gold hover:text-black"
                                >
                                    ←
                                </button>
                                <div className="flex items-center gap-2">
                                    {cards.map((card, i) => (
                                        <button
                                            key={card.key}
                                            type="button"
                                            onClick={() => setCurrent(i)}
                                            aria-label={`Mostrar ${card.name.toLowerCase()}`}
                                            aria-current={i === safeCurrent}
                                            className="h-2.5 cursor-pointer rounded-full border-0 p-0 transition-all duration-300"
                                            style={{
                                                width: i === safeCurrent ? 28 : 10,
                                                background: i === safeCurrent ? "var(--color-il-neutro-900)" : "var(--color-il-neutro-300)",
                                            }}
                                        />
                                    ))}
                                </div>
                                <button
                                    type="button"
                                    onClick={() => go(1)}
                                    aria-label="Siguiente"
                                    className="size-12 cursor-pointer rounded-full border-0 bg-brand-gold text-black hover:bg-brand-gold-dark text-[17px] transition-colors"
                                >
                                    →
                                </button>
                            </div>
                        )}
                    </>
                )}
            </Container>

            {/* Fuera del carrusel para que sus toques no se tomen como "deslizar". */}
            <PhotoLightbox
                slides={toLightboxSlides(centerCard?.photos ?? [])}
                index={lightbox.index}
                open={lightbox.isOpen}
                onClose={lightbox.close}
            />
        </section>
    );
}
