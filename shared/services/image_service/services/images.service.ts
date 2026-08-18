import { httpClient } from '@/shared/api/http/httpClient'
import { coreUrl } from '@/shared/api/core/core.url'
import { IMAGES_ENDPOINTS } from './images.endpoint'
import type { ImageListRequestDto, ImageListResponseDto, ImageDetailResponseDto } from '../model/imageget.dto'
import type {
  ImageUploadRequestDto,
  ImagePostResponseDto,
  ImageUploadOnlyRequestDto,
  ImageUploadOnlyResponseDto,
} from '../model/imagepost.dto'
import type { ImagePutRequestDto, ImagePutResponseDto } from '../model/imageput.dto'

// httpClient no serializa FormData a JSON (ver shared/api/http/httpClient.ts),
// asi que las subidas arman su propio FormData en vez de un objeto plano.
function toFormData(fields: Record<string, unknown>): FormData {
  const formData = new FormData()
  for (const [key, value] of Object.entries(fields)) {
    if (value === undefined || value === null) continue
    formData.append(key, value as string | Blob)
  }
  return formData
}

export const imagesService = {
  get: (params?: ImageListRequestDto): Promise<ImageListResponseDto> => {
    return httpClient.get<ImageListResponseDto>(coreUrl(IMAGES_ENDPOINTS.v1.get), { params })
  },

  getById: (id: number): Promise<ImageDetailResponseDto> => {
    return httpClient.get<ImageDetailResponseDto>(coreUrl(IMAGES_ENDPOINTS.v1.getById(id)))
  },

  // Flujo A (recomendado): sube el archivo y crea el registro en una sola
  // llamada.
  post: (param: ImageUploadRequestDto): Promise<ImagePostResponseDto> => {
    return httpClient.post<ImagePostResponseDto>(coreUrl(IMAGES_ENDPOINTS.v1.post), toFormData(param))
  },

  // Flujo B, paso 1: sube el archivo al storage sin registrarlo en la BD.
  upload: (param: ImageUploadOnlyRequestDto): Promise<ImageUploadOnlyResponseDto> => {
    return httpClient.post<ImageUploadOnlyResponseDto>(coreUrl(IMAGES_ENDPOINTS.v1.upload), toFormData(param))
  },

  put: (id: number, param: ImagePutRequestDto): Promise<ImagePutResponseDto> => {
    return httpClient.put<ImagePutResponseDto>(coreUrl(IMAGES_ENDPOINTS.v1.put(id)), param)
  },

  patch: (id: number, param: Partial<ImagePutRequestDto>): Promise<ImagePutResponseDto> => {
    return httpClient.patch<ImagePutResponseDto>(coreUrl(IMAGES_ENDPOINTS.v1.patch(id)), param)
  },

  delete: async (id: number): Promise<boolean> => {
    const response = await httpClient.delete<{ success: boolean }>(coreUrl(IMAGES_ENDPOINTS.v1.delete(id)))
    return response.success
  },
}
