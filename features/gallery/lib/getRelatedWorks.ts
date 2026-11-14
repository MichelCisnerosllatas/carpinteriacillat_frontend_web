// features/gallery/lib/getRelatedWorks.ts
//
// "Otros trabajos que le pueden gustar" del detalle, en tres grupos (cada uno en el orden de
// la galería):
//   1) mismo tipo (Fabricación / Restauración) Y mismo estilo o categoría;
//   2) mismo estilo o categoría, aunque sea de otro tipo;
//   3) el resto (primero los del mismo tipo).
// Máximo `max` (8 por defecto; Apariencia related.max). Se muestran en una fila con scroll
// horizontal, ver RelatedWorks.tsx.

import type { SiteWorkDto } from "@/shared/services/site_service/model/siteget.dto";
import { getWorkTypeKey } from "@/shared/services/site_service/lib/workTypes";

const MAX_RELATED = 8;

export function getRelatedWorks(work: SiteWorkDto, works: SiteWorkDto[], max = MAX_RELATED): SiteWorkDto[] {
    const others = works.filter((w) => w.id_web_work !== work.id_web_work);
    const typeKey = getWorkTypeKey(work);

    const isSimilar = (w: SiteWorkDto) =>
        Boolean((work.style && w.style === work.style) || (work.category?.name && w.category?.name === work.category.name));
    const isSameType = (w: SiteWorkDto) => typeKey !== null && getWorkTypeKey(w) === typeKey;

    // sort es estable: dentro de cada grupo se respeta el orden de la galería.
    const rank = (w: SiteWorkDto) => (isSimilar(w) ? (isSameType(w) ? 0 : 1) : isSameType(w) ? 2 : 3);
    return [...others].sort((a, b) => rank(a) - rank(b)).slice(0, Math.max(0, max));
}
