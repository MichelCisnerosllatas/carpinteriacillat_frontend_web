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
import type { SiteChatbotSettingsDto, SiteDataDto, SiteFooterSettingsDto, SiteNavigationDto, SiteSectionDto } from "@/shared/services/site_service/model/siteget.dto";

type SiteState = {
  site: SiteDataDto | null;
  setSite: (site: SiteDataDto | null) => void;
  // Usadas SOLO por la ruta /preview (ver shared/store/preview/preview.bridge.ts) para
  // reflejar en caliente un cambio sin guardar del intranet. Reemplazan el array entero
  // (nunca un merge parcial campo por campo) para no dejar residuos de un estado anterior.
  overrideNavigations: (navigations: SiteNavigationDto[]) => void;
  overrideNavigationSections: (idNavigation: number, sections: SiteSectionDto[]) => void;
  overrideFooterSettings: (footerSettings: SiteFooterSettingsDto) => void;
  // Igual que el footer, pero para el chatbot. Además incrementa `chatbotPreviewTick`: el
  // chatbot (features/chatbot/ui/ChatBot.tsx) escucha ese número y ABRE su panel, así el admin
  // ve el cambio sin tener que hacer clic. Se usa un contador (y no importar el store del
  // chatbot desde acá) para que shared/ no dependa de features/.
  overrideChatbotSettings: (settings: SiteChatbotSettingsDto) => void;
  chatbotPreviewTick: number;
};

export const useSiteStore = create<SiteState>((set) => ({
  site: null,
  setSite: (site) => set({ site }),
  overrideNavigations: (navigations) =>
    set((s) => (s.site ? { site: { ...s.site, navigations } } : s)),
  overrideNavigationSections: (idNavigation, sections) =>
    set((s) => {
      if (!s.site) return s;
      return {
        site: {
          ...s.site,
          navigations: s.site.navigations.map((n) =>
            n.id_navigation === idNavigation ? { ...n, sections } : n
          ),
        },
      };
    }),
  overrideFooterSettings: (footerSettings) =>
    set((s) => (s.site ? { site: { ...s.site, footer_settings: footerSettings } } : s)),
  chatbotPreviewTick: 0,
  overrideChatbotSettings: (settings) =>
    set((s) =>
      s.site
        ? {
            site: { ...s.site, chatbot: { options: s.site.chatbot?.options ?? [], settings } },
            chatbotPreviewTick: s.chatbotPreviewTick + 1,
          }
        : s
    ),
}));
