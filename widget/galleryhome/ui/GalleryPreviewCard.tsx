import { motion } from "framer-motion";
import type { GalleryPreviewItem } from "../model/types";

type GalleryPreviewCardProps = {
    item: GalleryPreviewItem;
    index: number;
    onOpen: (index: number) => void;
};

export default function GalleryPreviewCard({
    item,
    index,
    onOpen,
}: GalleryPreviewCardProps) {
    // Antes era un <button>, pero un <a> (el link opcional de abajo) no
    // puede vivir dentro de un <button> (HTML invalido) — se cambia a
    // <div role="button"> + manejo de teclado para no perder accesibilidad.
    return (
        <motion.div
            role="button"
            tabIndex={0}
            onClick={() => onOpen(index)}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onOpen(index);
                }
            }}
            className="gallery-item rounded-2xl overflow-hidden shadow-lg bg-gray-900 text-left cursor-pointer"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
        >
            <img
                src={item.imageUrl}
                alt={item.title}
                className={`w-full h-64 ${item.fit ?? "object-cover"}`}
            />

            <div className="gallery-overlay">
                <div className="text-center px-4">
                    <span className="inline-block text-xs font-semibold tracking-widest uppercase bg-gray-900/80 text-amber-300 px-3 py-1 rounded-full mb-2">
                        {item.category}
                    </span>
                    <h3 className="text-xl font-bold text-white mb-2">
                        {item.title}
                    </h3>
                    {item.description && (
                        <p className="text-sm text-gray-200 mb-2 max-w-xs mx-auto">
                            {item.description}
                        </p>
                    )}
                    <span className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-gray-900 bg-white px-4 py-2 rounded-full">
                        <i className="fas fa-search" />
                        Ver en grande
                    </span>
                    {/* Navegacion opcional de la imagen (image.link/link_label) —
                        stopPropagation para que el click no dispare tambien
                        onOpen() (abrir el lightbox). */}
                    {item.link && (
                        <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="mt-2 block text-xs font-semibold text-amber-300 underline underline-offset-2 hover:text-amber-200"
                        >
                            {item.linkLabel ?? "Ver más"}
                        </a>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
