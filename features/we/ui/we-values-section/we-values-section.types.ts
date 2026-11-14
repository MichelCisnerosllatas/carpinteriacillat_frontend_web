// Color de acento de una tarjeta (sale del variant del item: "red" → rojo; otro → dorado).
export type ValueAccent = "gold" | "red";

// Un valor de la empresa (item de la sección con item_type "value").
export type CoreValue = {
    id: number;
    label: string;
    icon: string; // clase de Font Awesome; puede venir vacía
    accent: ValueAccent;
};
