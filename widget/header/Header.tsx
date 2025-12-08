// widget/header/Header.tsx
"use client";

import { useEffect, useState } from "react";
import Alert1 from "@/widget/header/Alert1";
import Alert2 from "@/widget/header/Alert2";
import Navbar from "@/widget/header/Navbar";

export default function Header() {
    const [scrollY, setScrollY] = useState(0);
    const [tempClosedByUser, setTempClosedByUser] = useState(false);

    useEffect(() => {
        const onScroll = () => {
            setScrollY(window.scrollY);
        };

        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const navbarSolid = scrollY > 50;
    const showFixedAlert = scrollY <= 100;
    const showTemporaryAlert = !tempClosedByUser && scrollY <= 50;

    return (
        <header
            id="siteHeader"
            className="fixed top-0 inset-x-0 z-50 nav-transition bg-transparent"
        >
            {showFixedAlert && <Alert1 />}

            {showTemporaryAlert && (
                <Alert2 onClose={() => setTempClosedByUser(true)} />
            )}

            <Navbar navbarSolid={navbarSolid} />
        </header>
    );
}
