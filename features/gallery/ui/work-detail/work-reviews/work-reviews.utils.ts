// features/gallery/ui/work-detail/work-reviews/work-reviews.utils.ts
//
// Cálculos de los comentarios de un trabajo (promedio y cuántos hay de cada estrella).
import { formatRating } from "@/features/gallery/lib/formatRating";
import type { SiteWorkDto, SiteWorkTestimonyDto } from "@/shared/services/site_service/model/siteget.dto";

// Calificaciones válidas (1 a 5) de los comentarios.
function validRatings(testimonies: SiteWorkTestimonyDto[]): number[] {
    return testimonies.map((t) => Number(t.rating)).filter((r) => r > 0);
}

// Promedio como número (para pintar las estrellas). Usa rating_avg del backend si viene;
// si no, lo calcula con las calificaciones que haya. 0 si no hay ninguna.
export function averageRatingValue(work: SiteWorkDto, testimonies: SiteWorkTestimonyDto[]): number {
    const fromBackend = Number(work.rating_avg);
    if (Number.isFinite(fromBackend) && fromBackend > 0) return fromBackend;

    const ratings = validRatings(testimonies);
    if (ratings.length === 0) return 0;
    return ratings.reduce((sum, r) => sum + r, 0) / ratings.length;
}

// Promedio como texto: 4.7 -> "4,7". null si no hay calificaciones.
export function averageRatingLabel(work: SiteWorkDto, testimonies: SiteWorkTestimonyDto[]): string | null {
    return formatRating(averageRatingValue(work, testimonies));
}

// Cuántos comentarios hay de cada estrella: { 5: 3, 4: 1, 3: 0, 2: 0, 1: 0 }.
export function ratingCounts(testimonies: SiteWorkTestimonyDto[]): Record<number, number> {
    const counts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    for (const rating of validRatings(testimonies)) {
        const star = Math.max(1, Math.min(5, Math.round(rating)));
        counts[star] += 1;
    }
    return counts;
}

// 4 -> "★★★★☆"
export function starsText(rating: number): string {
    const full = Math.max(0, Math.min(5, Math.round(rating)));
    return "★".repeat(full) + "☆".repeat(5 - full);
}

// 1 -> "1 comentario", 3 -> "3 comentarios"
export function commentsLabel(count: number): string {
    return `${count} ${count === 1 ? "comentario" : "comentarios"}`;
}
