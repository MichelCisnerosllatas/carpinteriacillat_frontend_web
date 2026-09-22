//app/gallery/page.tsx
import MainGallery from "@/features/gallery/ui/MainGallery";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "CILLAT | Galería",
};

// MainGallery ya lee el sitio del store de Zustand (hidratado una sola vez
// desde app/layout.tsx, ver app/providers.tsx) — este archivo no vuelve a
// llamar getSite().
export default function GalleryPage() {
    return <MainGallery />;
}
