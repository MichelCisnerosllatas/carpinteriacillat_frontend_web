// shared/lib/previewAnchor.ts
//
// El mismo criterio que SectionRenderer.tsx usa para anclar la sección completa
// (`section-${id_section}`, ver preview.bridge.ts) pero un nivel más abajo: el id ancla de cada
// botón/imagen/item/testimonio de una sección, así el preview del intranet puede hacer scroll
// exacto a lo que se está editando (no solo al inicio de la sección entera). preview.resolve.ts
// arma este mismo id a partir del PreviewPayload, preview.bridge.ts lo busca en el DOM — si
// algún componente de sección pinta una lista de botones/imágenes/items/testimonios, le pone
// este id+estilo al elemento que representa cada uno.

export type PreviewAnchorKind = "section-button" | "section-image" | "section-item" | "testimony";

export function previewAnchorId(kind: PreviewAnchorKind, id: number | null | undefined): string | undefined {
  return id != null ? `${kind}-${id}` : undefined;
}

// scrollMarginTop: misma variable que ya publica Header.tsx para el offset del header fijo, así
// el scroll no deja el elemento tapado detrás de él.
export const PREVIEW_ANCHOR_STYLE = { scrollMarginTop: "var(--app-header-height, 0px)" } as const;
