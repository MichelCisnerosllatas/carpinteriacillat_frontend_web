import Image from "next/image";
import type { HistoryStory } from "../model/types";

type HistorySlideProps = {
    story: HistoryStory;
    stepNumber: number;
    onOpen: () => void;
};

export default function HistorySlide({ story, stepNumber, onOpen }: HistorySlideProps) {
    return (
        <div className="relative w-full h-full" onClick={onOpen}>
            {/* Imagen de fondo */}
            <Image
                src={story.img}
                alt={story.title}
                width={200}
                height={200}
                className="absolute inset-0 w-full h-full object-cover opacity-80"
            />

            {/* Degradado para lectura */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/70" />

            {/* Contenido */}
            <div className="relative z-10 h-full flex items-center">
                <div className="px-6 md:px-12 max-w-xl">
                    <span className="inline-flex items-center px-3 py-1 mb-4 rounded-full text-xs font-semibold bg-yellow-400 text-red-900">
                        Etapa {stepNumber}
                    </span>
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                        {story.title}
                    </h3>
                    <p className="text-gray-100 text-sm md:text-base leading-relaxed">
                        {story.desc}
                    </p>
                </div>
            </div>
        </div>
    );
}
