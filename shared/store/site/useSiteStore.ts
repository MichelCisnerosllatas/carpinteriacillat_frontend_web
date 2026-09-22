// shared/store/site/useSiteStore.ts
//
// Guarda en el NAVEGADOR el mismo JSON que app/layout.tsx ya trajo con la
// unica llamada real a getSite() (ver shared/services/site_service/lib/
// getSite.ts). Se hidrata una sola vez desde app/providers.tsx
// (AppProviders) y de ahi en adelante cualquier pagina/componente cliente
// lee de este store en vez de volver a pedir el sitio — no hay forma de
// que este store exista en el servidor de Next (Zustand es estado de
// navegador), asi que nunca se comparte entre visitantes ni requests.

import { create } from "zustand";
import type { SiteDataDto } from "@/shared/services/site_service/model/siteget.dto";

type SiteState = {
  site: SiteDataDto | null;
  setSite: (site: SiteDataDto | null) => void;
};

export const useSiteStore = create<SiteState>((set) => ({
  site: null,
  setSite: (site) => set({ site }),
}));
