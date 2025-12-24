// widget/header/Navbar.tsx
"use client";

import { useState } from "react";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {useNavbarStore} from "@/shared/store/navbar/NavbarStore";
import { usePathname } from "next/navigation";

type NavbarProps = {
    navbarSolid?: boolean;
};

type NavLink = {
    href: string;
    label: string;
};

export default function Navbar({ navbarSolid }: NavbarProps) {
    const pathname = usePathname();
    const [openMobile, setOpenMobile] = useState(false);
    const { style } = useNavbarStore();


    const linkClass = navbarSolid ? style.linkSolid : style.linkTransparent;
    const linkHoverClass = navbarSolid ? style.linkSolidHover : style.linkTransparentHover;

    const toggleMobile = () => setOpenMobile((prev) => !prev);
    const closeMobile = () => setOpenMobile(false);

    const links: NavLink[] = [
        { href: "/", label: "Inicio" },
        { href: "/services", label: "Servicios" },
        { href: "/gallery", label: "Galería" },
        { href: "/we", label: "Nosotros" },
    ];

    return (
        <motion.nav
            id="navbar"
            className={clsx(
                "nav-transition",
                navbarSolid ? style.bgSolid : style.bgTransparent,
                navbarSolid && "shadow-2xl",
                navbarSolid && style.ring
            )}
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
        >
            <div className="container mx-auto px-2">
                <div className="flex items-center justify-between py-2">
                    {/* Logo */}
                    <Link
                        href="/"
                        className={clsx(linkClass, linkHoverClass, "flex items-center gap-3 group cursor-pointer")}                        // className={clsx(style.link, style.linkHover, "flex items-center gap-3 group cursor-pointer")}
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
                            <h1 className={clsx("text-2xl font-extrabold", linkClass)}>
                                CILLAT <i className="fas fa-check text-green-400 ml-1" />
                            </h1>
                            <p className={clsx("text-xs -mt-1 opacity-90", linkClass)}>
                                Fabricación de Muebles
                            </p>
                        </div>
                    </Link>

                    {/* Menu Desktop */}
                    <div className="hidden md:flex items-center gap-8">
                        {/*{links.map((item) => (*/}
                        {/*    <Link*/}
                        {/*        key={item.href}*/}
                        {/*        href={item.href}*/}
                        {/*        className={clsx(linkClass, linkHoverClass, "font-medium transition-colors")}*/}
                        {/*    >*/}
                        {/*        {item.label}*/}
                        {/*    </Link>*/}
                        {/*))}*/}
                        {links.map((item) => {
                            const isSameRoute = pathname === item.href;

                            const base = "font-medium transition-colors";
                            const active = "text-[#f5c400] underline underline-offset-8";
                            const normal = clsx(linkClass, linkHoverClass);
                            const className = clsx(base, isSameRoute ? active : normal);

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={className}
                                    aria-current={isSameRoute ? "page" : undefined}
                                    onClick={(e) => {
                                        if (isSameRoute) {
                                            // ✅ evita navegación Next => NO loader
                                            e.preventDefault();

                                            // ✅ comportamiento natural deseado: volver arriba
                                            window.scrollTo({ top: 0, behavior: "smooth" });
                                        }
                                    }}
                                >
                                    {item.label}
                                </Link>
                            );
                        })}

                        <Link
                            href="/#contacto"
                            className={clsx(style.buttonBg, style.buttonText, "px-6 py-2.5 rounded-full font-semibold shadow-lg")}>
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
                        className={clsx("md:hidden fixed inset-0 z-40", style.mobileBg)}
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
