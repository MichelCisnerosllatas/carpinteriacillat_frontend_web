// widget/header/Navbar.tsx
"use client";

import { useState } from "react";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

type NavbarProps = {
    navbarSolid?: boolean;
};

type NavLink = {
    href: string;
    label: string;
};

export default function Navbar({ navbarSolid }: NavbarProps) {
    const [openMobile, setOpenMobile] = useState(false);

    const toggleMobile = () => setOpenMobile((prev) => !prev);
    const closeMobile = () => setOpenMobile(false);

    const links: NavLink[] = [
        { href: "/", label: "Inicio" },
        { href: "/services", label: "Servicios" },
        { href: "/gallerywidget", label: "Galería" },
        { href: "/we", label: "Nosotros" },
    ];

    return (
        <motion.nav
            id="navbar"
            className={clsx(
                "nav-transition",
                navbarSolid ? "bg-red-700 shadow-2xl" : "bg-transparent"
            )}
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
        >
            <div className="container mx-auto px-2">
                <div className="flex items-center justify-between py-2">
                    {/* Logo */}
                    <Link
                        href="/#inicio"
                        className="flex items-center gap-3 group cursor-pointer"
                        onClick={closeMobile}
                    >
                        <div className="relative w-10 h-10">
                            <Image
                                src="/img/solologocillat.png"
                                alt="Logo CILLAT"
                                fill
                                className="object-contain rounded-lg shadow-lg group-hover:scale-105 transition-transform"
                                priority
                            />
                        </div>

                        <div>
                            <h1 className="text-2xl font-extrabold text-white">
                                CILLAT
                                <i className="fas fa-check text-green-400 ml-1" />
                            </h1>
                            <p className="text-xs text-gray-200 -mt-1">
                                Fabricación de Muebles
                            </p>
                        </div>
                    </Link>

                    {/* Menu Desktop */}
                    <div className="hidden md:flex items-center gap-8">
                        {links.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="text-white hover:text-amber-400 font-medium transition-colors"
                            >
                                {item.label}
                            </Link>
                        ))}

                        <Link
                            href="/#contacto"
                            className="bg-amber-500 hover:bg-amber-600 text-gray-900 px-6 py-2.5 rounded-full font-semibold transition-all shadow-lg hover:shadow-xl"
                        >
                            Contacto
                        </Link>
                    </div>

                    {/* Menu Mobile Button */}
                    <button
                        id="menuBtn"
                        className="md:hidden text-white text-2xl z-50 relative"
                        onClick={toggleMobile}
                        aria-label={openMobile ? "Cerrar menú" : "Abrir menú"}
                    >
                        <i className={openMobile ? "fas fa-times" : "fas fa-bars"} />
                    </button>
                </div>
            </div>

            {/* Overlay Mobile Full Screen animado */}
            <AnimatePresence>
                {openMobile && (
                    <motion.div
                        id="mobileMenu"
                        className="md:hidden fixed inset-0 bg-gray-950/95 z-40"
                        initial={{ y: "-100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "-100%" }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                    >
                        <div className="flex flex-col h-full pt-28 px-6 pb-10 overflow-y-auto">
                            <nav className="space-y-4">
                                {links.map((item, index) => (
                                    <motion.div
                                        key={item.href}
                                        initial={{ opacity: 0, x: -15 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.25, delay: 0.05 * index }}
                                    >
                                        <Link
                                            href={item.href}
                                            className="block text-white text-xl font-semibold py-2 border-b border-gray-800"
                                            onClick={closeMobile}
                                        >
                                            {item.label}
                                        </Link>
                                    </motion.div>
                                ))}

                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.25, delay: 0.05 * links.length }}
                                >
                                    <Link
                                        href="/#contacto"
                                        className="mt-6 block bg-amber-500 text-gray-900 py-3 px-4 rounded-full font-semibold text-center text-lg"
                                        onClick={closeMobile}
                                    >
                                        Contacto
                                    </Link>
                                </motion.div>
                            </nav>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
}
