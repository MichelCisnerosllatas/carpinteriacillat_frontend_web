// features/service/ui/service-showcase/ServiceShowcase.tsx
//
// Hero de la página Servicios (section_type "service_showcase"): título con subrayado
// animado, párrafo, pestañas con barra de progreso y un acordeón de paneles (uno por
// servicio) que rota solo cada 6 s.
//
// De dónde sale cada cosa (todo editable en el intranet):
//   - section_subtitle  -> antetítulo con raya amarilla
//   - section_title     -> título grande (h1)
//   - section_description -> párrafo
//   - items (tipo "showcase") -> un panel por item: title, description, label (texto del
//     botón) y link (a dónde lleva el botón)
//   - images con id_section_item = ese item -> fotos del panel (todas;
//     el abanico muestra hasta 5 y una ficha "+N" si hay más)
//
// Pausa de la rotación:
//   - Con mouse: mientras el mouse está encima de los paneles.
//   - En celular (sin hover): al tocar un panel, pestaña o miniatura se pausa 10 s y retoma.
//   - Siempre: con "reducir movimiento" o con la foto abierta en grande (lightbox).
"use client";

import { useEffect, useRef, useState } from "react";
import Container from "@/shared/ui/container/Container";
import PhotoLightbox from "@/shared/ui/photo-lightbox/PhotoLightbox";
import { toLightboxSlides } from "@/shared/ui/photo-lightbox/toLightboxSlides";
import ShowcaseTitle from "./ShowcaseTitle";
import ShowcaseTabs from "./ShowcaseTabs";
import ShowcasePanel from "./ShowcasePanel";
import { useAutoRotate } from "@/shared/lib/useAutoRotate";
import { useReducedMotion } from "@/shared/lib/useReducedMotion";
import { useCanHover } from "@/shared/lib/useCanHover";
import { useLightboxState } from "@/shared/lib/useLightboxState";
import { toneAt } from "@/shared/lib/ilDesign";
import { previewAnchorId } from "@/shared/lib/previewAnchor";
import { normalizeImages, normalizeItems } from "@/shared/services/site_service/lib/normalizeSectionContent";
import type { Photo } from "@/shared/lib/photo";
import type { SiteSectionDto, SiteSectionImageDto, SiteSectionItemDto } from "@/shared/services/site_service/model/siteget.dto";

type Props = {
    section: SiteSectionDto;
};

const ROTATE_MS = 6000; // mismo valor que la animación "il-progress" de globals.css
const TOUCH_PAUSE_MS = 10000; // en celular, cuánto se pausa tras tocar algo

// Un item recién creado en la vista previa puede llegar sin item_type: también se acepta.
function isShowcaseItem(item: SiteSectionItemDto): boolean {
    return item.item_type === "showcase" || item.item_type == null;
}

function photosOfItem(images: SiteSectionImageDto[], item: SiteSectionItemDto): Photo[] {
    return images
        .filter((image) => image.id_section_item === item.id_section_item)
        .map((image) => ({
            url: image.url,
            alt: image.alt || image.title || item.title || "Foto del servicio",
            caption: image.title,
            anchorId: previewAnchorId("section-image", image.id_section_image),
        }));
}

export default function ServiceShowcase({ section }: Props) {
    const items = normalizeItems(section.items ?? []).filter(isShowcaseItem);
    const images = normalizeImages(section.images ?? []);

    const reducedMotion = useReducedMotion();
    const canHover = useCanHover();
    const lightbox = useLightboxState();

    const [paused, setPaused] = useState(false); // mouse encima (solo escritorio)
    const [touchPaused, setTouchPaused] = useState(false); // tocó algo (solo celular)
    const touchTimer = useRef<number | null>(null);

    const stopped = (canHover && paused) || touchPaused || reducedMotion || lightbox.isOpen;
    const [activeIndex, setActiveIndex] = useAutoRotate(items.length, ROTATE_MS, stopped);

    // Foto principal elegida en el abanico de cada panel: { [id_section_item]: índice }.
    const [mainPhotos, setMainPhotos] = useState<Record<number, number>>({});

    // Al salir de la página se cancela el temporizador de la pausa.
    useEffect(() => {
        return () => {
            if (touchTimer.current) window.clearTimeout(touchTimer.current);
        };
    }, []);

    // En celular: pausa 10 s y después vuelve a rotar sola.
    function pauseAfterTouch() {
        if (canHover) return;
        setTouchPaused(true);
        if (touchTimer.current) window.clearTimeout(touchTimer.current);
        touchTimer.current = window.setTimeout(() => setTouchPaused(false), TOUCH_PAUSE_MS);
    }

    function pickPanel(index: number) {
        setActiveIndex(index);
        pauseAfterTouch();
    }

    // Fotos del panel abierto, para el lightbox.
    const activeItem = items[activeIndex];
    const activePhotos = activeItem ? photosOfItem(images, activeItem) : [];

    return (
        <section
            className="il-scope overflow-hidden bg-white"
            // El header es fijo y transparente: se deja su alto + el aire del diseño.
            style={{ padding: "calc(var(--app-header-height, 0px) + clamp(1.75rem,4vw,3rem)) 0 clamp(2rem,5vw,3.5rem)" }}
        >
            <Container className="flex flex-col gap-[clamp(24px,4vw,36px)]">
                <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] items-end gap-x-14 gap-y-5">
                    <ShowcaseTitle kicker={section.section_subtitle} title={section.section_title} activeIndex={activeIndex} />

                    <div className="flex flex-col gap-[18px]">
                        {section.section_description && (
                            <p data-el="header-description" className="m-0 max-w-[48ch] text-[17px] leading-[1.6] text-il-neutro-600">
                                {section.section_description}
                            </p>
                        )}
                        {items.length > 1 && (
                            <ShowcaseTabs
                                titles={items.map((item) => item.title ?? "")}
                                activeIndex={activeIndex}
                                stopped={stopped}
                                onPick={pickPanel}
                            />
                        )}
                    </div>
                </div>

                {items.length > 0 && (
                    // Móvil: paneles en columna (600px de alto). Escritorio (≥760px): en fila.
                    <div
                        onMouseEnter={() => setPaused(true)}
                        onMouseLeave={() => setPaused(false)}
                        className="flex h-[600px] flex-col gap-3 min-[760px]:h-[clamp(420px,52vw,560px)] min-[760px]:flex-row"
                    >
                        {items.map((item, i) => (
                            <ShowcasePanel
                                key={item.id_section_item}
                                item={item}
                                number={String(i + 1).padStart(2, "0")}
                                tone={toneAt(i)}
                                photos={photosOfItem(images, item)}
                                isActive={i === activeIndex}
                                mainPhoto={mainPhotos[item.id_section_item] ?? 0}
                                onPickPhoto={(k) => {
                                    setMainPhotos({ ...mainPhotos, [item.id_section_item]: k });
                                    pauseAfterTouch();
                                }}
                                onPick={() => pickPanel(i)}
                                onExpand={() => lightbox.open(mainPhotos[item.id_section_item] ?? 0)}
                                onMorePhotos={(startIndex) => lightbox.open(startIndex)}
                            />
                        ))}
                    </div>
                )}
            </Container>

            {/* Fuera de los paneles para que sus clics no lleguen al acordeón. */}
            <PhotoLightbox
                slides={toLightboxSlides(activePhotos)}
                index={lightbox.index}
                open={lightbox.isOpen}
                onClose={lightbox.close}
            />
        </section>
    );
}
