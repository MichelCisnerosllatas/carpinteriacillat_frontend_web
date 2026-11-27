// shared/services/site_service/services/site.service.ts
//
// Unico metodo: get(). Esta peticion la dispara SIEMPRE el servidor de
// Next.js (ver lib/getSite.ts), nunca el navegador — no hay ningun
// componente cliente ("use client") que deba importar este archivo
// directamente.

import { httpClient, type RequestOptions } from "@/shared/api/http/httpClient";
import { coreUrl } from "@/shared/api/core/core.url";
import { SITE_ENDPOINTS } from "./site.endpoint";
import type { SiteResponseDto } from "../model/siteget.dto";

export const siteService = {
  get: (fetchOptions?: RequestOptions): Promise<SiteResponseDto> => {
    return httpClient.get<SiteResponseDto>(coreUrl(SITE_ENDPOINTS.v1.get), fetchOptions);
  },
};
