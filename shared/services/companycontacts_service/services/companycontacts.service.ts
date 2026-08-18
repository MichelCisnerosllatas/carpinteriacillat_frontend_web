import { httpClient } from '@/shared/api/http/httpClient'
import { coreUrl } from '@/shared/api/core/core.url'
import { COMPANY_CONTACTS_ENDPOINTS } from './companycontacts.endpoint'
import type { CompanyContactListRequestDto, CompanyContactListResponseDto } from '../model/companycontactsget.dto'

// Solo lectura: el backend siempre filtra show_on_website = 1 y status = 1.
// Resultados ordenados por `order` (ascendente).
export const companyContactsService = {
  get: (params?: CompanyContactListRequestDto): Promise<CompanyContactListResponseDto> => {
    return httpClient.get<CompanyContactListResponseDto>(coreUrl(COMPANY_CONTACTS_ENDPOINTS.v1.get), { params })
  },
}
