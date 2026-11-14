// app/preview/page.tsx
//
// Ruta exclusiva para el iframe de vista previa del intranet — nunca la visita un usuario real
// (no está linkeada desde ningún lado del sitio público). No recibe query params: arranca
// mostrando el Home y usePreviewBridge() decide, apenas llega el primer mensaje del intranet, a
// qué página cambiar (ver preview.bridge.ts / preview.routes.ts) — así ningún formulario del
// intranet necesita saber a qué navigation_url pertenece lo que está editando, alcanza con
// mandar la clave que ya tiene a mano.
// Si la URL activa es el detalle de un trabajo ("/gallery/<id>"), monta PreviewWorkDetail.
"use client";

import { usePreviewBridge } from "@/shared/store/preview/preview.bridge";
import { PREVIEW_PAGES, PREVIEW_DEFAULT_URL, PreviewWorkDetail, parseWorkDetailUrl } from "@/shared/store/preview/preview.routes";

export default function PreviewPage() {
  const { activeNavigationUrl } = usePreviewBridge();

  const idWebWork = parseWorkDetailUrl(activeNavigationUrl);
  if (idWebWork !== null) return <PreviewWorkDetail idWebWork={idWebWork} />;

  const Page = PREVIEW_PAGES[activeNavigationUrl] ?? PREVIEW_PAGES[PREVIEW_DEFAULT_URL];
  return <Page />;
}
