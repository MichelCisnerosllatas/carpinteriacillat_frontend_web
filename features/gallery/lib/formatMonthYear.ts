// features/gallery/lib/formatMonthYear.ts
//
// "2026-05-10" -> "mayo de 2026". Se lee el texto a mano (año y mes) en vez de usar
// new Date(): new Date("2026-05-01") se interpreta en UTC y en Perú (UTC-5) podía mostrar el
// mes anterior. Devuelve null si la fecha no viene o no se entiende.

const MONTHS = [
    "enero", "febrero", "marzo", "abril", "mayo", "junio",
    "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

export function formatMonthYear(date: string | null | undefined): string | null {
    if (!date) return null;

    const [year, month] = date.split("-");
    const monthName = MONTHS[Number(month) - 1];
    if (!year || !monthName) return null;

    return `${monthName} de ${year}`;
}
