// features/service/lib/buildCategoryCards.ts
//
// Arma las tarjetas del carrusel 3D "Muebles a medida" (sección category_coverflow).
//
// Las tarjetas son EXACTAMENTE los items visibles de tipo "category" de la sección, en su
// orden (se administran en el intranet: pestaña Categorías de la sección, o con el check
// "Mostrar en la web" del formulario de Categoría). Ver buildItemCategoryCards.ts.
//
// Antes, si no había items, las tarjetas se calculaban solas desde los trabajos. Se quitó a
// propósito: la API solo manda los items VISIBLES, así que si el administrador ocultaba
// todas las categorías, la web no podía distinguirlo de "no hay items" y volvía a mostrarlas
// todas. Ahora, sin items visibles, la sección muestra solo su título y texto.

import type { SiteSectionDto, SiteWorkDto } from "@/shared/services/site_service/model/siteget.dto";
import { normalizeImages, normalizeItems } from "@/shared/services/site_service/lib/normalizeSectionContent";
import { buildItemCategoryCards, isCategoryItem } from "./buildItemCategoryCards";
import type { CategoryCard } from "./categoryCard";

export type { CategoryCard } from "./categoryCard";

export function buildCategoryCards(section: SiteSectionDto, works: SiteWorkDto[]): CategoryCard[] {
    // Solo visibles y ordenados por `order`.
    const categoryItems = normalizeItems(section.items ?? []).filter(isCategoryItem);
    if (categoryItems.length === 0) return [];

    const images = normalizeImages(section.images ?? []);
    return buildItemCategoryCards(categoryItems, images, works);
}
