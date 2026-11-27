// features/service/ui/service-showcase/ShowcasePanel.tsx
//
// Un panel del acordeón del hero de Servicios.
//   - Cerrado: angosto (flex 1), muestra el número y el título (vertical en escritorio).
//   - Abierto: ancho (flex 5), muestra la pastilla "01 · SERVICIO", título, descripción, el
//     botón blanco que lleva a item.link, el abanico de fotos arriba a la derecha y el botón
//     "ver en grande" arriba a la izquierda.
// Usa TODAS las fotos del servicio; si son más de 5, el abanico muestra una ficha "+N".
// El cambio de ancho lo anima CSS (transition: flex), igual que en el diseño.
"use client";

import Link from "next/link";
import PhotoLayers from "@/shared/ui/photo-layers/PhotoLayers";
import PhotoFan from "@/shared/ui/photo-fan/PhotoFan";
import ExpandPhotoButton from "@/shared/ui/expand-photo-button/ExpandPhotoButton";
import { EASE_IL } from "@/shared/lib/ilDesign";
import { previewAnchorId, PREVIEW_ANCHOR_STYLE } from "@/shared/lib/previewAnchor";
import type { Photo } from "@/shared/lib/photo";
import type { SiteSectionItemDto } from "@/shared/services/site_service/model/siteget.dto";

type Props = {
    item: SiteSectionItemDto;
    number: string; // "01", "02"…
    tone: string; // color de fondo si no hay foto
    photos: Photo[];
    isActive: boolean;
    mainPhoto: number;
    onPickPhoto: (index: number) => void;
    onPick: () => void;
    onExpand: () => void; // abre la foto actual en grande
    onMorePhotos: (startIndex: number) => void; // ficha "+N": abre todas en grande desde ahí
};

const MAX_FAN_THUMBS = 5; // el abanico muestra hasta 5 fichas (la 5ª puede ser "+N")

export default function ShowcasePanel({ item, number, tone, photos, isActive, mainPhoto, onPickPhoto, onPick, onExpand, onMorePhotos }: Props) {
    const title = item.title ?? "";

    return (
        <div
            id={previewAnchorId("section-item", item.id_section_item)}
            className="relative min-h-0 min-w-0 overflow-hidden rounded-[20px] hover:rounded-[56px_20px_56px_20px]"
            style={{
                ...PREVIEW_ANCHOR_STYLE,
                flex: isActive ? "5 1 0%" : "1 1 0%",
                background: tone,
                transition: `flex 800ms ${EASE_IL}, border-radius 800ms ${EASE_IL}`,
            }}
        >
            {/* Fotos con un leve zoom mientras el panel está cerrado (se "acerca" al abrirse). */}
            <div
                className="absolute inset-0"
                style={{ transform: `scale(${isActive ? 1 : 1.12})`, transition: `transform 1.2s ${EASE_IL}` }}
            >
                <PhotoLayers photos={photos} activeIndex={mainPhoto} />
            </div>

            {/* Degradado oscuro abajo para que el texto blanco se lea sobre cualquier foto. */}
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(0deg,rgba(20,24,31,.9)_0%,rgba(20,24,31,.35)_42%,rgba(20,24,31,0)_72%)]" />

            {/* Todo el panel cerrado es un botón para abrirlo. Abierto deja de recibir clics. */}
            <button
                type="button"
                onClick={onPick}
                aria-label={`Ver ${title}`}
                tabIndex={isActive ? -1 : undefined}
                className="absolute inset-0 cursor-pointer border-0 bg-transparent"
                style={{ pointerEvents: isActive ? "none" : "auto" }}
            />

            <PhotoFan
                photos={photos}
                selected={mainPhoto}
                onSelect={onPickPhoto}
                visible={isActive}
                side="right"
                maxVisible={MAX_FAN_THUMBS}
                onMoreClick={onMorePhotos}
            />

            {/* Ver en grande: solo en el panel abierto, en la esquina contraria al abanico. */}
            {isActive && photos.length > 0 && (
                <ExpandPhotoButton onClick={onExpand} className="absolute left-[18px] top-[18px] z-[3]" />
            )}

            {/* Contenido del panel CERRADO: número + título. */}
            <div
                aria-hidden={isActive}
                className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-row items-center gap-3.5 p-[18px] min-[760px]:flex-col"
                style={{ opacity: isActive ? 0 : 1, transition: "opacity 400ms" }}
            >
                <span className="il-display inline-flex size-10 flex-none items-center justify-center rounded-full bg-il-amarillo-500 text-sm font-extrabold text-il-neutro-900">
                    {number}
                </span>
                <span className="il-display whitespace-nowrap text-[17px] font-bold text-white min-[760px]:rotate-180 min-[760px]:[writing-mode:vertical-rl]">
                    {title}
                </span>
            </div>

            {/* Contenido del panel ABIERTO. */}
            <div
                aria-hidden={!isActive}
                className="absolute inset-x-0 bottom-0 flex max-w-[580px] flex-col gap-3 p-[clamp(20px,3vw,36px)]"
                style={{
                    opacity: isActive ? 1 : 0,
                    transform: `translateY(${isActive ? 0 : 24}px)`,
                    pointerEvents: isActive ? "auto" : "none",
                    transition: `opacity 500ms 200ms, transform 800ms 150ms ${EASE_IL}`,
                }}
            >
                <span className="il-display self-start rounded-full bg-il-amarillo-500 px-3 py-1.5 text-[13px] font-bold tracking-[.1em] text-il-neutro-900">
                    {number} · SERVICIO
                </span>
                <h2 className="il-display m-0 text-[clamp(1.6rem,3vw,2.3rem)] font-extrabold leading-[1.08] tracking-[-0.03em] text-white">
                    {title}
                </h2>
                {item.description && (
                    <p className="m-0 max-w-[46ch] text-base leading-[1.55] text-il-neutro-200">{item.description}</p>
                )}
                {item.link && (
                    <Link
                        href={item.link}
                        tabIndex={isActive ? undefined : -1}
                        className="il-display inline-flex min-h-[46px] items-center gap-3 self-start rounded-full bg-white py-0 pl-[18px] pr-1.5 text-[15px] font-bold text-il-neutro-900 transition-[gap] duration-200 hover:gap-[18px]"
                    >
                        {item.label || "Ver trabajos"}
                        <span aria-hidden="true" className="inline-flex size-[34px] items-center justify-center rounded-full bg-il-amarillo-500">
                            →
                        </span>
                    </Link>
                )}
            </div>
        </div>
    );
}
