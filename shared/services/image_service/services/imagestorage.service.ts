import { httpClient } from '@/shared/api/http/httpClient'
import { coreUrl } from '@/shared/api/core/core.url'
import { IMAGE_STORAGE_ENDPOINTS } from './imagestorage.endpoint'
import type {
  ImageStorageListRequestDto,
  ImageStorageListResponseDto,
  ImageStoragePathRequestDto,
  ImageStorageExistsResponseDto,
  ImageStorageShowResponseDto,
  ImageStorageDeleteResponseDto,
  ImageStorageMoveRequestDto,
  ImageStorageMoveResponseDto,
} from '../model/imagestorage.dto'

// Operaciones puras de filesystem: nunca tocan la tabla `images`. Usar solo
// para un gestor de archivos/media library en el panel admin, no para
// mostrar imagenes en la UI publica (para eso, imagesService.get/getById).
export const imageStorageService = {
  storageAll: (params?: ImageStorageListRequestDto): Promise<ImageStorageListResponseDto> => {
    return httpClient.get<ImageStorageListResponseDto>(coreUrl(IMAGE_STORAGE_ENDPOINTS.v1.storageAll), { params })
  },

  // Siempre responde 200: leer data.exists para el resultado real.
  exists: (param: ImageStoragePathRequestDto): Promise<ImageStorageExistsResponseDto> => {
    return httpClient.post<ImageStorageExistsResponseDto>(coreUrl(IMAGE_STORAGE_ENDPOINTS.v1.exists), param)
  },

  // Responde 404 (HttpError) si el archivo no existe.
  show: (param: ImageStoragePathRequestDto): Promise<ImageStorageShowResponseDto> => {
    return httpClient.post<ImageStorageShowResponseDto>(coreUrl(IMAGE_STORAGE_ENDPOINTS.v1.show), param)
  },

  delete: (param: ImageStoragePathRequestDto): Promise<ImageStorageDeleteResponseDto> => {
    return httpClient.delete<ImageStorageDeleteResponseDto>(coreUrl(IMAGE_STORAGE_ENDPOINTS.v1.delete), { body: param })
  },

  move: (param: ImageStorageMoveRequestDto): Promise<ImageStorageMoveResponseDto> => {
    return httpClient.patch<ImageStorageMoveResponseDto>(coreUrl(IMAGE_STORAGE_ENDPOINTS.v1.move), param)
  },
}
