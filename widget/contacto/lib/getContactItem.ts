// widget/contacto/lib/getContactItem.ts
//
// La seccion "contact" (section_type === "contact") no trae un objeto
// separado tipo "info": su contenido viaja como items normales dentro de
// section.items, cada uno identificado por item_type ("phone", "email",
// "branch", "whatsapp"). Ver FRONTEND_NEXTJS_SITE_V3.md #28.

import type { SiteSectionDto, SiteSectionItemDto } from "@/shared/services/site_service/model/siteget.dto";

export function getContactItem(section: SiteSectionDto, itemType: string): SiteSectionItemDto | undefined {
  return section.items.find((item) => item.state && item.item_type === itemType);
}
