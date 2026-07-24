import { httpClient } from '@/shared/api/http/httpClient'
import { coreUrl } from '@/shared/api/core/core.url'
import { CATEGORIES_ENDPOINTS } from './categories.endpoint'
import type { CategoryListRequestDto, CategoryListResponseDto } from '../model/categoryget.dto'
import type { CategoryPostRequestDto, CategoryPostResponseDto } from '../model/categorypost.dto'
import type { CategoryPutRequestDto, CategoryPutResponseDto } from '../model/categoryput.dto'

export const categoriesService = {
  get: (params?: CategoryListRequestDto): Promise<CategoryListResponseDto> => {
    return httpClient.get<CategoryListResponseDto>(coreUrl(CATEGORIES_ENDPOINTS.v1.get), { params })
  },    

  post: (param: CategoryPostRequestDto): Promise<CategoryPostResponseDto> => {
    return httpClient.post<CategoryPostResponseDto>(coreUrl(CATEGORIES_ENDPOINTS.v1.post), param)
  },    

  put: (id: number, param: CategoryPutRequestDto): Promise<CategoryPutResponseDto> =>{
    return httpClient.put<CategoryPutResponseDto>(coreUrl(CATEGORIES_ENDPOINTS.v1.put(id)), param)
  },

  delete: async (id: number): Promise<boolean> => {
    const response = await httpClient.delete<{ success: boolean }>(coreUrl(CATEGORIES_ENDPOINTS.v1.delete(id)))
    return response.success
  },
}
