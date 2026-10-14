// shared/services/site_service/lib/cardSettings.ts
//
// "Elementos de las tarjetas": el intranet puede ocultar partes de las tarjetas de una
// sección (el contador, las flechas, la ayuda, etc.). Llega en section.card_settings como
// { "<clave>": true | false }.
//
// Regla: solo se oculta lo que viene en false. Si la clave no viene (backend viejo, sección
// sin configurar), el elemento se muestra.
//
// Las claves de cada tipo de sección están en el backend (config/section_card_settings.php).
// Para agregar un elemento nuevo: se agrega allí y aquí se lee con esta función.

import type { SiteSectionDto } from "../model/siteget.dto";

export function isCardElementVisible(section: Pick<SiteSectionDto, "card_settings">, key: string): boolean {
    return section.card_settings?.[key] !== false;
}
