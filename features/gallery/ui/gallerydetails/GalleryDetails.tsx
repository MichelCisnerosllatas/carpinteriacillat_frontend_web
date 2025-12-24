import GalleryDetailsHeader from "@/widget/gallerywidget/gallerydetailswidget/GalleryDetailsHeader";
import GalleryDetailSection1 from "@/widget/gallerywidget/gallerydetailswidget/GalleryDetailSection1";

export default function GalleryDetails(){
    return (
        <main className="pt-40 bg-gray-100">
            <GalleryDetailsHeader />

            <GalleryDetailSection1/>
        </main>
    )
}