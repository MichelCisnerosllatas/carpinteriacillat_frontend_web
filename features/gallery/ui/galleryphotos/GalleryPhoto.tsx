"use client";

import Image from "next/image";
import Masonry from "react-masonry-css";

// LightGallery
import LightGallery from "lightgallery/react";
import lgThumbnail from "lightgallery/plugins/thumbnail";
import lgZoom from "lightgallery/plugins/zoom";
import lgFullscreen from "lightgallery/plugins/fullscreen";

import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-zoom.css";
import "lightgallery/css/lg-thumbnail.css";
import "lightgallery/css/lg-fullscreen.css";
import {useEffect, useRef, useState} from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { galleryItems, GALLERY_CATEGORIES } from "@/features/gallery/data/galleryItems";

// "Todos" + una entrada por cada categoría registrada en GALLERY_CATEGORIES.
// Agregar una categoría nueva en galleryItems.ts hace aparecer su tab acá solo.
const tabs = [
    { value: "todos", label: "Todos" },
    ...Object.entries(GALLERY_CATEGORIES).map(([value, label]) => ({ value, label })),
];

export default function Gallery() {
    const [activeTab, setActiveTab] = useState("todos");
    const [isTabStuck, setIsTabStuck] = useState(false);
    const tabRef = useRef<HTMLDivElement | null>(null);

    const images = galleryItems;
    const breakpoints = {
        default: 4,
        1024: 3,
        768: 2,
        500: 1,
    };

    useEffect(() => {
        const handleScroll = () => {
            if (!tabRef.current) return;
            const rect = tabRef.current.getBoundingClientRect();
            // Cuando el tab llega cerca de la parte superior, lo marcamos como "stuck"
            setIsTabStuck(rect.top <= 8);
        };

        handleScroll(); // para setear bien al inicio
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const HEADER_OFFSET = 60; // px, ajusta a lo que mejor se vea
    const filteredImages = activeTab === "todos" ? images : images.filter(
        (img) => img.category === activeTab
    );

    const onclikTab = (tab: string) => {
        setActiveTab(tab);
    }

    return (
        <section className="p-6">
            {/* TAB STICKY + ANIMADO */}
            <motion.div
                ref={tabRef}
                className="sticky z-30 w-full flex justify-center mb-6"
                style={{ top: HEADER_OFFSET }}
                initial={{ y: -20, opacity: 0 }}
                animate={{
                    y: 0,
                    opacity: 1,
                    boxShadow: isTabStuck
                        ? "0 10px 25px rgba(15,23,42,0.15)"
                        : "0 0 0 rgba(0,0,0,0)",
                    scale: isTabStuck ? 1.01 : 1,
                }}
                transition={{ type: "spring", stiffness: 260, damping: 24 }}
            >
                <div className="flex flex-wrap justify-center border-b border-gray-200 bg-white/90 backdrop-blur-md rounded-b-2xl px-3 pt-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.value}
                            onClick={() => onclikTab(tab.value)}
                            className={`
                                py-2 px-4 border-b-2 focus:outline-none transition-colors whitespace-nowrap
                                ${activeTab === tab.value
                                ? "border-brand-red text-brand-red"
                                : "border-transparent text-gray-600 hover:text-brand-red hover:border-brand-red"
                            }
                            `}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </motion.div>


            {/* solo detecta <a> con esta clase */}
            <LightGallery
                selector=".lg-item"
                plugins={[lgThumbnail, lgZoom, lgFullscreen]}
                speed={300}
            >

                <Masonry
                    breakpointCols={breakpoints}
                    className="flex gap-4"
                    columnClassName="flex flex-col gap-4"
                >
                    {filteredImages.map((img)=> {
                        return (
                            <div
                                key={img.id}
                                className="bg-white rounded-xl overflow-hidden shadow-md border"
                            >
                            {/* miniatura que abre el modal */}
                            <a
                                href={img.url}
                                data-src={img.url}
                                className="lg-item block"
                            >
                                <Image
                                    src={img.url}
                                    alt={img.title}
                                    width={500}
                                    height={500}
                                    className="w-full h-auto object-cover"
                                />
                            </a>

                            <div className="p-3 space-y-2">
                                <h3 className="font-semibold text-gray-800 text-lg">
                                    {img.title}
                                </h3>

                                <p className="text-gray-600 text-sm">
                                    {img.description}
                                </p>

                                <Link
                                    href={`/gallery/${img.id}`}
                                    className="text-blue-600 text-sm hover:underline"
                                >
                                    Ver más detalles →
                                </Link>
                            </div>
                        </div>
                        )
                    })}
                </Masonry>
            </LightGallery>
        </section>
    );
}
