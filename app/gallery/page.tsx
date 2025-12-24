//app/gallery/page.tsx

import GallerySection1 from "@/features/gallery/ui/gallerysection1/GallerySection1";
import GalleryPhoto from "@/features/gallery/ui/galleryphotos/GalleryPhoto";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "CILLAT | Galería",
};

export default function GalleryPage () {
    return(
        <>
            <GallerySection1/>
            <GalleryPhoto/>
        </>
    )
}