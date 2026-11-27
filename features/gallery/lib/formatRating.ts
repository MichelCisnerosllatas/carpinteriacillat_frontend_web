// features/gallery/lib/formatRating.ts
//
// 4.7 -> "4,7" (coma decimal, como se escribe en Perú). null si no hay calificación.

export function formatRating(value: number | string | null | undefined): string | null {
    if (value === null || value === undefined || value === "") return null;

    const rating = Number(value);
    if (!Number.isFinite(rating) || rating <= 0) return null;

    return rating.toFixed(1).replace(".", ",");
}
