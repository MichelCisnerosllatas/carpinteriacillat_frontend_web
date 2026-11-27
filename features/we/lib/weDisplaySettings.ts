// features/we/lib/weDisplaySettings.ts
//
// "Apariencia" de las secciones de la página Nosotros (/we). Cada función lee las claves de UN
// tipo de sección y devuelve un objeto simple que el componente usa para decidir qué pinta.
// Catálogos de claves en el backend (config/section_display/):
//   text_media.php       → getAboutSettings    (WeSection2: "Quiénes somos")
//   value_grid.php       → getValuesSettings   (WeValuesSection: Misión, Visión y Valores)
//   team_grid.php        → getTeamSettings     (WeTeamSection: Equipo)
//   history_carousel.php → getHistorySettings  (WeHistorySection: Historia)
// Los defaults de abajo son los mismos del catálogo y reproducen cómo se veía la web antes de
// que existiera la Apariencia (se usan si la sección o la clave no vienen).
// Funciones puras (sin React).

import {
    getDisplayBool,
    getDisplayNumber,
    getDisplayOption,
    getDisplayText,
    type DisplaySettingsSource,
} from "@/shared/services/site_service/lib/displaySettings";

// Lado (en escritorio) donde va la foto o el carrusel. En celular siempre va arriba.
export const SIDE_OPTIONS = ["left", "right"] as const;
export type Side = (typeof SIDE_OPTIONS)[number];

// Rango permitido para la velocidad de los carruseles (milisegundos entre foto y foto).
const AUTOPLAY_MIN_MS = 2000;
const AUTOPLAY_MAX_MS = 10000;

// ─── "Quiénes somos" (text_media) ────────────────────────────────────────────

export type AboutSettings = {
    showContent: boolean; // párrafos de texto
    galleryPosition: Side; // lado del carrusel de fotos
    autoplay: boolean; // las fotos pasan solas
    autoplayMs: number;
    showArrows: boolean;
    showDots: boolean;
    showCaption: boolean; // título y descripción sobre cada foto
    linkLabel: string; // texto del enlace si la foto no trae el suyo
};

export function getAboutSettings(section: DisplaySettingsSource): AboutSettings {
    return {
        showContent: getDisplayBool(section, "text.show_content", true),
        // Antes de la Apariencia el carrusel iba a la DERECHA en escritorio.
        galleryPosition: getDisplayOption(section, "gallery.position", SIDE_OPTIONS, "right"),
        autoplay: getDisplayBool(section, "gallery.autoplay", true),
        // Antes de la Apariencia pasaba cada 2500 ms.
        autoplayMs: getDisplayNumber(section, "gallery.autoplay_ms", 2500, AUTOPLAY_MIN_MS, AUTOPLAY_MAX_MS),
        showArrows: getDisplayBool(section, "gallery.show_arrows", true),
        showDots: getDisplayBool(section, "gallery.show_dots", true),
        showCaption: getDisplayBool(section, "gallery.show_caption", true),
        linkLabel: getDisplayText(section, "gallery.link_label", "Ver más"),
    };
}

// ─── Misión, Visión y Valores (value_grid) ───────────────────────────────────

export type ValuesSettings = {
    showMissionVision: boolean;
    showMissionVisionIcons: boolean;
    showValues: boolean;
    showValuesIcons: boolean;
};

export function getValuesSettings(section: DisplaySettingsSource): ValuesSettings {
    return {
        showMissionVision: getDisplayBool(section, "missionvision.show", true),
        showMissionVisionIcons: getDisplayBool(section, "missionvision.show_icons", true),
        showValues: getDisplayBool(section, "values.show", true),
        showValuesIcons: getDisplayBool(section, "values.show_icons", true),
    };
}

// ─── Equipo (team_grid) ──────────────────────────────────────────────────────

export type TeamSettings = {
    showPhoto: boolean;
    photoPosition: Side;
    showDisciplines: boolean;
    showDisciplineIcons: boolean;
};

export function getTeamSettings(section: DisplaySettingsSource): TeamSettings {
    return {
        showPhoto: getDisplayBool(section, "photo.show", true),
        // Antes de la Apariencia la foto iba a la IZQUIERDA en escritorio.
        photoPosition: getDisplayOption(section, "photo.position", SIDE_OPTIONS, "left"),
        showDisciplines: getDisplayBool(section, "disciplines.show", true),
        showDisciplineIcons: getDisplayBool(section, "disciplines.show_icons", true),
    };
}

// ─── Historia (history_carousel) ─────────────────────────────────────────────

export type HistorySettings = {
    showStep: boolean; // «2010» / «Etapa 1» de cada hito
    stepPrefix: string; // texto si la foto no tiene «Año o etapa» (→ «Etapa 1»)
    showLink: boolean;
    linkLabel: string; // texto del enlace si la foto no trae el suyo
    autoplay: boolean;
    autoplayMs: number;
    showArrows: boolean;
};

export function getHistorySettings(section: DisplaySettingsSource): HistorySettings {
    return {
        showStep: getDisplayBool(section, "slide.show_step", true),
        stepPrefix: getDisplayText(section, "slide.step_prefix", "Etapa"),
        showLink: getDisplayBool(section, "slide.show_link", true),
        linkLabel: getDisplayText(section, "slide.link_label", "Ver más"),
        autoplay: getDisplayBool(section, "nav.autoplay", true),
        // Antes de la Apariencia pasaba cada 3000 ms.
        autoplayMs: getDisplayNumber(section, "nav.autoplay_ms", 3000, AUTOPLAY_MIN_MS, AUTOPLAY_MAX_MS),
        showArrows: getDisplayBool(section, "nav.show_arrows", true),
    };
}
