export type CoreValue = {
    label: string;
    icon: string;
    accent: "gold" | "red";
};

export const defaultCoreValues: CoreValue[] = [
    { label: "Calidad", icon: "fa-solid fa-medal", accent: "gold" },
    { label: "Compromiso", icon: "fa-solid fa-handshake", accent: "red" },
    { label: "Innovación", icon: "fa-solid fa-lightbulb", accent: "gold" },
    { label: "Confianza", icon: "fa-solid fa-shield-heart", accent: "red" },
];
