// features/gallery/lib/useGalleryFilters.ts
//
// Estado del buscador y los filtros de la galería, sincronizado con la URL:
//
//   /gallery?q=ropero&cat=Cocinas,Roperos&mad=Cedro&est=Rústico
//
// Por qué en la URL: así un link como "/gallery?cat=Restauración" (botones de Servicios y del
// detalle) abre la galería ya filtrada, y la persona puede compartir o recargar la búsqueda.
//
// Cómo funciona:
//   1) Al montar, el estado se lee UNA vez de la URL (useSearchParams).
//   2) Cada cambio actualiza el estado local (la pantalla responde al instante, sin esperar
//      a Next) y reemplaza la URL con router.replace — "replace" para no llenar el historial
//      del botón Atrás con cada letra, y scroll:false para que la página no salte arriba.
//
// OJO: useSearchParams obliga a que el componente que lo usa esté dentro de un <Suspense>
// (ver el case "work_gallery" en SectionRenderer.tsx).
"use client";

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { EMPTY_FILTERS, type FilterListKey, type WorkFilters } from "./filterWorks";

// Nombre corto de cada filtro en la URL.
const URL_KEYS: Record<FilterListKey, string> = {
    categories: "cat",
    woods: "mad",
    styles: "est",
};

function readList(value: string | null): string[] {
    return value ? value.split(",").filter(Boolean) : [];
}

function buildQueryString(filters: WorkFilters): string {
    const params = new URLSearchParams();
    if (filters.query.trim()) params.set("q", filters.query);
    for (const key of Object.keys(URL_KEYS) as FilterListKey[]) {
        if (filters[key].length > 0) params.set(URL_KEYS[key], filters[key].join(","));
    }
    return params.toString();
}

export function useGalleryFilters() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    // La función dentro de useState solo corre en el primer render (lee la URL una vez).
    const [filters, setFilters] = useState<WorkFilters>(() => ({
        query: searchParams.get("q") ?? "",
        categories: readList(searchParams.get(URL_KEYS.categories)),
        woods: readList(searchParams.get(URL_KEYS.woods)),
        styles: readList(searchParams.get(URL_KEYS.styles)),
    }));

    function update(next: WorkFilters) {
        setFilters(next);
        const queryString = buildQueryString(next);
        router.replace(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false });
    }

    function setQuery(query: string) {
        update({ ...filters, query });
    }

    // Marca o desmarca un valor (ej. la categoría "Cocinas").
    function toggle(key: FilterListKey, value: string) {
        const list = filters[key];
        const nextList = list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
        update({ ...filters, [key]: nextList });
    }

    function clear(key: FilterListKey) {
        update({ ...filters, [key]: [] });
    }

    function resetAll() {
        update(EMPTY_FILTERS);
    }

    return { filters, setQuery, toggle, clear, resetAll };
}
