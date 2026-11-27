import Image from "next/image";
import { canOptimizeImage } from "@/shared/lib/imageOptimization";
import type { HistoryStory } from "./we-history-section.types";

type HistorySlideProps = {
    story: HistoryStory;
    showStep: boolean; // Apariencia: slide.show_step («2010» / «Etapa 1»)
    showLink: boolean; // Apariencia: slide.show_link
    linkLabel: string; // Apariencia: slide.link_label (si la foto no trae su propio texto)
    onOpen: () => void;
};

export default function HistorySlide({ story, showStep, showLink, linkLabel, onOpen }: HistorySlideProps) {
    return (
        <div className="relative w-full h-full" onClick={onOpen}>
            {/* Imagen de fondo */}
            <Image
                src={story.img}
                unoptimized={!canOptimizeImage(story.img)}
                alt={story.title}
                width={200}
                height={200}
                className={`absolute inset-0 w-full h-full opacity-80 ${story.fit}`}
            />

            {/* Degradado para lectura */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/70" />

            {/* Contenido */}
            <div className="relative z-10 h-full flex items-center">
                <div className="px-6 md:px-12 max-w-xl">
                    {showStep && story.step && (
                        <span
                            data-el="history-step"
                            className="inline-flex items-center px-3 py-1 mb-4 rounded-full text-xs font-semibold bg-yellow-400 text-red-900"
                        >
                            {story.step}
                        </span>
                    )}
                    {story.title && (
                        <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                            {story.title}
                        </h3>
                    )}
                    {story.desc && (
                        <p className="text-gray-100 text-sm md:text-base leading-relaxed">
                            {story.desc}
                        </p>
                    )}
                    {/* Navegacion opcional de la imagen (image.link/link_label) —
                        stopPropagation para que el click no dispare tambien
                        onOpen() (el div completo abre el lightbox). */}
                    {showLink && story.link && (
                        <a
                            data-el="history-link"
                            href={story.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-yellow-300 underline underline-offset-2 hover:text-yellow-200"
                        >
                            {story.linkLabel || linkLabel}
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}
