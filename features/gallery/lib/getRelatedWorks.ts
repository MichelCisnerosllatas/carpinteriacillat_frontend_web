// features/gallery/lib/getRelatedWorks.ts
//
// "Otros trabajos que le pueden gustar" del detalle: primero los del mismo estilo o la misma
// categoría; si no alcanzan, se completa con el resto (en el orden de la galería). Máximo 8
// (se muestran en una fila con scroll horizontal, ver RelatedWorks.tsx).

import type { SiteWorkDto } from "@/shared/services/site_service/model/siteget.dto";

const MAX_RELATED = 8;

export function getRelatedWorks(work: SiteWorkDto, works: SiteWorkDto[]): SiteWorkDto[] {
    const others = works.filter((w) => w.id_furniture !== work.id_furniture);

    const similar = others.filter(
        (w) =>
            (work.style && w.style === work.style) ||
            (work.category?.name && w.category?.name === work.category.name)
    );
    const rest = others.filter((w) => !similar.includes(w));

    return [...similar, ...rest].slice(0, MAX_RELATED);
}
