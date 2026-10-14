// shared/ui/photo-lightbox/toLightboxSlides.ts
//
// Convierte las fotos del rediseño (Photo) al formato que pide PhotoLightbox.

import type { Photo } from "@/shared/lib/photo";
import type { LightboxSlide } from "./PhotoLightbox";

export function toLightboxSlides(photos: Photo[]): LightboxSlide[] {
    return photos.map((photo) => ({
        src: photo.url,
        alt: photo.alt,
        title: photo.caption || undefined,
    }));
}
