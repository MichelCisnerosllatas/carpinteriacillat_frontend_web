import type { HeroStat, Slide } from "./types";

export const heroSlides: Slide[] = [
    {
        src: "https://demo.carpinteriacillat.com/storage/imgsistema/imgmuestra/fotocillat3.jpg",
        alt: "Cocina",
    },
    {
        src: "https://demo.carpinteriacillat.com/storage/imgsistema/imgmuestra/fotocillat1.jpg",
        alt: "Dormitorio",
    },
    {
        src: "https://demo.carpinteriacillat.com/storage/imgsistema/imgmuestra/fotocillat4.jpg",
        alt: "Oficina",
    },
];

export const heroStats: HeroStat[] = [
    { target: 15, suffix: "+", label: "Años Experiencia" },
    { target: 500, suffix: "+", label: "Proyectos" },
    { target: 98, suffix: "%", label: "Satisfacción" },
];
