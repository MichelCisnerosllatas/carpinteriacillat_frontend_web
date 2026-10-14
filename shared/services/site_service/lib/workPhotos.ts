// shared/services/site_service/lib/workPhotos.ts
//
// Pequeños "lectores" de un trabajo (site.works) que usan tanto Servicios como Galería.
// Viven acá (y no en features/gallery) porque las dos features los necesitan y una feature no
// debería importar de otra.

import type { SiteWorkDto, SiteWorkPhotoDto } from "../model/siteget.dto";
import type { Photo } from "@/shared/lib/photo";

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

// Primera foto con la variante pedida ("before" / "after"), o undefined si no hay.
export function findWorkPhotoByVariant(work: SiteWorkDto, variant: "before" | "after"): Photo | undefined {
    const photo = (work.photos ?? []).find((p) => p.variant === variant && p.url);
    return photo ? toWorkPhoto(photo, work) : undefined;
}

// Un trabajo es "restauración con comparador" si tiene foto de antes Y de después.
export function hasBeforeAndAfter(work: SiteWorkDto): boolean {
    return Boolean(findWorkPhotoByVariant(work, "before") && findWorkPhotoByVariant(work, "after"));
}
