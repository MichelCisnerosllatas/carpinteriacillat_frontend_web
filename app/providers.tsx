"use client";

import { useRef } from "react";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { useSiteStore } from "@/shared/store/site/useSiteStore";
import type { SiteDataDto } from "@/shared/services/site_service/model/siteget.dto";

type AppProvidersProps = {
  children: React.ReactNode;
  // El mismo JSON que app/layout.tsx ya trajo con la unica llamada real a
  // getSite(). Se escribe en useSiteStore una sola vez, aca, para que el
  // resto de la app (Main*, formularios, etc) lea de ese store en vez de
  // volver a pedir el sitio en cada navegacion.
  site: SiteDataDto | null;
};

export default function AppProviders({ children, site }: AppProvidersProps) {
  // Se escribe en el cuerpo del componente (no en useEffect) para que el
  // store ya tenga el dato ANTES de que los hijos hagan su primer render —
  // useEffect corre despues del pintado y causaria un flash de estado
  // vacio. El ref evita reescribir el store en renders posteriores.
  const hydrated = useRef(false);
  if (!hydrated.current) {
    useSiteStore.setState({ site });
    hydrated.current = true;
  }

  return (
    <MantineProvider>
      <Notifications position="top-right" />
      {children}
    </MantineProvider>
  );
}
