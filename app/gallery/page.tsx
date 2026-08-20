//app/gallery/page.tsx
import MainGallery from "@/features/gallery/ui/MainGallery";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "CILLAT | Galería",
};

export default function GalleryPage() {
    return <MainGallery/>;
}
