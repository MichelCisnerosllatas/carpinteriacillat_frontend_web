import Image from "next/image";
import type { AboutGalleryItem } from "../model/types";

type AboutGallerySlideProps = {
    item: AboutGalleryItem;
    onOpen: () => void;
};

export default function AboutGallerySlide({ item, onOpen }: AboutGallerySlideProps) {
    // Antes era un <button>, pero un <a> (el link opcional de abajo) no
    // puede vivir dentro de un <button> (HTML invalido) — se cambia a
    // <div role="button"> + manejo de teclado para no perder accesibilidad.
    // El caption (title/description) antes no se mostraba: "title" solo se
    // usaba como alt de la imagen, invisible para el usuario.
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
                alt={item.title}
                width={800}
                height={600}
                className={`w-full h-72 md:h-80 ${item.fit ?? "object-cover"}`}
            />

            {(item.title || item.description) && (
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    {item.title && (
                        <p className="text-white font-semibold text-sm">{item.title}</p>
                    )}
                    {item.description && (
                        <p className="text-gray-200 text-xs mt-1">{item.description}</p>
                    )}
                    {item.link && (
                        <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="mt-1 inline-block text-xs font-semibold text-amber-300 underline underline-offset-2 hover:text-amber-200"
                        >
                            {item.linkLabel ?? "Ver más"}
                        </a>
                    )}
                </div>
            )}
        </div>
    );
}
