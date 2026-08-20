import { httpClient } from '@/shared/api/http/httpClient'
import { coreUrl } from '@/shared/api/core/core.url'
import { SECTIONS_ENDPOINTS } from './sections.endpoint'
import type { SectionListRequestDto, SectionListResponseDto, SectionDetailResponseDto } from '../model/sectionget.dto'
import type { SectionPostRequestDto, SectionPostResponseDto } from '../model/sectionpost.dto'
import type { SectionPutRequestDto, SectionPutResponseDto } from '../model/sectionput.dto'
import type { SectionReorderRequestDto, SectionReorderResponseDto } from '../model/sectionreorder.dto'
import type { SectionJoinListRequestDto, SectionJoinListResponseDto, SectionJoinDetailResponseDto } from '../model/sectionjoin.dto'

export const sectionsService = {
  get: (params?: SectionListRequestDto): Promise<SectionListResponseDto> => {
    return httpClient.get<SectionListResponseDto>(coreUrl(SECTIONS_ENDPOINTS.v1.get), { params })
  },

  getById: (id: number): Promise<SectionDetailResponseDto> => {
    return httpClient.get<SectionDetailResponseDto>(coreUrl(SECTIONS_ENDPOINTS.v1.getById(id)))
  },

  post: (param: SectionPostRequestDto): Promise<SectionPostResponseDto> => {
    return httpClient.post<SectionPostResponseDto>(coreUrl(SECTIONS_ENDPOINTS.v1.post), param)
  },

  put: (id: number, param: SectionPutRequestDto): Promise<SectionPutResponseDto> => {
    return httpClient.put<SectionPutResponseDto>(coreUrl(SECTIONS_ENDPOINTS.v1.put(id)), param)
  },

  patch: (id: number, param: Partial<SectionPutRequestDto>): Promise<SectionPutResponseDto> => {
    return httpClient.patch<SectionPutResponseDto>(coreUrl(SECTIONS_ENDPOINTS.v1.patch(id)), param)
  },

  delete: async (id: number): Promise<boolean> => {
    const response = await httpClient.delete<{ success: boolean }>(coreUrl(SECTIONS_ENDPOINTS.v1.delete(id)))
    return response.success
  },

  reorder: (param: SectionReorderRequestDto): Promise<SectionReorderResponseDto> => {
    return httpClient.post<SectionReorderResponseDto>(coreUrl(SECTIONS_ENDPOINTS.v1.reorder), param)
  },

  // Endpoints _join: solo lectura, pensados para las pantallas de listado
  // principales (traen navigation + type_section ya resueltos).
  getJoin: (params?: SectionJoinListRequestDto): Promise<SectionJoinListResponseDto> => {
    return httpClient.get<SectionJoinListResponseDto>(coreUrl(SECTIONS_ENDPOINTS.v1.getJoin), { params })
  },

  getJoinById: (id: number): Promise<SectionJoinDetailResponseDto> => {
    return httpClient.get<SectionJoinDetailResponseDto>(coreUrl(SECTIONS_ENDPOINTS.v1.getJoinById(id)))
  },
}
