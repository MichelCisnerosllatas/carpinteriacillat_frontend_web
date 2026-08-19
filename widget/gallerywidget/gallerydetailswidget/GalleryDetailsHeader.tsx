// widget/gallery/GalleryDetailsHeader.tsx
import Link from "next/link";
import { GALLERY_CATEGORIES, type GalleryItem } from "@/features/gallery/data/galleryItems";
import Container from "@/shared/ui/container/Container";

type GalleryDetailsHeaderProps = {
    item: GalleryItem;
};

export default function GalleryDetailsHeader({ item }: GalleryDetailsHeaderProps) {
    return (
        <section className="pb-4 bg-gray-100">
            {/* pt-28 = deja espacio bajo el header fijo */}
            <Container>
                <nav
                    aria-label="Breadcrumb"
                    className="text-sm text-gray-500 flex flex-wrap gap-1"
                >
                    <Link href="/" className="hover:text-red-600">
                        Inicio
                    </Link>
                    <span>/</span>
                    <Link href="/gallery" className="hover:text-red-600">
                        Galería
                    </Link>
                    <span>/</span>
                    <span>{GALLERY_CATEGORIES[item.category] ?? item.category}</span>
                    <span>/</span>
                    <span className="text-gray-700 font-medium">
                        {item.title}
                    </span>
                </nav>
            </Container>
        </section>
    );
}
