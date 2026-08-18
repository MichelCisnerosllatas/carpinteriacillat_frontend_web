import { httpClient } from '@/shared/api/http/httpClient'
import { coreUrl } from '@/shared/api/core/core.url'
import { COMPANY_SOCIAL_NETWORKS_ENDPOINTS } from './companysocialnetworks.endpoint'
import type { CompanySocialNetworkListRequestDto, CompanySocialNetworkListResponseDto } from '../model/companysocialnetworksget.dto'

// Solo lectura: el backend siempre filtra show_on_website = 1 y status = 1.
// Resultados ordenados por `order` (ascendente).
export const companySocialNetworksService = {
  get: (params?: CompanySocialNetworkListRequestDto): Promise<CompanySocialNetworkListResponseDto> => {
    return httpClient.get<CompanySocialNetworkListResponseDto>(coreUrl(COMPANY_SOCIAL_NETWORKS_ENDPOINTS.v1.get), { params })
  },
}
