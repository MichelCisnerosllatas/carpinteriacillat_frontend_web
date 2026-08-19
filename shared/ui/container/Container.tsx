// shared/ui/container/Container.tsx
import type { ElementType, ReactNode } from "react";
import clsx from "clsx";

type ContainerProps = {
    children: ReactNode;
    className?: string;
    /** Elemento HTML a renderizar (por defecto "div"). Útil cuando el
     *  propio <section> debe ser el contenedor, ej: as="section". */
    as?: ElementType;
};

/**
 * Contenedor horizontal estándar del sitio.
 *
 * Centraliza el max-width y el padding lateral (izquierda/derecha) para
 * que TODAS las secciones (Home, Nosotros, Servicios, Galería, Header,
 * Footer) queden alineadas al mismo margen. Antes cada sección definía
 * su propio ancho/padding (`container px-2`, `max-w-6xl px-4`,
 * `max-w-7xl px-4`, algunas incluso sin padding), lo que hacía que unas
 * se vieran "más adentro" que otras.
 *
 * Uso: envolver el contenido de la sección con este componente en vez
 * de repetir `max-w-* mx-auto px-*` sueltos. Clases adicionales (grid,
 * flex, text-center, etc.) se pasan por `className` y se combinan con
 * las de acá.
 */
export default function Container({ children, className, as: Tag = "div" }: ContainerProps) {
    return (
        <Tag className={clsx("max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", className)}>
            {children}
        </Tag>
    );
}
