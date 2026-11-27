import Image from "next/image";
import { canOptimizeImage } from "@/shared/lib/imageOptimization";
import type { AboutGalleryItem } from "./we-section2.types";

type AboutGallerySlideProps = {
    item: AboutGalleryItem;
    showCaption: boolean; // Apariencia: gallery.show_caption (título y descripción)
    linkLabel: string; // Apariencia: gallery.link_label (si la foto no trae su propio texto)
    onOpen: () => void;
};

export default function AboutGallerySlide({ item, showCaption, linkLabel, onOpen }: AboutGallerySlideProps) {
    // Antes era un <button>, pero un <a> (el link opcional de abajo) no
    // puede vivir dentro de un <button> (HTML invalido) — se cambia a
    // <div role="button"> + manejo de teclado para no perder accesibilidad.
    const hasCaption = showCaption && Boolean(item.title || item.description);

    return (
        <div
            role="button"
            tabIndex={0}
            onClick={onOpen}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onOpen();
                }
            }}
            className="relative block w-full cursor-pointer focus:outline-none"
        >
            <Image
                src={item.src}
                unoptimized={!canOptimizeImage(item.src)}
                alt={item.title}
                width={800}
                height={600}
                className={`w-full h-72 md:h-80 ${item.fit}`}
            />

            {/* Franja inferior: pie de foto (si está activado) y/o enlace (si la foto trae uno). */}
            {(hasCaption || item.link) && (
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    {hasCaption && (
                        <div data-el="about-caption">
                            {item.title && (
                                <p className="text-white font-semibold text-sm">{item.title}</p>
                            )}
                            {item.description && (
                                <p className="text-gray-200 text-xs mt-1">{item.description}</p>
                            )}
                        </div>
                    )}
                    {item.link && (
                        <a
                            data-el="about-link"
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="mt-1 inline-block text-xs font-semibold text-amber-300 underline underline-offset-2 hover:text-amber-200"
                        >
                            {item.linkLabel || linkLabel}
                        </a>
                    )}
                </div>
            )}
        </div>
    );
}
