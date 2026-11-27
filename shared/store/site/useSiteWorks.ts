// shared/store/site/useSiteWorks.ts
//
// Lee del store los trabajos de la galería (site.works). Si el backend todavía no manda
// "works", devuelve una lista vacía.
//
// NO_WORKS es una constante a propósito: si el selector devolviera un "[]" nuevo en cada
// render, Zustand creería que el dato cambió y volvería a renderizar sin fin.
"use client";

import { useSiteStore } from "./useSiteStore";
import type { SiteWorkDto } from "@/shared/services/site_service/model/siteget.dto";

const NO_WORKS: SiteWorkDto[] = [];

export function useSiteWorks(): SiteWorkDto[] {
    return useSiteStore((s) => s.site?.works ?? NO_WORKS);
}
