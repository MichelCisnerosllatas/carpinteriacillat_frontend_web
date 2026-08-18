import GalleryDetailsHeader from "@/widget/gallerywidget/gallerydetailswidget/GalleryDetailsHeader";
import GalleryDetailSection1 from "@/widget/gallerywidget/gallerydetailswidget/GalleryDetailSection1";
import type { GalleryItem } from "@/features/gallery/data/galleryItems";

type GalleryDetailsProps = {
    item: GalleryItem;
};

export default function GalleryDetails({ item }: GalleryDetailsProps){
    return (
        <main className="pt-40 bg-gray-100">
            <GalleryDetailsHeader item={item} />

            <GalleryDetailSection1 item={item} />
        </main>
    )
}
