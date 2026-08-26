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
import { galleryItems, GALLERY_CATEGORIES } from "@/features/gallery/data/galleryItems";
import { useStickyTabs } from "@/widget/gallerywidget/galleryphotoswidget/lib/useStickyTabs";
import GalleryTabs from "@/widget/gallerywidget/galleryphotoswidget/ui/GalleryTabs";
import GalleryPhotoCard from "@/widget/gallerywidget/galleryphotoswidget/ui/GalleryPhotoCard";

// "Todos" + una entrada por cada categoría registrada en GALLERY_CATEGORIES.
// Agregar una categoría nueva en galleryItems.ts hace aparecer su tab acá solo.
const tabs = [
    { value: "todos", label: "Todos" },
    ...Object.entries(GALLERY_CATEGORIES).map(([value, label]) => ({ value, label })),
];

const HEADER_OFFSET = 60; // px, ajusta a lo que mejor se vea

export default function GalleryPhoto() {
    const [activeTab, setActiveTab] = useState("todos");
    const { tabRef, isStuck } = useStickyTabs();

    const filteredImages = activeTab === "todos"
        ? galleryItems
        : galleryItems.filter((img) => img.category === activeTab);

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
