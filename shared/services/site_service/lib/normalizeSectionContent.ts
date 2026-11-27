// shared/services/site_service/lib/normalizeSectionContent.ts
//
// Mismo espiritu que normalizeNavigations.ts: son comprobaciones
// DEFENSIVAS sobre el JSON que ya devolvio getSite(). El backend de
// /v1/public/site YA filtra por "state" y YA ordena por "order" en cada
// nivel (secciones, botones, items, detalles, imagenes) — esto no
// sustituye ese filtrado, es una proteccion extra por si una respuesta
// llegara inconsistente. El frontend nunca debe inventar un orden
// editorial distinto al recibido.
//
// Se centraliza aca (en vez de repetir ".filter(...).sort(...)" en cada
// Section) para que, si un dia cambia el criterio, se cambie en un solo
// lugar — igual razon que ya se uso para navigation_service.

import type {
  SiteSectionDto,
  SiteSectionButtonDto,
  SiteSectionItemDto,
  SiteSectionItemDetailDto,
  SiteSectionImageDto,
} from "../model/siteget.dto";

export function normalizeSections(sections: SiteSectionDto[]): SiteSectionDto[] {
  return [...sections].filter((s) => s.section_state).sort((a, b) => a.section_order - b.section_order);
}

export function normalizeButtons(buttons: SiteSectionButtonDto[]): SiteSectionButtonDto[] {
  return [...buttons].filter((b) => b.state).sort((a, b) => a.order - b.order);
}

export function normalizeItems(items: SiteSectionItemDto[]): SiteSectionItemDto[] {
  return [...items].filter((i) => i.state).sort((a, b) => a.order - b.order);
}

export function normalizeDetails(details: SiteSectionItemDetailDto[]): SiteSectionItemDetailDto[] {
  return [...details].filter((d) => d.state).sort((a, b) => a.order - b.order);
}

export function normalizeImages(images: SiteSectionImageDto[]): SiteSectionImageDto[] {
  return [...images].filter((i) => i.state).sort((a, b) => a.order - b.order);
}
