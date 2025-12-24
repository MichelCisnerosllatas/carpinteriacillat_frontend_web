import GalleryDetails from "@/features/gallery/ui/gallerydetails/GalleryDetails";

import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Detalle Galería",
};

export default function GalleryDetailsPage(){
    return <GalleryDetails/>;
}