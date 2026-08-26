import Image from "next/image";
import Link from "next/link";
import type { GalleryItem } from "@/features/gallery/data/galleryItems";

type GalleryPhotoCardProps = {
    item: GalleryItem;
};

export default function GalleryPhotoCard({ item }: GalleryPhotoCardProps) {
    return (
        <div className="bg-white rounded-xl overflow-hidden shadow-md border flex flex-col">
            {/* miniatura que abre el modal: recuadro de proporción fija
                (4:3) para que todas las cards midan lo mismo y se
                alineen en filas, sin importar el tamaño real de la foto */}
            <a
                href={item.url}
                data-src={item.url}
                className="lg-item block relative w-full aspect-[4/3] overflow-hidden"
            >
                <Image
                    src={item.url}
                    alt={item.title}
                    fill
                    sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                />
            </a>

            <div className="p-3 space-y-2 flex-1 flex flex-col">
                <h3 className="font-semibold text-gray-800 text-lg">
                    {item.title}
                </h3>

                <p className="text-gray-600 text-sm">
                    {item.description}
                </p>

                <Link
                    href={`/gallery/${item.id}`}
                    className="text-blue-600 text-sm hover:underline mt-auto"
                >
                    Ver más detalles →
                </Link>
            </div>
        </div>
    );
}
