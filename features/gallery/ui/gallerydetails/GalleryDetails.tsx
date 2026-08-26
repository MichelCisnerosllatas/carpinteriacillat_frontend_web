import GalleryDetailsHeader from "@/widget/gallerywidget/gallerydetailswidget/GalleryDetailsHeader";
import GalleryDetailSection1 from "@/widget/gallerywidget/gallerydetailswidget/GalleryDetailSection1";
import type { GalleryItem } from "@/features/gallery/data/galleryItems";

type GalleryDetailsProps = {
    item: GalleryItem;
};

export default function GalleryDetails({ item }: GalleryDetailsProps){
    // padding-top dinámico: antes era un pt-40 fijo que no alcanzaba a
    // despejar el header en mobile (los banners promocionales del header
    // pueden partirse en varias líneas ahí y hacerlo más alto), ver Header.tsx
    return (
        <main className="bg-gray-100" style={{ paddingTop: "calc(var(--app-header-height, 10rem) + 1rem)" }}>
            <GalleryDetailsHeader item={item} />

            <GalleryDetailSection1 item={item} />
        </main>
    )
}
