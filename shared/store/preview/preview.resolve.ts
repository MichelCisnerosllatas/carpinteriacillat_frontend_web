// shared/store/preview/preview.resolve.ts
//
// Responde UNA pregunta por función: "dado el árbol que ya está cargado en useSiteStore y un
// PreviewPayload del intranet, ¿qué nodo hay que reemplazar/insertar, y dónde?". No sabe nada
// de postMessage ni de React — eso vive en preview.bridge.ts, que es quien llama a estas
// funciones y aplica el resultado al store.
//
// Principio del "splice": nunca se reconstruye el árbol entero. Se busca el nodo padre por la
// clave que trajo el intranet (id_navigation / id_section / id_section_item), se clona SOLO la
// rama que cambia, y todo lo demás (otras secciones, otros botones, otras imágenes...) se deja
// exactamente como ya estaba cargado desde el getSite() real.

import type {
  SiteDataDto,
  SiteFooterSettingsDto,
  SiteNavigationDto,
  SiteSectionDto,
  SiteSectionButtonDto,
  SiteSectionImageDto,
  SiteSectionItemDto,
  SiteSectionItemDetailDto,
  SiteTestimonyDto,
} from "@/shared/services/site_service/model/siteget.dto";
import type { PreviewPayload } from "./preview.types";
import { previewAnchorId, type PreviewAnchorKind } from "@/shared/lib/previewAnchor";

// Id temporal para un registro que el intranet todavía no guardó (sin id real). Negativo a
// propósito: nunca puede chocar con un id real de la base de datos.
const TEMP_ID = -1;

export type PreviewResolution =
  | { kind: "navigations"; navigations: SiteNavigationDto[] }
  // `scrollToChildId` es el id ancla (ver shared/lib/previewAnchor.ts) del botón/imagen/
  // item/testimonio puntual que se está editando, cuando lo hay — el bridge intenta llegar
  // ahí primero y solo cae a `scrollToSectionId` (el inicio de la sección entera) si ese
  // elemento no existe en el DOM (ver preview.bridge.ts).
  | { kind: "sections"; idNavigation: number; sections: SiteSectionDto[]; scrollToSectionId: number; scrollToChildId?: string }
  | { kind: "footer"; footerSettings: SiteFooterSettingsDto }
  | null; // no se encontró dónde aplicar el cambio (ver notas de cada rama abajo)

export function resolvePreviewPayload(site: SiteDataDto, payload: PreviewPayload): PreviewResolution {
  switch (payload.entity) {
    case "navigation":
      return resolveNavigation(site, payload);
    case "section":
      return resolveSection(site, payload);
    case "section_button":
      return resolveSectionChild(site, payload, "buttons", buildButton);
    case "section_image":
      return resolveSectionChild(site, payload, "images", buildImage);
    case "section_item":
      return resolveSectionChild(site, payload, "items", buildItem);
    case "testimony":
      return resolveSectionChild(site, payload, "testimonies", buildTestimony);
    case "section_item_detail":
      return resolveItemDetail(site, payload);
    case "footer":
      return { kind: "footer", footerSettings: { ...site.footer_settings, ...(payload.fields as Partial<SiteFooterSettingsDto>) } };
  }
}

// ─── navigation ──────────────────────────────────────────────────────────────

function resolveNavigation(site: SiteDataDto, payload: PreviewPayload): PreviewResolution {
  const existing = payload.id != null ? site.navigations.find((n) => n.id_navigation === payload.id) : undefined;
  const merged: SiteNavigationDto = {
    id_navigation: payload.id ?? TEMP_ID,
    navigation_name: "",
    navigation_description: null,
    navigation_url: "",
    navigation_order: 9999,
    navigation_state: true,
    sections: existing?.sections ?? [],
    ...existing,
    ...(payload.fields as Partial<SiteNavigationDto>),
  };

  const navigations = existing
    ? site.navigations.map((n) => (n.id_navigation === existing.id_navigation ? merged : n))
    : [...site.navigations, merged];

  return { kind: "navigations", navigations };
}

// ─── section ─────────────────────────────────────────────────────────────────

function resolveSection(site: SiteDataDto, payload: PreviewPayload): PreviewResolution {
  if (payload.id_navigation == null) return null;
  const navigation = site.navigations.find((n) => n.id_navigation === payload.id_navigation);
  if (!navigation) return null; // navegación aún no guardada — nada que enlazar todavía

  const existing = payload.id != null ? navigation.sections.find((s) => s.id_section === payload.id) : undefined;
  const fields = payload.fields as Partial<SiteSectionDto>;
  const merged: SiteSectionDto = {
    id_section: payload.id ?? TEMP_ID,
    id_type_section: 0,
    section_type: resolveSectionType(site, payload, existing),
    section_key: "",
    section_name: "",
    section_title: null,
    section_subtitle: null,
    section_description: null,
    section_content: null,
    section_variant: null,
    section_order: 9999,
    section_state: true,
    buttons: existing?.buttons ?? [],
    items: existing?.items ?? [],
    images: existing?.images ?? [],
    testimonies: existing?.testimonies ?? [],
    testimony_settings: existing?.testimony_settings ?? null,
    ...existing,
    ...fields,
    // "Elementos de las tarjetas": si el intranet manda fields.card_settings, se mezcla con lo
    // ya cargado (así una clave que no venga en el formulario conserva su valor).
    card_settings: { ...existing?.card_settings, ...fields.card_settings },
  };

  const sections = existing
    ? navigation.sections.map((s) => (s.id_section === existing.id_section ? merged : s))
    : [...navigation.sections, merged];

  return { kind: "sections", idNavigation: navigation.id_navigation, sections, scrollToSectionId: merged.id_section };
}

// `section_type` (ej. "hero", "testimonial_carousel") no lo manda el intranet — el form de
// Sección solo conoce `id_type_section` (un id numérico, vía su TypeSectionSelect). Como el
// árbol ya cargado trae MUCHAS secciones, cada una con su propio `id_type_section`, alcanza con
// buscar cualquier otra sección que ya use ese mismo tipo y copiarle el `section_type` — dos
// secciones del mismo tipo SIEMPRE comparten `section_type` (ver el comentario de
// SectionRenderer.tsx). Si de verdad no hay ninguna todavía (tipo recién creado, cero
// secciones usándolo aún), no hay forma de saber qué componente le toca — se deja el tipo ya
// cargado (si se está editando una existente) o "" (SectionRenderer lo ignora con un warning,
// no rompe nada).
function resolveSectionType(site: SiteDataDto, payload: PreviewPayload, existing: SiteSectionDto | undefined): string {
  const idTypeSection = (payload.fields as { id_type_section?: number }).id_type_section;
  if (idTypeSection == null) return existing?.section_type ?? "";

  for (const nav of site.navigations) {
    const match = nav.sections.find((s) => s.id_type_section === idTypeSection);
    if (match) return match.section_type;
  }
  return existing?.section_type ?? "";
}

// ─── section_button / section_image / section_item / testimony ──────────────

type ChildKey = "buttons" | "images" | "items" | "testimonies";
type ChildOf<K extends ChildKey> = SiteSectionDto[K][number];

const CHILD_ANCHOR_KIND: Record<ChildKey, PreviewAnchorKind> = {
  buttons: "section-button",
  images: "section-image",
  items: "section-item",
  testimonies: "testimony",
};

function resolveSectionChild<K extends ChildKey>(
  site: SiteDataDto,
  payload: PreviewPayload,
  key: K,
  build: (existing: ChildOf<K> | undefined, fields: Record<string, unknown>, tempId: number) => ChildOf<K>
): PreviewResolution {
  if (payload.id_section == null) return null;
  const found = findSectionById(site, payload.id_section);
  if (!found) return null; // la sección padre todavía no existe en el árbol cargado (ej. también sin guardar)

  const { navigation, section } = found;
  const list = section[key] as ChildOf<K>[];
  const existing = payload.id != null ? list.find((item) => getChildId(item) === payload.id) : undefined;
  const merged = build(existing, payload.fields, TEMP_ID);
  const mergedId = getChildId(merged);

  const updatedList = existing ? list.map((item) => (getChildId(item) === mergedId ? merged : item)) : [...list, merged];

  const updatedSection: SiteSectionDto = { ...section, [key]: updatedList };
  const sections = navigation.sections.map((s) => (s.id_section === section.id_section ? updatedSection : s));

  return {
    kind: "sections",
    idNavigation: navigation.id_navigation,
    sections,
    scrollToSectionId: section.id_section,
    scrollToChildId: previewAnchorId(CHILD_ANCHOR_KIND[key], mergedId),
  };
}

function getChildId(item: Record<string, unknown>): number {
  // Cada DTO hijo usa su propia clave de id ("id_section_button", "id_section_image", ...) —
  // esto evita tener que pasar la clave como parámetro en cada llamada de arriba.
  const idKey = Object.keys(item).find((k) => k.startsWith("id_section_") || k === "id_testimony_web");
  return idKey ? (item[idKey] as number) : (item.id as number);
}

function buildButton(existing: SiteSectionButtonDto | undefined, fields: Record<string, unknown>, tempId: number): SiteSectionButtonDto {
  return {
    id_section_button: tempId,
    label: "",
    url: null,
    icon: null,
    variant: null,
    action_key: null,
    order: 9999,
    state: true,
    ...existing,
    ...(fields as Partial<SiteSectionButtonDto>),
  };
}

function buildImage(existing: SiteSectionImageDto | undefined, fields: Record<string, unknown>, tempId: number): SiteSectionImageDto {
  return {
    id_section_image: tempId,
    id_image: 0,
    name: null,
    url: "",
    alt: null,
    title: null,
    description: null,
    label: null,
    link: null,
    link_label: null,
    variant: null,
    fix: null,
    // Foto nueva sin item asignado; si el intranet manda `id_section_item` en fields, lo pisa abajo.
    id_section_item: null,
    order: 9999,
    state: true,
    ...existing,
    ...(fields as Partial<SiteSectionImageDto>),
  };
}

function buildItem(existing: SiteSectionItemDto | undefined, fields: Record<string, unknown>, tempId: number): SiteSectionItemDto {
  return {
    id_section_item: tempId,
    item_type: null,
    key: null,
    title: null,
    subtitle: null,
    description: null,
    label: null,
    value: null,
    suffix: null,
    icon: null,
    link: null,
    rating: null,
    variant: null,
    latitude: null,
    longitude: null,
    order: 9999,
    state: true,
    details: existing?.details ?? [],
    ...existing,
    ...(fields as Partial<SiteSectionItemDto>),
  };
}

function buildTestimony(existing: SiteTestimonyDto | undefined, fields: Record<string, unknown>, tempId: number): SiteTestimonyDto {
  return {
    id_testimony_web: tempId,
    name: "",
    role: null,
    city: null,
    email: null,
    rating: null,
    message: "",
    photo_url: null,
    is_delivered: true,
    is_verified: true,
    order: 9999,
    state: true,
    ...existing,
    ...(fields as Partial<SiteTestimonyDto>),
  };
}

// ─── section_item_detail ──────────────────────────────────────────────────────

function resolveItemDetail(site: SiteDataDto, payload: PreviewPayload): PreviewResolution {
  if (payload.id_section_item == null) return null;
  const found = findItemById(site, payload.id_section_item);
  if (!found) return null; // el item padre (siempre debería existir, ver landing-preview.routes.ts) no está cargado

  const { navigation, section, item } = found;
  const existing = payload.id != null ? item.details.find((d) => d.id_section_item_detail === payload.id) : undefined;
  const merged: SiteSectionItemDetailDto = {
    id_section_item_detail: payload.id ?? TEMP_ID,
    title: null,
    description: null,
    order: 9999,
    state: true,
    ...existing,
    ...(payload.fields as Partial<SiteSectionItemDetailDto>),
  };

  const updatedDetails = existing
    ? item.details.map((d) => (d.id_section_item_detail === existing.id_section_item_detail ? merged : d))
    : [...item.details, merged];

  const updatedItem: SiteSectionItemDto = { ...item, details: updatedDetails };
  const updatedItems = section.items.map((i) => (i.id_section_item === item.id_section_item ? updatedItem : i));
  const updatedSection: SiteSectionDto = { ...section, items: updatedItems };
  const sections = navigation.sections.map((s) => (s.id_section === section.id_section ? updatedSection : s));

  // No hay ancla visual propia por detalle (se pinta como sub-lista dentro de la propia
  // tarjeta del item, ver ServiceCategoryGrid.tsx) — apunta al item que lo contiene, ya es
  // mucho más preciso que caer a toda la sección.
  return {
    kind: "sections",
    idNavigation: navigation.id_navigation,
    sections,
    scrollToSectionId: section.id_section,
    scrollToChildId: previewAnchorId("section-item", item.id_section_item),
  };
}

// ─── búsquedas en el árbol ────────────────────────────────────────────────────

function findSectionById(site: SiteDataDto, idSection: number): { navigation: SiteNavigationDto; section: SiteSectionDto } | null {
  for (const navigation of site.navigations) {
    const section = navigation.sections.find((s) => s.id_section === idSection);
    if (section) return { navigation, section };
  }
  return null;
}

function findItemById(
  site: SiteDataDto,
  idSectionItem: number
): { navigation: SiteNavigationDto; section: SiteSectionDto; item: SiteSectionItemDto } | null {
  for (const navigation of site.navigations) {
    for (const section of navigation.sections) {
      const item = section.items.find((i) => i.id_section_item === idSectionItem);
      if (item) return { navigation, section, item };
    }
  }
  return null;
}
