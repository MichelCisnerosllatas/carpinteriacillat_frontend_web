// widget/header/Header.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Alert1 from "@/widget/header/Alert1";
import Alert2 from "@/widget/header/Alert2";
import Navbar from "@/widget/header/Navbar";
import { useNavbarStore } from "@/shared/store/navbar/useNavbarStore";
import type { SiteNavigationDto } from "@/shared/services/site_service/model/siteget.dto";

type HeaderProps = {
    // Lo que app/layout.tsx (Server Component) ya trajo de GET /v1/public/site
    // antes de renderizar. null = la peticion en el servidor fallo.
    initialNavigations: SiteNavigationDto[] | null;
};

export default function Header({ initialNavigations }: HeaderProps) {
    const pathname = usePathname();
    const applyByPath = useNavbarStore((s) => s.applyByPath);
    const headerRef = useRef<HTMLElement>(null);

    const [scrollY, setScrollY] = useState(0);
    const [tempClosedByUser, setTempClosedByUser] = useState(false);

    // El header es "fixed", así que las secciones de cada página necesitan
    // un padding-top que lo compense. Antes ese padding era un número fijo
    // adivinado (pt-24, pt-40...), pero el alto real del header cambia: en
    // mobile los banners (Alert1/Alert2) parten su texto en 2-3 líneas y el
    // header termina midiendo bastante más de lo que esos valores asumían,
    // tapando el contenido. Medimos el alto real y lo publicamos como
    // variable CSS para que cualquier página lo use en vez de adivinar.
    useEffect(() => {
        const el = headerRef.current;
        if (!el) return;

        const updateHeight = () => {
            document.documentElement.style.setProperty(
                "--app-header-height",
                `${el.offsetHeight}px`
            );
        };

        updateHeight();

        const resizeObserver = new ResizeObserver(updateHeight);
        resizeObserver.observe(el);

        return () => resizeObserver.disconnect();
    }, []);

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
        <header ref={headerRef} className="fixed top-0 inset-x-0 z-50 nav-transition bg-transparent">
            {showFixedAlert && <Alert1 />}
            {showTemporaryAlert && <Alert2 onClose={() => setTempClosedByUser(true)} />}
            <Navbar navbarSolid={navbarSolid} initialNavigations={initialNavigations} />
        </header>
    );
}