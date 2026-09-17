import GalleryDetails from "@/features/gallery/ui/gallerydetails/GalleryDetails";
import { getSite } from "@/shared/services/site_service/lib/getSite";
import { findGallerySection } from "@/features/gallery/lib/findGallerySection";
import { getGalleryItems } from "@/features/gallery/lib/getGalleryItems";
import { notFound } from "next/navigation";

import type { Metadata } from "next";

type GalleryDetailsPageProps = {
    params: Promise<{ id: string }>;
};

// Server Component: usa el mismo getSite() que app/gallery/page.tsx (Next
// lo dedupea dentro del mismo render). No pinta todas las secciones de
// "/gallery" — solo necesita la seccion "gallery_grid" para buscar el item
// puntual por id (ver findGallerySection/getGalleryItems).
export default async function GalleryDetailsPage({ params }: GalleryDetailsPageProps) {
    const { id } = await params;
    const site = await getSite();

    const section = site ? findGallerySection(site) : undefined;
    const items = getGalleryItems(section);
    const item = items.find((i) => i.id === id);

    if (!item) {
        notFound();
    }

    return <GalleryDetails item={item} />;
}

export async function generateMetadata({ params }: GalleryDetailsPageProps): Promise<Metadata> {
    const { id } = await params;
    const site = await getSite();

    const section = site ? findGallerySection(site) : undefined;
    const items = getGalleryItems(section);
    const item = items.find((i) => i.id === id);

    return {
        title: item ? `CILLAT | ${item.title}` : "Detalle Galería",
    };
}
