// features/gallery/lib/filterWorks.ts
//
// Lógica pura (sin React) del buscador y los filtros de la galería:
//   - búsqueda de texto en título, tipo, categoría, madera, estilo, lugar y acabado;
//   - filtros de selección múltiple por tipo, categoría, madera y estilo;
//   - conteos para los botones ("Cocinas · 3 trabajos").
// Se separa de los componentes para poder leerla (y cambiarla) sin tocar el HTML.

import type { SiteWorkDto } from "@/shared/services/site_service/model/siteget.dto";
import { getWorkTypeKey, getWorkTypeName } from "@/shared/services/site_service/lib/workTypes";

export type WorkFilters = {
    query: string;
    // Claves de tipo ("restoration"), no nombres: así la URL ?type=restoration no depende del
    // texto que el admin le ponga al tipo. Para mostrar se usa getTypeLabel().
    types: string[];
    categories: string[];
    woods: string[];
    styles: string[];
};

// Las listas de selección múltiple (sirve para escribir una sola función toggle/clear).
export type FilterListKey = "types" | "categories" | "woods" | "styles";

export const EMPTY_FILTERS: WorkFilters = { query: "", types: [], categories: [], woods: [], styles: [] };

// --- Lectores: un solo lugar que sabe de dónde sale cada dato del trabajo -------------------

export function getWorkCategory(work: SiteWorkDto): string | null {
    return work.category?.name || null;
}

export function getWorkWood(work: SiteWorkDto): string | null {
    return work.wood?.name || null;
}

export function getWorkStyle(work: SiteWorkDto): string | null {
    return work.style || null;
}

const READERS: Record<FilterListKey, (work: SiteWorkDto) => string | null> = {
    types: getWorkTypeKey,
    categories: getWorkCategory,
    woods: getWorkWood,
    styles: getWorkStyle,
};

// --- Búsqueda de texto ----------------------------------------------------------------------

// Minúsculas y sin tildes: así "restauracion" encuentra "Restauración".
function normalizeText(text: string): string {
    return text.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

function matchesQuery(work: SiteWorkDto, query: string): boolean {
    const wanted = normalizeText(query.trim());
    if (!wanted) return true;

    const searchable = [work.title, getWorkTypeName(work), getWorkCategory(work), getWorkWood(work), work.style, work.location, work.finish]
        .filter(Boolean)
        .join(" ");

    return normalizeText(searchable).includes(wanted);
}

// --- Filtros de lista -----------------------------------------------------------------------

// Lista vacía = "sin filtro" (pasan todos). Si hay valores elegidos, el trabajo pasa si su
// valor está entre ellos.
function matchesList(work: SiteWorkDto, key: FilterListKey, selected: string[]): boolean {
    if (selected.length === 0) return true;
    const value = READERS[key](work);
    return value !== null && selected.includes(value);
}

// Aplica TODOS los filtros. `ignore` permite saltarse una lista: sirve para los conteos (ej.
// el número de cada categoría se calcula con la búsqueda, la madera y el estilo, pero sin el
// filtro de categoría, para que se vea cuántos habría si la marcas).
export function filterWorks(works: SiteWorkDto[], filters: WorkFilters, ignore?: FilterListKey): SiteWorkDto[] {
    return works.filter(
        (work) =>
            matchesQuery(work, filters.query) &&
            (ignore === "types" || matchesList(work, "types", filters.types)) &&
            (ignore === "categories" || matchesList(work, "categories", filters.categories)) &&
            (ignore === "woods" || matchesList(work, "woods", filters.woods)) &&
            (ignore === "styles" || matchesList(work, "styles", filters.styles))
    );
}

// --- Opciones y conteos ---------------------------------------------------------------------

// Valores distintos de una lista (ej. todas las maderas usadas), en el orden en que aparecen
// (los trabajos ya vienen ordenados por el backend).
export function getOptions(works: SiteWorkDto[], key: FilterListKey): string[] {
    const values: string[] = [];
    for (const work of works) {
        const value = READERS[key](work);
        if (value && !values.includes(value)) values.push(value);
    }
    return values;
}

export function countWorksWith(works: SiteWorkDto[], key: FilterListKey, value: string): number {
    return works.filter((work) => READERS[key](work) === value).length;
}

// Nombre para mostrar de una clave de tipo ("restoration" → "Restauración"), sacado del
// primer trabajo con ese tipo. Si ninguno lo tiene, se muestra la clave tal cual.
export function getTypeLabel(works: SiteWorkDto[], key: string): string {
    const work = works.find((w) => getWorkTypeKey(w) === key);
    return (work && getWorkTypeName(work)) || key;
}

// "1 trabajo" / "3 trabajos".
export function worksLabel(count: number): string {
    return `${count} ${count === 1 ? "trabajo" : "trabajos"}`;
}
