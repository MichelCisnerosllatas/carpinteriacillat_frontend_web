//app/gallery/page.tsx
import MainGallery from "@/features/gallery/ui/MainGallery";
import { getSite } from "@/shared/services/site_service/lib/getSite";
import { findSiteNavigationByUrl } from "@/shared/services/site_service/lib/findSiteNavigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "CILLAT | Galería",
};

export default async function GalleryPage() {
    const site = await getSite();
    if (!site) {
        return <MainGallery navigation={null} />;
    }

    const navigation = findSiteNavigationByUrl(site.navigations, "/gallery") ?? null;

    return <MainGallery navigation={navigation} />;
}
