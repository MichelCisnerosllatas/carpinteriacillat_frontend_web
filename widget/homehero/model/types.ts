export type Slide = {
    src: string;
    alt: string;
    // Clase Tailwind ya resuelta (ver resolveImageFit.ts). Opcional porque
    // los mocks locales de fallback no traen "fix" del backend.
    fit?: string;
};

export type HeroStat = {
    target: number;
    suffix?: string;
    label: string;
};
