// features/service/lib/buildRestorationCards.ts
//
// Arma las tarjetas del comparador "Restauración de muebles" (sección restoration_compare).
//
// - Las tarjetas son los TRABAJOS del portafolio (site.works) de tipo "restoration" que tengan
//   al menos un par Antes/Después válido (con URL en las dos fotos), en el orden de works
//   (el backend ya los manda ordenados por webwork_order). Se administran en el intranet,
//   en Portafolio → Trabajos.
// - La sección YA NO usa sus items ni sus imágenes para esto (no hay items "restoration", ni
//   imágenes con variant before/after, ni fotos automáticas): sus items/imágenes se ignoran.
// - Cada tarjeta lleva TODOS sus pares válidos (el comparador permite elegir el par).
// - El botón "Ver la restauración completa" va siempre a /gallery/<id_web_work>: todo trabajo
//   que llega en works está publicado, así que su página existe.
// - Sin trabajos que cumplan → sin tarjetas (la sección muestra solo sus textos).
//
// Función pura (sin React).

import type { SiteSectionDto, SiteWorkDto } from "@/shared/services/site_service/model/siteget.dto";
import { getDisplayBool, getDisplayText, type DisplaySettingsSource } from "@/shared/services/site_service/lib/displaySettings";
import { getWorkPairs, getWorkTitle, type WorkPair } from "@/shared/services/site_service/lib/workPhotos";
import { WORK_TYPE_RESTORATION, getWorkTypeKey } from "@/shared/services/site_service/lib/workTypes";

export type RestorationCard = {
    // Clave única de la tarjeta (para el `key` de React).
    key: string;
    // id_web_work, para el botón "Ver la restauración completa" (/gallery/<id>).
    idWebWork: number;
    title: string;
    // Pares Antes/Después del trabajo (al menos 1), en su orden.
    pairs: WorkPair[];
};

// Claves de la Apariencia de esta sección (catálogo del backend:
// config/section_display/restoration_compare.php, grupo "compare").
export const RESTORATION_DISPLAY_KEYS = {
    thumbs: "compare.show_thumbs", // miniaturas para elegir el trabajo
    labels: "compare.show_labels", // etiquetas «Antes» / «Después»
    hint: "compare.show_hint", // ayuda «Toque y arrastre para comparar»
    autoSweep: "compare.auto_sweep", // barrido automático al aparecer
    expand: "compare.show_expand", // botón «ver foto en grande»
    pairNav: "compare.show_pair_nav", // selector de pares (si un trabajo tiene varios)
    detailButton: "compare.show_detail_button", // botón «Ver la restauración completa»
    detailButtonLabel: "compare.detail_button_label", // texto de ese botón
} as const;

// Apariencia ya resuelta (con los defaults del catálogo: todo visible).
export type RestorationDisplay = {
    showThumbs: boolean;
    showLabels: boolean;
    showHint: boolean;
    autoSweep: boolean;
    showExpand: boolean;
    showPairNav: boolean;
    showDetailButton: boolean;
    detailButtonLabel: string;
};

export function getRestorationDisplay(section: DisplaySettingsSource): RestorationDisplay {
    const K = RESTORATION_DISPLAY_KEYS;
    return {
        showThumbs: getDisplayBool(section, K.thumbs),
        showLabels: getDisplayBool(section, K.labels),
        showHint: getDisplayBool(section, K.hint),
        autoSweep: getDisplayBool(section, K.autoSweep),
        showExpand: getDisplayBool(section, K.expand),
        showPairNav: getDisplayBool(section, K.pairNav),
        showDetailButton: getDisplayBool(section, K.detailButton),
        detailButtonLabel: getDisplayText(section, K.detailButtonLabel, "Ver la restauración completa"),
    };
}

// `section` se recibe para mantener la misma firma que las demás secciones calculadas
// (buildCategoryCards); hoy las tarjetas salen solo de los trabajos.
export function buildRestorationCards(_section: SiteSectionDto, works: SiteWorkDto[]): RestorationCard[] {
    const cards: RestorationCard[] = [];

    for (const work of works) {
        if (getWorkTypeKey(work) !== WORK_TYPE_RESTORATION) continue;

        const pairs = getWorkPairs(work);
        // Sin pares válidos no hay nada que comparar.
        if (pairs.length === 0) continue;

        cards.push({
            key: `work-${work.id_web_work}`,
            idWebWork: work.id_web_work,
            title: getWorkTitle(work),
            pairs,
        });
    }

    return cards;
}
