"use client";

import { useState } from "react";

// LightGallery
import LightGallery from "lightgallery/react";
import lgThumbnail from "lightgallery/plugins/thumbnail";
import lgZoom from "lightgallery/plugins/zoom";
import lgFullscreen from "lightgallery/plugins/fullscreen";

import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-zoom.css";
import "lightgallery/css/lg-thumbnail.css";
import "lightgallery/css/lg-fullscreen.css";
import { useStickyTabs } from "@/widget/gallerywidget/galleryphotoswidget/lib/useStickyTabs";
import GalleryTabs from "@/widget/gallerywidget/galleryphotoswidget/ui/GalleryTabs";
import GalleryPhotoCard from "@/widget/gallerywidget/galleryphotoswidget/ui/GalleryPhotoCard";
import { getGalleryItems } from "@/features/gallery/lib/getGalleryItems";
import type { SiteSectionDto } from "@/shared/services/site_service/model/siteget.dto";

type Props = {
    // section_type === "gallery_grid".
    section: SiteSectionDto;
};

const HEADER_OFFSET = 60; // px, ajusta a lo que mejor se vea

export default function GalleryPhoto({ section }: Props) {
    const [activeTab, setActiveTab] = useState("todos");
    const { tabRef, isStuck } = useStickyTabs();

    const items = getGalleryItems(section);

    // Las categorias ya no vienen de un mapa fijo (GALLERY_CATEGORIES):
    // se derivan de las categorias que realmente traen las imagenes
    // (image.label). Si el backend agrega una categoria nueva, su tab
    // aparece solo, sin tocar este componente.
    const categories = Array.from(new Set(items.map((item) => item.category))).filter(Boolean);
    const tabs = [
        { value: "todos", label: "Todos" },
        ...categories.map((category) => ({ value: category, label: category })),
    ];

    const filteredImages = activeTab === "todos"
        ? items
        : items.filter((img) => img.category === activeTab);

    return (
        <section className="p-6">
            {/* TAB STICKY + ANIMADO */}
            <GalleryTabs
                tabRef={tabRef}
                tabs={tabs}
                activeTab={activeTab}
                onSelectTab={setActiveTab}
                isStuck={isStuck}
                topOffset={HEADER_OFFSET}
            />

            {/* solo detecta <a> con esta clase */}
            <LightGallery
                selector=".lg-item"
                plugins={[lgThumbnail, lgZoom, lgFullscreen]}
                speed={300}
            >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredImages.map((img) => (
                        <GalleryPhotoCard key={img.id} item={img} />
                    ))}
                </div>
            </LightGallery>
        </section>
    );
}
