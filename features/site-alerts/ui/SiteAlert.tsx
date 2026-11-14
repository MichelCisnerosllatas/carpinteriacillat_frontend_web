// features/site-alerts/ui/SiteAlert.tsx
//
// UNA barra de aviso con forma de ListTile (Flutter):
//
//   [icono]  Título                    [→ / botón]   [✕]
//            Subtítulo
//
// - Si la alerta tiene link_url, toda la barra (menos la ✕) es un enlace:
//   páginas del sitio ("/...") con <Link>; externos (http, https, mailto, tel)
//   con <a> en otra pestaña.
// - La ✕ queda FUERA del enlace (un botón dentro de un <a> no es HTML válido)
//   y además frena el clic, así cerrar nunca navega.
// - Responsive: el texto se parte en varias líneas sin desbordar; la ✕ y el
//   botón miden al menos 36px de alto para tocarlos fácil en celular.
"use client";

import Link from "next/link";
import clsx from "clsx";
import type { MouseEvent, ReactNode } from "react";
import Container from "@/shared/ui/container/Container";
import type { SiteAlertDto } from "../model/siteAlert";
import { getAlertAlign, getAlertStyle } from "../lib/alertStyles";

type SiteAlertProps = {
    alert: SiteAlertDto;
    onDismiss: () => void;
};

// Enlaces que salen del sitio: se abren en otra pestaña.
const EXTERNAL_LINK = /^(https?:\/\/|mailto:|tel:)/i;

// Anillo de foco visible para teclado (usa el color del texto de la barra).
const FOCUS_RING =
    "outline-none focus-visible:ring-2 focus-visible:ring-current focus-visible:ring-offset-0";

export default function SiteAlert({ alert, onDismiss }: SiteAlertProps) {
    const style = getAlertStyle(alert.style);
    const align = getAlertAlign(alert.align);
    const linkUrl = alert.link_url?.trim() || null;
    const isExternal = linkUrl ? EXTERNAL_LINK.test(linkUrl) : false;
    const isInternal = linkUrl ? linkUrl.startsWith("/") : false;

    // Cerrar NO debe navegar aunque la barra sea un enlace.
    const handleDismiss = (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        event.stopPropagation();
        onDismiss();
    };

    // Fila del ListTile: icono + título/subtítulo + trailing.
    const row = (
        <span className={clsx("flex w-full items-center gap-2 sm:gap-3", align.justify)}>
            {alert.show_icon && (
                <i aria-hidden="true" className={clsx(style.icon, "shrink-0")} />
            )}

            <span className={clsx("flex min-w-0 flex-col break-words", align.text)}>
                {alert.title && (
                    <span className="font-semibold leading-snug">{alert.title}</span>
                )}
                {alert.subtitle && (
                    <span className="text-sm leading-snug">{alert.subtitle}</span>
                )}
            </span>

            {alert.trailing === "arrow" && (
                <span aria-hidden="true" className="shrink-0 text-lg leading-none">
                    →
                </span>
            )}

            {alert.trailing === "button" && alert.trailing_label && (
                <span className="inline-flex min-h-9 max-w-[45%] shrink-0 items-center justify-center rounded-full border border-current/40 bg-white/15 px-3 text-center text-xs font-semibold leading-tight sm:max-w-none sm:text-sm">
                    {alert.trailing_label}
                </span>
            )}
        </span>
    );

    // Espacio reservado para la ✕ (va en posición absoluta a la derecha). Si el
    // contenido va centrado, se reserva lo mismo a la izquierda para que quede
    // centrado de verdad.
    const contentClass = clsx(
        "block py-2 sm:py-2.5",
        alert.dismissible && "pr-10",
        alert.dismissible && alert.align === "center" && "pl-10"
    );

    let content: ReactNode;
    if (linkUrl && isInternal) {
        content = (
            <Link href={linkUrl} className={clsx(contentClass, FOCUS_RING, "rounded hover:opacity-90")}>
                {row}
            </Link>
        );
    } else if (linkUrl && isExternal) {
        content = (
            <a
                href={linkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={clsx(contentClass, FOCUS_RING, "rounded hover:opacity-90")}
            >
                {row}
            </a>
        );
    } else {
        // Sin enlace (o con un enlace que no reconocemos): solo texto.
        content = <div className={contentClass}>{row}</div>;
    }

    return (
        <div className={clsx(style.bar, "alert-slide transition-all duration-300")}>
            <Container className="relative">
                {content}

                {alert.dismissible && (
                    <button
                        type="button"
                        onClick={handleDismiss}
                        aria-label="Cerrar aviso"
                        className={clsx(
                            "absolute right-1 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full hover:bg-white/20 sm:right-3",
                            FOCUS_RING
                        )}
                    >
                        <i aria-hidden="true" className="fas fa-xmark text-sm" />
                    </button>
                )}
            </Container>
        </div>
    );
}
