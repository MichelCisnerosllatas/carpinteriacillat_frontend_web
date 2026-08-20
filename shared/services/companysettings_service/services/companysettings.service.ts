import { httpClient } from '@/shared/api/http/httpClient'
import { coreUrl } from '@/shared/api/core/core.url'
import { COMPANY_SETTINGS_ENDPOINTS } from './companysettings.endpoint'
import type { CompanySettingsResponseDto } from '../model/companysettingsget.dto'

// Singleton: sin parametros ni {id}, siempre devuelve la unica ficha activa
// de la empresa (status = 1). 404 si fue deshabilitada.
export const companySettingsService = {
  get: (): Promise<CompanySettingsResponseDto> => {
    return httpClient.get<CompanySettingsResponseDto>(coreUrl(COMPANY_SETTINGS_ENDPOINTS.v1.get))
  },
}
