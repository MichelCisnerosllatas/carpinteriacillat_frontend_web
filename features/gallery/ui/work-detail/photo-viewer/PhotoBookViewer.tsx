// features/gallery/ui/work-detail/photo-viewer/PhotoBookViewer.tsx
//
// Vista "Libro" del detalle: un libro abierto cuyas hojas giran en 3D.
//
// Cómo está armado:
//   - Fondo izquierdo: tapa oscura con el logo y el título del trabajo.
//   - Fondo derecho: contratapa amarilla con "Ver más de {categoría}" (se ve al terminar).
//   - Encima, una "hoja" por cada 2 fotos, apoyada en la mitad derecha. Su frente muestra
//     una foto y su dorso la siguiente. Una hoja "pasada" gira -180° sobre el lomo y queda a
//     la izquierda mostrando su dorso.
//   - `turnedSheets` = cuántas hojas ya se pasaron (0 = libro cerrado en la portada).
// backface-visibility: hidden hace que de cada cara solo se vea la que mira al frente.

import Image from "next/image";
import Link from "next/link";
import CoverImage from "@/shared/ui/cover-image/CoverImage";
import { EASE_IL_PAGE, toneAt } from "@/shared/lib/ilDesign";
import type { Photo } from "@/shared/lib/photo";

type Props = {
    photos: Photo[];
    turnedSheets: number;
    title: string;
    categoryName: string | null;
};

export default function PhotoBookViewer({ photos, turnedSheets, title, categoryName }: Props) {
    const sheetCount = Math.ceil(photos.length / 2);
    const moreHref = categoryName ? `/gallery?cat=${encodeURIComponent(categoryName)}` : "/gallery";

    return (
        <div className="relative aspect-[1.45/1] w-full [perspective:2200px]">
            {/* Tapa (izquierda) */}
            <div className="absolute left-0 top-0 flex h-full w-1/2 flex-col justify-end gap-2 rounded-l-2xl bg-il-neutro-900 p-[clamp(16px,3vw,28px)] text-white">
                <Image src="/img/logo.png" alt="" width={40} height={40} className="size-10 rounded-lg object-contain" />
                <span className="il-display text-xs font-bold tracking-[.14em] text-il-amarillo-500">DISEÑO DEL TALLER</span>
                <span className="il-display text-[clamp(15px,1.6vw,19px)] font-bold leading-[1.25] text-white">{title}</span>
            </div>

            {/* Contratapa (derecha) */}
            <div className="absolute left-1/2 top-0 flex h-full w-1/2 flex-col justify-end gap-2 rounded-r-2xl bg-il-amarillo-500 p-[clamp(16px,3vw,28px)]">
                <span className="il-display text-[clamp(15px,1.6vw,19px)] font-bold leading-[1.25] text-il-neutro-900">
                    Diseñado y fabricado en nuestro taller.
                </span>
                <Link href={moreHref} className="inline-flex min-h-11 items-center self-start text-[15px] font-bold text-il-neutro-900 underline">
                    {categoryName ? `Ver más de ${categoryName} →` : "Ver más trabajos →"}
                </Link>
            </div>

            {/* Hojas */}
            {Array.from({ length: sheetCount }, (_, i) => {
                const isTurned = i < turnedSheets;
                const front = photos[2 * i];
                const back = photos[2 * i + 1]; // puede no existir si la cantidad de fotos es impar

                return (
                    <div
                        key={i}
                        className="absolute left-1/2 top-0 h-full w-1/2 [transform-style:preserve-3d]"
                        style={{
                            transformOrigin: "left center",
                            transform: `rotateY(${isTurned ? -180 : 0}deg)`,
                            // Las pasadas se apilan en orden (la última arriba); las que faltan, al revés.
                            zIndex: isTurned ? i + 1 : 10 - i,
                            transition: `transform 900ms ${EASE_IL_PAGE}`,
                        }}
                    >
                        {/* Frente de la hoja (se ve a la derecha) */}
                        <div
                            className="absolute inset-0 overflow-hidden rounded-r-2xl shadow-[0_10px_30px_rgba(20,24,31,.12)] [backface-visibility:hidden]"
                            style={{ background: toneAt(2 * i) }}
                        >
                            <CoverImage url={front?.url} alt={front?.alt ?? ""} />
                            <span className="pointer-events-none absolute inset-y-0 left-0 w-6 bg-[linear-gradient(90deg,rgba(20,24,31,.22),rgba(20,24,31,0))]" />
                        </div>
                        {/* Dorso de la hoja (se ve a la izquierda cuando está pasada) */}
                        <div
                            className="absolute inset-0 overflow-hidden rounded-l-2xl shadow-[0_10px_30px_rgba(20,24,31,.12)] [backface-visibility:hidden] [transform:rotateY(180deg)]"
                            style={{ background: toneAt(2 * i + 1) }}
                        >
                            <CoverImage url={back?.url} alt={back?.alt ?? ""} />
                            <span className="pointer-events-none absolute inset-y-0 right-0 w-6 bg-[linear-gradient(270deg,rgba(20,24,31,.22),rgba(20,24,31,0))]" />
                        </div>
                    </div>
                );
            })}

            {/* Lomo del libro */}
            <div className="pointer-events-none absolute inset-y-0 left-1/2 z-30 w-0.5 -translate-x-px bg-[rgba(20,24,31,.25)]" />
        </div>
    );
}
