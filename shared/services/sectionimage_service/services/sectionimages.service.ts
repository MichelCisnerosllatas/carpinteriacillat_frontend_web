import { httpClient } from '@/shared/api/http/httpClient'
import { coreUrl } from '@/shared/api/core/core.url'
import { SECTION_IMAGES_ENDPOINTS } from './sectionimages.endpoint'
import type { SectionImageListRequestDto, SectionImageListResponseDto, SectionImageDetailResponseDto } from '../model/sectionimageget.dto'
import type { SectionImagePostRequestDto, SectionImagePostResponseDto } from '../model/sectionimagepost.dto'
import type { SectionImagePutRequestDto, SectionImagePutResponseDto } from '../model/sectionimageput.dto'
import type { SectionImageJoinListRequestDto, SectionImageJoinListResponseDto, SectionImageJoinDetailResponseDto } from '../model/sectionimagejoin.dto'

export const sectionImagesService = {
  get: (params?: SectionImageListRequestDto): Promise<SectionImageListResponseDto> => {
    return httpClient.get<SectionImageListResponseDto>(coreUrl(SECTION_IMAGES_ENDPOINTS.v1.get), { params })
  },

  getById: (id: number): Promise<SectionImageDetailResponseDto> => {
    return httpClient.get<SectionImageDetailResponseDto>(coreUrl(SECTION_IMAGES_ENDPOINTS.v1.getById(id)))
  },

  post: (param: SectionImagePostRequestDto): Promise<SectionImagePostResponseDto> => {
    return httpClient.post<SectionImagePostResponseDto>(coreUrl(SECTION_IMAGES_ENDPOINTS.v1.post), param)
  },

  put: (id: number, param: SectionImagePutRequestDto): Promise<SectionImagePutResponseDto> => {
    return httpClient.put<SectionImagePutResponseDto>(coreUrl(SECTION_IMAGES_ENDPOINTS.v1.put(id)), param)
  },

  patch: (id: number, param: Partial<SectionImagePutRequestDto>): Promise<SectionImagePutResponseDto> => {
    return httpClient.patch<SectionImagePutResponseDto>(coreUrl(SECTION_IMAGES_ENDPOINTS.v1.patch(id)), param)
  },

  delete: async (id: number): Promise<boolean> => {
    const response = await httpClient.delete<{ success: boolean }>(coreUrl(SECTION_IMAGES_ENDPOINTS.v1.delete(id)))
    return response.success
  },

  // Endpoints _join: solo lectura, traen section (con navigation y
  // type_section) e image ya resueltos.
  getJoin: (params?: SectionImageJoinListRequestDto): Promise<SectionImageJoinListResponseDto> => {
    return httpClient.get<SectionImageJoinListResponseDto>(coreUrl(SECTION_IMAGES_ENDPOINTS.v1.getJoin), { params })
  },

  getJoinById: (id: number): Promise<SectionImageJoinDetailResponseDto> => {
    return httpClient.get<SectionImageJoinDetailResponseDto>(coreUrl(SECTION_IMAGES_ENDPOINTS.v1.getJoinById(id)))
  },
}
