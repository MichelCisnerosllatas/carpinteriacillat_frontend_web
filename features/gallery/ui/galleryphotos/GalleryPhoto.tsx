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

export default function Gallery() {
    const [activeTab, setActiveTab] = useState("todos");
    const [isTabStuck, setIsTabStuck] = useState(false);
    const tabRef = useRef<HTMLDivElement | null>(null);

    const images = [
        {
            id: 1,
            category: "camas",
            title: "Mueble esquinero",
            url: "https://i.pinimg.com/736x/f6/b9/ba/f6b9ba30e09373e5ba7e8ee446cc8e20.jpg",
            description: "Un mueble esquinero moderno ideal.",
            link: "https://google.com",
        },
        {
            id: 2,
            category: "puertas",
            title: "Mueble sala",
            url: "https://i.pinimg.com/1200x/6b/a9/a2/6ba9a22957d3dd777f5b2e8ce52067ee.jpg",
            description: "Diseño minimalista elegante.",
            link: "#",
        },
        {
            id: 3,
            category: "camas",
            title: "Mueble sala",
            url: "https://i.pinimg.com/1200x/9b/80/e7/9b80e79cd4ff7649eeea907bcc0e77c2.jpg",
            description: "Diseño minimalista elegante.",
            link: "#",
        },
        {
            id: 4,
            category: "puertas",
            title: "Mueble sala",
            url: "https://i.pinimg.com/1200x/af/2f/c0/af2fc075725c71f1ed16a02b4e6e3e5d.jpg",
            description: "Diseño minimalista elegante.",
            link: "#",
        },
        {
            id: 5,
            category: "camas",
            title: "Mueble sala",
            url: "https://i.pinimg.com/474x/a3/76/7e/a3767ea0e5f186b43d85bb0b0212d037.jpg",
            description: "Diseño minimalista elegante.",
            link: "#",
        },
        {
            id: 6,
            category: "puertas",
            title: "Mueble sala",
            url: "https://i.pinimg.com/1200x/3c/b4/dd/3cb4ddb86fba902bc5ff2d0f7c3b1ae5.jpg",
            description: "Diseño minimalista elegante.",
            link: "#",
        },
        {
            id: 7,
            category: "camas",
            title: "Mueble sala",
            url: "https://i.pinimg.com/736x/cb/a8/07/cba807d401e9c023f6a38852f6217db4.jpg",
            description: "Diseño minimalista elegante.",
            link: "#",
        },
        {
            id: 8,
            category: "puertas",
            title: "Mueble sala",
            url: "https://i.pinimg.com/736x/17/a9/23/17a923eb8cb201309517d25cfee8d827.jpg",
            description: "Diseño minimalista elegante.",
            link: "#",
        },
    ];
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
                <div className="flex border-b border-gray-200 bg-white/90 backdrop-blur-md rounded-b-2xl px-3 pt-2">
                    <button
                        onClick={() => onclikTab("todos")}
                        className={`
                            py-2 px-4 border-b-2 focus:outline-none transition-colors
                            ${activeTab === "todos"
                            ? "border-blue-500 text-blue-500"
                            : "border-transparent text-gray-600 hover:text-blue-500 hover:border-blue-500"
                        }
                        `}
                    >
                        Todos
                    </button>
                    <button
                        onClick={() => onclikTab("camas")}
                        className={`
                            py-2 px-4 border-b-2 focus:outline-none transition-colors
                            ${activeTab === "camas"
                            ? "border-blue-500 text-blue-500"
                            : "border-transparent text-gray-600 hover:text-blue-500 hover:border-blue-500"
                        }
                        `}
                    >
                        Camas
                    </button>
                    <button
                        onClick={() => onclikTab("puertas")}
                        className={`
                            py-2 px-4 border-b-2 focus:outline-none transition-colors
                            ${activeTab === "puertas"
                            ? "border-blue-500 text-blue-500"
                            : "border-transparent text-gray-600 hover:text-blue-500 hover:border-blue-500"
                        }
                        `}
                    >
                        Puertas
                    </button>
                </div>
            </motion.div>


            {/* solo detecta <a> con esta clase */}
            <LightGallery
                selector=".lg-item"
                plugins={[lgThumbnail, lgZoom, lgFullscreen]}
                speed={300}
                licenseKey="0000-0000-000-0000"
            >

                <Masonry
                    breakpointCols={breakpoints}
                    className="flex gap-4"
                    columnClassName="flex flex-col gap-4"
                >
                    {filteredImages.map((img) => (
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
                                    unoptimized
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

                                <a
                                    href={img.link}
                                    target="_blank"
                                    className="text-blue-600 text-sm hover:underline"
                                >
                                    Ver más detalles →
                                </a>
                            </div>
                        </div>
                    ))}
                </Masonry>
            </LightGallery>
        </section>
    );
}
