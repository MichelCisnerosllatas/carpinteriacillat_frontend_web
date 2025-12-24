// widget/header/Header.tsx
"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Alert1 from "@/widget/header/Alert1";
import Alert2 from "@/widget/header/Alert2";
import Navbar from "@/widget/header/Navbar";
import { useNavbarStore } from "@/shared/store/navbar/NavbarStore";

export default function Header() {
    const pathname = usePathname();
    const applyByPath = useNavbarStore((s) => s.applyByPath);

    const [scrollY, setScrollY] = useState(0);
    const [tempClosedByUser, setTempClosedByUser] = useState(false);

    // ✅ 1 solo efecto para ruta en TODA tu app
    useEffect(() => {
        applyByPath(pathname);
    }, [pathname, applyByPath]);

    // scroll (normal que viva aquí)
    useEffect(() => {
        const onScroll = () => setScrollY(window.scrollY);
        window.addEventListener("scroll", onScroll);
        onScroll();
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const navbarSolid = scrollY > 50;
    const showFixedAlert = scrollY <= 100;
    const showTemporaryAlert = !tempClosedByUser && scrollY <= 50;

    return (
        <header className="fixed top-0 inset-x-0 z-50 nav-transition bg-transparent">
            {showFixedAlert && <Alert1 />}
            {showTemporaryAlert && <Alert2 onClose={() => setTempClosedByUser(true)} />}
            <Navbar navbarSolid={navbarSolid} />
        </header>
    );
}