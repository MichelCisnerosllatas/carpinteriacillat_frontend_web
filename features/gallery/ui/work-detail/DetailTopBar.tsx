// features/gallery/ui/work-detail/DetailTopBar.tsx
//
// Barra de arriba del detalle, sencilla (texto chico, sin botones grandes):
//   Escritorio:  ‹ Galería  /  Roperos  /  Ropero de puertas corredizas
//   Celular:     ‹ Volver a la galería
// "Galería" y la categoría son enlaces (la categoría abre la galería filtrada); el nombre del
// trabajo no, y se corta con "…" si es largo.
//
// Apariencia: info.show_back (el "‹ Volver…"), info.back_label (su texto) e
// info.show_breadcrumb (la ruta). Si solo está la ruta, se ve también en celular; si solo
// está el botón, se ve en todos los tamaños. Si las dos están ocultas, no se pinta la barra.
//
// "Volver" lleva a la ÚLTIMA página de la galería que vio el cliente (con sus filtros y los
// trabajos que ya había cargado con «Ver más», ej. /gallery?ver=24): la recuerda
// useGalleryFilters en sessionStorage. Si no hay ninguna, va a /gallery.
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import Container from "@/shared/ui/container/Container";
import { readLastGalleryUrl } from "@/features/gallery/lib/useGalleryFilters";

type Props = {
    categoryName: string | null;
    title: string;
    showBack?: boolean;
    backLabel?: string;
    showBreadcrumb?: boolean;
};

const linkClass = "inline-flex items-center gap-1 font-medium transition-colors hover:text-il-neutro-900";

export default function DetailTopBar({ categoryName, title, showBack = true, backLabel = "Volver a la galería", showBreadcrumb = true }: Props) {
    const router = useRouter();

    // El enlace apunta a "/gallery" (sirve para abrir en otra pestaña o sin JavaScript), pero el
    // clic normal lleva a la última URL de la galería que vio el cliente, si hay una guardada.
    function goToGallery(e: React.MouseEvent<HTMLAnchorElement>) {
        // Ctrl/Cmd/Shift + clic o botón del medio: comportamiento normal del navegador
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        const last = readLastGalleryUrl();
        if (!last) return;
        e.preventDefault();
        router.push(last);
    }

    if (!showBack && !showBreadcrumb) return null;

    const categoryHref = categoryName ? `/gallery?cat=${encodeURIComponent(categoryName)}` : null;

    return (
        <Container className="pt-5">
            <nav aria-label="Ruta de navegación" className="flex min-w-0 items-center text-sm text-il-neutro-600">
                {/* "‹ Volver a la galería": siempre si no hay ruta; con ruta, solo en celular */}
                {showBack && (
                    <Link href="/gallery" onClick={goToGallery} data-el="detail-back" className={`${linkClass} ${showBreadcrumb ? "sm:hidden" : ""}`}>
                        <span aria-hidden="true" className="text-base leading-none">‹</span>
                        {backLabel}
                    </Link>
                )}

                {/* Ruta: con el botón activo se ve desde tablet; sin botón, también en celular */}
                {showBreadcrumb && (
                    <ol
                        data-el="detail-breadcrumb"
                        className={`${showBack ? "hidden sm:flex" : "flex"} min-w-0 items-center gap-2`}
                    >
                        <li className="flex-none">
                            {/* También es el "volver" en escritorio (por eso lleva su ancla). */}
                            <Link href="/gallery" onClick={goToGallery} data-el={showBack ? "detail-back" : undefined} className={linkClass}>
                                <span aria-hidden="true" className="text-base leading-none">‹</span>
                                Galería
                            </Link>
                        </li>
                        {categoryName && categoryHref && (
                            <>
                                <li aria-hidden="true" className="flex-none text-il-neutro-400">/</li>
                                <li className="flex-none">
                                    <Link href={categoryHref} className={linkClass}>{categoryName}</Link>
                                </li>
                            </>
                        )}
                        <li aria-hidden="true" className="flex-none text-il-neutro-400">/</li>
                        <li aria-current="page" className="min-w-0 truncate text-il-neutro-900">{title}</li>
                    </ol>
                )}
            </nav>
        </Container>
    );
}
