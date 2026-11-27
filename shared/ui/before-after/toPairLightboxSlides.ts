// shared/ui/before-after/toPairLightboxSlides.ts
//
// Las dos fotos de un par para el lightbox: primero "Antes", después "Después" (con el pie
// del par si tiene: "Antes · Frente"). Lo usan Servicios y el detalle de Galería.

import type { PhotoPair } from "@/shared/lib/photo";
import type { LightboxSlide } from "@/shared/ui/photo-lightbox/PhotoLightbox";

export function toPairLightboxSlides(pair: PhotoPair | undefined): LightboxSlide[] {
    if (!pair) return [];
    const suffix = pair.caption ? ` · ${pair.caption}` : "";
    return [
        { src: pair.before.url, alt: pair.before.alt, title: `Antes${suffix}` },
        { src: pair.after.url, alt: pair.after.alt, title: `Después${suffix}` },
    ];
}
