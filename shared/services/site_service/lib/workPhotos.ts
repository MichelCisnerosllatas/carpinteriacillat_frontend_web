// shared/services/site_service/lib/workPhotos.ts
//
// Pequeños "lectores" de un trabajo (site.works) que usan tanto Servicios como Galería.
// Viven acá (y no en features/gallery) porque las dos features los necesitan y una feature no
// debería importar de otra.
//
// Un trabajo tiene dos grupos de fotos que NO se mezclan:
//   - photos: fotos de galería (la primera es la portada).
//   - pairs:  pares Antes/Después (solo restauraciones), para el comparador.

import type { SiteWorkDto, SiteWorkPairDto, SiteWorkPhotoDto } from "../model/siteget.dto";
import type { Photo, PhotoPair } from "@/shared/lib/photo";

// Un par Antes/Después listo para pintar (lo entiende shared/ui/before-after).
export type WorkPair = PhotoPair;

export function getWorkTitle(work: SiteWorkDto): string {
    return work.title || "Trabajo sin título";
}

// Convierte una foto del backend a la forma que entienden los componentes visuales.
export function toWorkPhoto(photo: SiteWorkPhotoDto, work: SiteWorkDto): Photo {
    return {
        url: photo.url,
        alt: photo.alt || photo.caption || getWorkTitle(work),
        caption: photo.caption,
    };
}

// Fotos del trabajo listas para pintar (la primera es la portada). Se descartan las que no
// tienen URL para no dibujar <img> rotas.
export function getWorkPhotos(work: SiteWorkDto): Photo[] {
    return (work.photos ?? []).filter((photo) => photo.url).map((photo) => toWorkPhoto(photo, work));
}

// Convierte un par del backend. El alt cae al pie del par o al título del trabajo.
function toWorkPair(pair: SiteWorkPairDto, index: number, work: SiteWorkDto): WorkPair {
    const label = pair.caption || getWorkTitle(work);
    return {
        key: `pair-${pair.id_web_work_pair ?? index}`,
        caption: pair.caption,
        before: { url: pair.before.url, alt: pair.before.alt || `Antes: ${label}`, caption: pair.caption },
        after: { url: pair.after.url, alt: pair.after.alt || `Después: ${label}`, caption: pair.caption },
    };
}

// Pares Antes/Después del trabajo listos para pintar (en el orden del backend). Se descartan
// los que no tienen URL en la foto de antes O en la de después: no habría nada que comparar.
export function getWorkPairs(work: SiteWorkDto): WorkPair[] {
    return (work.pairs ?? [])
        .filter((pair) => pair.before?.url && pair.after?.url)
        .map((pair, index) => toWorkPair(pair, index, work));
}

// ¿El trabajo tiene al menos un par Antes/Después válido?
export function hasWorkPairs(work: SiteWorkDto): boolean {
    return getWorkPairs(work).length > 0;
}
