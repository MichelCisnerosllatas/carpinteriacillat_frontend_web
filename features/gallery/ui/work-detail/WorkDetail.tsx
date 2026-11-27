// features/gallery/ui/work-detail/WorkDetail.tsx
//
// Pantalla de detalle de un trabajo (/gallery/[id]). Recibe el trabajo ya buscado por la
// página (app/gallery/[id]/page.tsx, en el servidor; o WorkDetailPreview en la vista previa) y
// maneja lo interactivo: qué foto se ve, y si se recorre como "Abanico" o como "Libro".
// Si es una restauración con pares Antes/Después, debajo agrega el bloque "Antes y después"
// (WorkPairs, apagable con pairs.show). Las fotos del visor son solo las de galería.
//
// Qué se muestra y con qué textos viene de la Apariencia de la sección Galería (grupos
// viewer/info/contact/pairs/reviews/related, ver workGallerySettings.ts). Cada elemento lleva
// su ancla data-el (la vista previa del intranet lo resalta).
//
// Estado:
//   - mode: "abanico" | "libro" (arranca en viewer.default_view; sin vista Libro, siempre Abanico).
//   - selected: foto al frente en modo Abanico (0 = portada).
//   - turnedSheets: hojas ya pasadas en modo Libro (cada hoja = 2 fotos).
"use client";

import { useState } from "react";
import Container from "@/shared/ui/container/Container";
import ExpandPhotoButton from "@/shared/ui/expand-photo-button/ExpandPhotoButton";
import PhotoLightbox from "@/shared/ui/photo-lightbox/PhotoLightbox";
import { toLightboxSlides } from "@/shared/ui/photo-lightbox/toLightboxSlides";
import { useLightboxState } from "@/shared/lib/useLightboxState";
import DetailTopBar from "./DetailTopBar";
import PhotoViewerTabs, { type PhotoViewMode } from "./photo-viewer/PhotoViewerTabs";
import PhotoFanViewer from "./photo-viewer/PhotoFanViewer";
import PhotoBookViewer from "./photo-viewer/PhotoBookViewer";
import PhotoStrip from "./photo-viewer/PhotoStrip";
import PhotoDots from "./photo-viewer/PhotoDots";
import WorkInfo from "./WorkInfo";
import WorkReviews from "./work-reviews/WorkReviews";
import RelatedWorks from "./related-works/RelatedWorks";
import WorkPairs from "./work-pairs/WorkPairs";
import { getWorkPairs, getWorkPhotos, getWorkTitle } from "@/shared/services/site_service/lib/workPhotos";
import { getNeighborWorks } from "@/features/gallery/lib/getNeighborWorks";
import { DEFAULT_DETAIL_SETTINGS, type WorkGalleryDetailSettings } from "@/features/gallery/lib/workGallerySettings";
import type { SiteWorkDto } from "@/shared/services/site_service/model/siteget.dto";

type Props = {
    work: SiteWorkDto;
    works: SiteWorkDto[];
    // Foto con la que abre (viene de ?foto=k, ej. al tocar una miniatura en la galería).
    initialPhoto: number;
    // Apariencia del detalle (sección Galería de /gallery, ver getWorkDetailContext.ts). Si no
    // se pasa, se usan los defaults del catálogo.
    settings?: WorkGalleryDetailSettings;
    // Enlace del botón «Cotizar uno similar» (null = no se pinta, ver getWorkContactHref.ts).
    contactHref?: string | null;
};

// En modo Libro, cuántas hojas hay que pasar para que se vea la foto k:
// la portada (0) se ve con el libro cerrado; las fotos 1 y 2 tras pasar 1 hoja; 3 y 4 tras 2…
function sheetsToShow(photoIndex: number): number {
    return Math.ceil(photoIndex / 2);
}

export default function WorkDetail({ work, works, initialPhoto, settings = DEFAULT_DETAIL_SETTINGS, contactHref = null }: Props) {
    const { viewer, info, pairs: pairsSettings, reviews, related } = settings;
    const photos = getWorkPhotos(work);
    const pairs = pairsSettings.show ? getWorkPairs(work) : [];
    const total = photos.length;
    const sheetCount = Math.ceil(total / 2);
    const startPhoto = Math.min(Math.max(initialPhoto, 0), Math.max(total - 1, 0));

    // Vista inicial elegida en el intranet (viewer.default_view: "fan" | "book").
    const [mode, setMode] = useState<PhotoViewMode>(viewer.defaultView === "book" ? "libro" : "abanico");
    const [selected, setSelected] = useState(startPhoto);
    const [turnedSheets, setTurnedSheets] = useState(sheetsToShow(startPhoto));

    // Si el intranet apagó la vista «Libro», siempre es Abanico (y no hay pestañas).
    const isBook = viewer.showBook && mode === "libro";
    const title = getWorkTitle(work);
    const categoryName = work.category?.name ?? null;
    const { next } = getNeighborWorks(work, works);
    // Botón «Cotizar uno similar»: solo si hay enlace (contact.show encendido y destino válido).
    const contact = contactHref ? { href: contactHref, label: settings.contact.label, target: settings.contact.target } : null;

    // Fotos que se están viendo ahora: una en Abanico; en Libro las dos páginas abiertas.
    const visibleIndexes = isBook ? [2 * turnedSheets - 1, 2 * turnedSheets] : [selected];

    // Lightbox con todas las fotos, abierto en la que se está viendo (en Libro: la página
    // izquierda, o la portada si el libro está cerrado).
    const lightbox = useLightboxState();
    const currentPhoto = isBook ? Math.max(0, Math.min(2 * turnedSheets - 1, total - 1)) : selected;
    const openLightbox = () => lightbox.open(currentPhoto);

    function showPhoto(index: number) {
        if (isBook) setTurnedSheets(sheetsToShow(index));
        else setSelected(index);
    }

    function goPrevious() {
        if (isBook) setTurnedSheets(Math.max(0, turnedSheets - 1));
        else setSelected((selected - 1 + total) % total);
    }

    function goNext() {
        if (isBook) setTurnedSheets(Math.min(sheetCount, turnedSheets + 1));
        else setSelected((selected + 1) % total);
    }

    let viewerLabel: string;
    if (isBook) {
        if (turnedSheets === 0) viewerLabel = "Portada · pase la página";
        else if (turnedSheets === sheetCount) viewerLabel = "Fin del recorrido";
        else viewerLabel = `Páginas ${2 * turnedSheets - 1} y ${2 * turnedSheets} de ${total}`;
    } else {
        const caption = photos[selected]?.caption;
        viewerLabel = `Foto ${selected + 1} de ${total}${caption ? ` · ${caption}` : ""}`;
    }

    return (
        // padding-top: el header es fijo; se deja su alto real (ver Header.tsx) + un poco de aire.
        <main className="il-scope bg-white" style={{ paddingTop: "calc(var(--app-header-height, 10rem) + 1rem)" }}>
            <DetailTopBar
                categoryName={categoryName}
                title={title}
                showBack={info.showBack}
                backLabel={info.backLabel}
                showBreadcrumb={info.showBreadcrumb}
            />

            <section className="pb-[clamp(3.5rem,8vw,6.5rem)] pt-[clamp(2rem,5vw,3.5rem)]">
                <Container className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,460px),1fr))] items-start gap-[clamp(32px,6vw,72px)]">
                    <div className="flex min-w-0 flex-col gap-[18px]">
                        {total > 0 ? (
                            <>
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                    <span className="text-[15px] text-il-neutro-600">{viewerLabel}</span>
                                    {viewer.showBook && <PhotoViewerTabs mode={mode} onChange={setMode} />}
                                </div>

                                {/* "relative" para ubicar el botón "ver en grande" arriba a la izquierda. */}
                                <div data-el="detail-viewer" className="relative">
                                    {isBook ? (
                                        <PhotoBookViewer
                                            photos={photos}
                                            turnedSheets={turnedSheets}
                                            title={title}
                                            categoryName={categoryName}
                                            coverText={viewer.bookCoverText}
                                            backText={viewer.bookBackText}
                                            onNext={goNext}
                                            onPrevious={goPrevious}
                                        />
                                    ) : (
                                        <PhotoFanViewer photos={photos} selected={selected} onSelect={setSelected} />
                                    )}
                                    {viewer.showExpand && (
                                        <ExpandPhotoButton onClick={openLightbox} className="absolute left-3 top-3 z-40" dataEl="detail-expand" />
                                    )}
                                </div>

                                {viewer.showStrip && (
                                    <PhotoStrip
                                        photos={photos}
                                        visibleIndexes={visibleIndexes}
                                        onPick={showPhoto}
                                        onExpand={openLightbox}
                                        title={viewer.stripTitle}
                                        showExpand={viewer.showExpand}
                                    />
                                )}

                                <PhotoDots
                                    count={isBook ? sheetCount + 1 : total}
                                    activeIndex={isBook ? turnedSheets : selected}
                                    dotLabel={(i) => (isBook ? `Ir a la página ${i}` : `Ver foto ${i + 1}`)}
                                    onGo={(i) => (isBook ? setTurnedSheets(i) : setSelected(i))}
                                    onPrevious={goPrevious}
                                    onNext={goNext}
                                />
                            </>
                        ) : (
                            // Trabajo publicado sin fotos todavía: un recuadro de color en su lugar.
                            <div className="flex aspect-[1/0.9] w-full items-center justify-center rounded-3xl bg-il-neutro-050 text-il-neutro-600">
                                Este trabajo todavía no tiene fotos.
                            </div>
                        )}
                    </div>

                    <WorkInfo work={work} nextWork={next} settings={info} contact={contact} />
                </Container>
            </section>

            {pairs.length > 0 && <WorkPairs title={title} pairs={pairs} settings={pairsSettings} />}

            {reviews.show && <WorkReviews work={work} settings={reviews} />}

            {related.show && <RelatedWorks work={work} works={works} title={related.title} max={related.max} />}

            {/* Fuera del visor para que sus toques no abran/cierren el abanico. */}
            <PhotoLightbox slides={toLightboxSlides(photos)} index={lightbox.index} open={lightbox.isOpen} onClose={lightbox.close} />
        </main>
    );
}
