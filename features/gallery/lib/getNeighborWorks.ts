// features/gallery/lib/getNeighborWorks.ts
//
// Trabajo anterior y siguiente en el orden de la galería (dando la vuelta: después del último
// viene el primero). null si no hay otro trabajo al que ir.

import type { SiteWorkDto } from "@/shared/services/site_service/model/siteget.dto";

export function getNeighborWorks(work: SiteWorkDto, works: SiteWorkDto[]) {
    const index = works.findIndex((w) => w.id_furniture === work.id_furniture);
    if (index === -1 || works.length < 2) {
        return { previous: null, next: null };
    }

    return {
        previous: works[(index - 1 + works.length) % works.length],
        next: works[(index + 1) % works.length],
    };
}
