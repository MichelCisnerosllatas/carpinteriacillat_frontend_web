import GalleryDetails from "@/features/gallery/ui/gallerydetails/GalleryDetails";
import { galleryItems } from "@/features/gallery/data/galleryItems";
import { notFound } from "next/navigation";

import type { Metadata } from "next";

type GalleryDetailsPageProps = {
    params: Promise<{ id: string }>;
};

export default async function GalleryDetailsPage({ params }: GalleryDetailsPageProps) {
    const { id } = await params;
    const item = galleryItems.find((i) => i.id === Number(id));

    if (!item) {
        notFound();
    }

    return <GalleryDetails item={item} />;
}

export async function generateMetadata({ params }: GalleryDetailsPageProps): Promise<Metadata> {
    const { id } = await params;
    const item = galleryItems.find((i) => i.id === Number(id));

    return {
        title: item ? `CILLAT | ${item.title}` : "Detalle Galería",
    };
}
