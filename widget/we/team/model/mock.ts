export type Discipline = {
    label: string;
    icon: string;
};

export const defaultDisciplines: Discipline[] = [
    { label: "Carpintería", icon: "fa-solid fa-hammer" },
    { label: "Ebanistería", icon: "fa-solid fa-ruler-combined" },
    { label: "Acabados", icon: "fa-solid fa-paint-roller" },
    { label: "Instalación", icon: "fa-solid fa-screwdriver-wrench" },
];
