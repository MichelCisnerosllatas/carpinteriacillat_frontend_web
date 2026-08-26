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
    return (
        <motion.button
            type="button"
            onClick={() => onOpen(index)}
            className="gallery-item rounded-2xl overflow-hidden shadow-lg bg-gray-900 text-left"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
        >
            <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-64 object-cover"
            />

            <div className="gallery-overlay">
                <div className="text-center px-4">
                    <span className="inline-block text-xs font-semibold tracking-widest uppercase bg-gray-900/80 text-amber-300 px-3 py-1 rounded-full mb-2">
                        {item.category}
                    </span>
                    <h3 className="text-xl font-bold text-white mb-2">
                        {item.title}
                    </h3>
                    <span className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-gray-900 bg-white px-4 py-2 rounded-full">
                        <i className="fas fa-search" />
                        Ver en grande
                    </span>
                </div>
            </div>
        </motion.button>
    );
}
