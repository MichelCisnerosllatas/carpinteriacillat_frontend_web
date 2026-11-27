// features/gallery/lib/formatPrice.ts
//
// 6800 -> "S/ 6 800" (soles, con espacio entre miles como en el diseño). Se aceptan también
// strings porque Laravel suele mandar los decimales como texto ("6800.00").
// Devuelve null si no hay precio, para que quien lo use simplemente no lo muestre.

export function formatPrice(value: number | string | null | undefined): string | null {
    if (value === null || value === undefined || value === "") return null;

    const amount = Math.round(Number(value));
    if (!Number.isFinite(amount) || amount <= 0) return null;

    // Inserta un espacio cada 3 cifras contando desde la derecha.
    const withSpaces = String(amount).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    return `S/ ${withSpaces}`;
}
