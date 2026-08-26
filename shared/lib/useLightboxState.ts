"use client";

import { useState } from "react";

// Estado de "abrir imagen N en el lightbox" repetido igual (isOpen + index +
// open + close) en varias secciones con galería (home, nosotros...).
export function useLightboxState() {
    const [isOpen, setIsOpen] = useState(false);
    const [index, setIndex] = useState(0);

    const open = (targetIndex: number) => {
        setIndex(targetIndex);
        setIsOpen(true);
    };

    const close = () => setIsOpen(false);

    return { isOpen, index, open, close };
}
