// shared/services/site_service/lib/workTypes.ts
//
// Tipos de trabajo del portafolio (type_works.typework_key en el backend). Las claves son
// fijas: el seeder las crea y el intranet no deja cambiarlas, por eso el código puede
// compararlas. El NOMBRE ("Restauración") sí es editable: para mostrar se usa work.type.name.
// Viven en shared porque los usan Servicios (comparador) y Galería (filtro, badge, detalle).

import type { SiteWorkDto } from "../model/siteget.dto";

export const WORK_TYPE_MANUFACTURE = "manufacture";
export const WORK_TYPE_RESTORATION = "restoration";

// Clave del tipo del trabajo, o null si (por un backend viejo) no vino.
export function getWorkTypeKey(work: SiteWorkDto): string | null {
    return work.type?.key || null;
}

// Nombre del tipo para mostrar ("Restauración"), o null.
export function getWorkTypeName(work: SiteWorkDto): string | null {
    return work.type?.name || null;
}

export function isRestorationWork(work: SiteWorkDto): boolean {
    return getWorkTypeKey(work) === WORK_TYPE_RESTORATION;
}
