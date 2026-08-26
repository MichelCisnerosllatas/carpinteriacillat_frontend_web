import Image from "next/image";
import type { AboutGalleryItem } from "../model/types";

type AboutGallerySlideProps = {
    item: AboutGalleryItem;
    onOpen: () => void;
};

export default function AboutGallerySlide({ item, onOpen }: AboutGallerySlideProps) {
    return (
        <button type="button" onClick={onOpen} className="block w-full focus:outline-none">
            <Image
                src={item.src}
                alt={item.title}
                width={800}
                height={600}
                className="w-full h-72 md:h-80 object-cover"
            />
        </button>
    );
}
