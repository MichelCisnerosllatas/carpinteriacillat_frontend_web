// features/gallery/ui/work-detail/related-works/RelatedWorkCard.tsx
//
// Una tarjeta de "Otros trabajos que le pueden gustar": portada, título y madera · estilo.
// Toda la foto lleva al detalle de ese trabajo; el botón "ver en grande" abre sus fotos.
//
// Efecto de esquinas + zoom:
//   - Con mouse: al pasar el mouse.
//   - En celular: cuando la tarjeta está en el medio de la pantalla (useInViewCenter).
"use client";

import { useRef } from "react";
import Link from "next/link";
import CoverImage from "@/shared/ui/cover-image/CoverImage";
import ExpandPhotoButton from "@/shared/ui/expand-photo-button/ExpandPhotoButton";
import PhotoLightbox from "@/shared/ui/photo-lightbox/PhotoLightbox";
import { toLightboxSlides } from "@/shared/ui/photo-lightbox/toLightboxSlides";
import { toneAt } from "@/shared/lib/ilDesign";
import { useCanHover } from "@/shared/lib/useCanHover";
import { useInViewCenter } from "@/shared/lib/useInViewCenter";
import { useLightboxState } from "@/shared/lib/useLightboxState";
import { getWorkPhotos, getWorkTitle } from "@/shared/services/site_service/lib/workPhotos";
import type { SiteWorkDto } from "@/shared/services/site_service/model/siteget.dto";

type Props = {
    work: SiteWorkDto;
    index: number; // posición, para alternar color y forma de esquinas
};

// Forma de las esquinas, alternada por tarjeta (como en el diseño):
//   rest = normal, hover = al pasar el mouse, active = celular con la tarjeta centrada.
const SHAPES = [
    { rest: "rounded-[20px_56px_20px_56px]", hover: "group-hover:rounded-[20px]", active: "rounded-[20px]" },
    { rest: "rounded-[20px]", hover: "group-hover:rounded-[56px_20px_56px_20px]", active: "rounded-[56px_20px_56px_20px]" },
    { rest: "rounded-[56px_20px_56px_20px]", hover: "group-hover:rounded-[20px]", active: "rounded-[20px]" },
];

export default function RelatedWorkCard({ work, index }: Props) {
    const title = getWorkTitle(work);
    const photos = getWorkPhotos(work);
    const cover = photos[0];
    const meta = [work.wood?.name, work.style].filter(Boolean).join(" · ");

    const lightbox = useLightboxState();
    const canHover = useCanHover();
    const cardRef = useRef<HTMLElement>(null);
    const lifted = useInViewCenter(cardRef, !canHover);

    const shape = SHAPES[index % SHAPES.length];
    const shapeClass = lifted ? shape.active : `${shape.rest} ${shape.hover}`;
    const zoomClass = lifted ? "scale-105" : "group-hover:scale-105";

    return (
        <article ref={cardRef} className="group flex flex-col gap-3">
            <div
                className={`relative aspect-[4/4.4] overflow-hidden transition-[border-radius] duration-[800ms] ease-il ${shapeClass}`}
                style={{ background: toneAt(index) }}
            >
                <div className={`absolute inset-0 transition-transform duration-1000 ease-il ${zoomClass}`}>
                    <CoverImage url={cover?.url} alt={cover?.alt ?? title} />
                </div>
                <Link href={`/gallery/${work.id_furniture}`} aria-label={`Ver ${title}`} className="absolute inset-0" />
                {photos.length > 0 && (
                    <ExpandPhotoButton onClick={() => lightbox.open(0)} className="absolute right-4 top-4 z-10" />
                )}
            </div>
            <span className="il-display text-lg font-bold tracking-[-0.02em]">{title}</span>
            {meta && <span className="text-[15px] text-il-neutro-600">{meta}</span>}

            <PhotoLightbox slides={toLightboxSlides(photos)} index={lightbox.index} open={lightbox.isOpen} onClose={lightbox.close} />
        </article>
    );
}
