// features/gallery/lib/useGalleryFilters.ts
//
// Estado del buscador y los filtros de la galería, sincronizado con la URL:
//
//   /gallery?q=ropero&type=restoration&cat=Cocinas,Roperos&mad=Cedro&est=Rústico&ver=24
//
// (type lleva CLAVES de tipo de trabajo, ej. "manufacture,restoration"; el resto, nombres).
// `ver` = cuántos trabajos se están mostrando (botón «Ver más»). Queda en la URL para que al
// entrar a un trabajo y volver no se pierda; al cambiar cualquier filtro se borra (vuelve al
// primer bloque).
//
// Por qué en la URL: así un link como "/gallery?type=restoration" (botones de Servicios y del
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

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { EMPTY_FILTERS, type FilterListKey, type WorkFilters } from "./filterWorks";

// Nombre corto de cada filtro en la URL.
const URL_KEYS: Record<FilterListKey, string> = {
    types: "type",
    categories: "cat",
    woods: "mad",
    styles: "est",
};

function readList(value: string | null): string[] {
    return value ? value.split(",").filter(Boolean) : [];
}

// Nombre en la URL de "cuántos trabajos se muestran".
const SHOWN_KEY = "ver";

function buildQueryString(filters: WorkFilters, shown: number | null): string {
    const params = new URLSearchParams();
    if (filters.query.trim()) params.set("q", filters.query);
    for (const key of Object.keys(URL_KEYS) as FilterListKey[]) {
        if (filters[key].length > 0) params.set(URL_KEYS[key], filters[key].join(","));
    }
    if (shown !== null) params.set(SHOWN_KEY, String(shown));
    return params.toString();
}

// Última URL de la galería (con filtros y "ver"), para que el enlace «‹ Galería» del detalle
// vuelva exactamente a donde estaba el cliente (ver DetailTopBar). Se guarda en sessionStorage
// (dura lo que dura la pestaña); si el navegador lo bloquea, el enlace va a /gallery a secas.
const LAST_URL_KEY = "gallery-last-url";

export function rememberGalleryUrl(url: string): void {
    try {
        window.sessionStorage.setItem(LAST_URL_KEY, url);
    } catch {
        // sessionStorage bloqueado: no pasa nada
    }
}

export function readLastGalleryUrl(): string | null {
    try {
        const url = window.sessionStorage.getItem(LAST_URL_KEY);
        return url && url.startsWith("/gallery") ? url : null;
    } catch {
        return null;
    }
}

// "24" → 24; vacío o inválido → null (= el primer bloque).
function readShown(value: string | null): number | null {
    const n = Number(value);
    return Number.isInteger(n) && n > 0 ? n : null;
}

export function useGalleryFilters() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    // La función dentro de useState solo corre en el primer render (lee la URL una vez).
    const [filters, setFilters] = useState<WorkFilters>(() => ({
        query: searchParams.get("q") ?? "",
        types: readList(searchParams.get(URL_KEYS.types)),
        categories: readList(searchParams.get(URL_KEYS.categories)),
        woods: readList(searchParams.get(URL_KEYS.woods)),
        styles: readList(searchParams.get(URL_KEYS.styles)),
    }));
    // Cuántos trabajos se muestran (null = el primer bloque, ver pagination.page_size).
    const [shown, setShownState] = useState<number | null>(() => readShown(searchParams.get(SHOWN_KEY)));

    // Al entrar a la galería se recuerda su URL tal cual llegó (ej. desde un enlace con ?type=).
    useEffect(() => {
        const queryString = searchParams.toString();
        rememberGalleryUrl(queryString ? `${pathname}?${queryString}` : pathname);
        // Solo al montar: después cada cambio la guarda en writeUrl.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function writeUrl(nextFilters: WorkFilters, nextShown: number | null) {
        const queryString = buildQueryString(nextFilters, nextShown);
        const url = queryString ? `${pathname}?${queryString}` : pathname;
        rememberGalleryUrl(url);
        router.replace(url, { scroll: false });
    }

    // Cambiar un filtro vuelve al primer bloque de trabajos (se borra "ver").
    function update(next: WorkFilters) {
        setFilters(next);
        setShownState(null);
        writeUrl(next, null);
    }

    // Botón «Ver más»: guarda la nueva cantidad mostrada.
    function setShown(count: number) {
        setShownState(count);
        writeUrl(filters, count);
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

    return { filters, setQuery, toggle, clear, resetAll, shown, setShown };
}
