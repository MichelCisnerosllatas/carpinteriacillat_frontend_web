// shared/services/site_service/lib/findFloatingWhatsapp.ts
//
// El botón flotante de WhatsApp (visible en TODAS las páginas, ver Footer.tsx) reutiliza el
// section_item item_type "whatsapp" de la sección "contact" — el mismo dato que ya existía
// para el card de información de contacto, pero que hoy no lo pinta nada ahí (el CTA visible
// en esa card es un section_button aparte). En vez de agregar una tabla/columna nueva solo
// para esto, se repurpuso lo que ya había: `sectionitem_state` controla si se muestra o no, y
// `sectionitem_variant` (antes sin uso en este item) guarda la POSICIÓN en pantalla en vez de
// un estilo visual — ver POSITION_CLASS en Footer.tsx para los valores válidos.
//
// El backend ya filtra `/v1/public/site` por estado (WebSiteRepository) — si el admin
// desactiva este item desde el intranet, simplemente no aparece en el árbol y esta función
// devuelve `null`. A diferencia de ContactInfoCard (que sí tiene un fallback fijo porque es
// contenido central de la página), acá NO hay fallback: "no encontrado" = no se pinta el
// botón, es justamente lo que permite ocultarlo desde el intranet.

import type { SiteDataDto } from "../model/siteget.dto";

export type FloatingWhatsappButton = {
  phone: string;
  position: string | null;
};

export function findFloatingWhatsapp(site: SiteDataDto | null): FloatingWhatsappButton | null {
  if (!site) return null;

  for (const navigation of site.navigations) {
    for (const section of navigation.sections) {
      const item = section.items.find((i) => i.item_type === "whatsapp" && i.state && i.value);
      if (item) {
        return { phone: item.value as string, position: item.variant };
      }
    }
  }

  return null;
}
