"use client";

import Image from "next/image";

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

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredImages.map((img)=> {
                        return (
                            <div
                                key={img.id}
                                className="bg-white rounded-xl overflow-hidden shadow-md border flex flex-col"
                            >
                            {/* miniatura que abre el modal: recuadro de proporción fija
                                (4:3) para que todas las cards midan lo mismo y se
                                alineen en filas, sin importar el tamaño real de la foto */}
                            <a
                                href={img.url}
                                data-src={img.url}
                                className="lg-item block relative w-full aspect-[4/3] overflow-hidden"
                            >
                                <Image
                                    src={img.url}
                                    alt={img.title}
                                    fill
                                    sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                                    className="object-cover"
                                />
                            </a>

                            <div className="p-3 space-y-2 flex-1 flex flex-col">
                                <h3 className="font-semibold text-gray-800 text-lg">
                                    {img.title}
                                </h3>

                                <p className="text-gray-600 text-sm">
                                    {img.description}
                                </p>

                                <Link
                                    href={`/gallery/${img.id}`}
                                    className="text-blue-600 text-sm hover:underline mt-auto"
                                >
                                    Ver más detalles →
                                </Link>
                            </div>
                        </div>
                        )
                    })}
                </div>
            </LightGallery>
        </section>
    );
}
