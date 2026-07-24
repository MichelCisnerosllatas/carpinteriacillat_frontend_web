import { httpClient } from '@/shared/api/http/httpClient'
import { coreUrl } from '@/shared/api/core/core.url'
import { NAVIGATIONS_ENDPOINTS } from './navigations.endpoint'
import type { NavigationListRequestDto, NavigationListResponseDto } from '../model/navigationget.dto'
import type { NavigationPostRequestDto, NavigationPostResponseDto } from '../model/navigationpost.dto'
import type { NavigationPutRequestDto, NavigationPutResponseDto } from '../model/navigationput.dto'

export const navigationsService = {
  get: (params?: NavigationListRequestDto): Promise<NavigationListResponseDto> => {
    return httpClient.get<NavigationListResponseDto>(coreUrl(NAVIGATIONS_ENDPOINTS.v1.get), { params })
  },

  post: (param: NavigationPostRequestDto): Promise<NavigationPostResponseDto> => {
    return httpClient.post<NavigationPostResponseDto>(coreUrl(NAVIGATIONS_ENDPOINTS.v1.post), param)
  },

  put: (id: number, param: NavigationPutRequestDto): Promise<NavigationPutResponseDto> => {
    return httpClient.put<NavigationPutResponseDto>(coreUrl(NAVIGATIONS_ENDPOINTS.v1.put(id)), param)
  },

  patch: (id: number, param: Partial<NavigationPutRequestDto>): Promise<NavigationPutResponseDto> => {
    return httpClient.patch<NavigationPutResponseDto>(coreUrl(NAVIGATIONS_ENDPOINTS.v1.patch(id)), param)
  },

  delete: async (id: number): Promise<boolean> => {
    const response = await httpClient.delete<{ success: boolean }>(coreUrl(NAVIGATIONS_ENDPOINTS.v1.delete(id)))
    return response.success
  },
}
