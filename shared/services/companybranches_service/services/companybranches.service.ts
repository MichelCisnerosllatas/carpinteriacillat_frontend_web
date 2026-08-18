import { httpClient } from '@/shared/api/http/httpClient'
import { coreUrl } from '@/shared/api/core/core.url'
import { COMPANY_BRANCHES_ENDPOINTS } from './companybranches.endpoint'
import type { CompanyBranchListRequestDto, CompanyBranchListResponseDto } from '../model/companybranchesget.dto'

// Solo lectura: el backend siempre filtra status = 1, sin importar los
// parametros enviados. No hay CRUD publico para sucursales.
export const companyBranchesService = {
  get: (params?: CompanyBranchListRequestDto): Promise<CompanyBranchListResponseDto> => {
    return httpClient.get<CompanyBranchListResponseDto>(coreUrl(COMPANY_BRANCHES_ENDPOINTS.v1.get), { params })
  },
}
