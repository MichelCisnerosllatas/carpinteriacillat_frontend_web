import { httpClient } from '@/shared/api/http/httpClient'
import { coreUrl } from '@/shared/api/core/core.url'
import { FURNITURE_ENDPOINTS } from './furniture.endpoint'
import type { FurnitureListRequestDto, FurnitureListResponseDto, FurnitureDetailResponseDto } from '../model/furnitureget.dto'
import type { FurnitureJoinListRequestDto, FurnitureJoinListResponseDto, FurnitureJoinDetailResponseDto } from '../model/furniturejoin.dto'

// Solo lectura: siempre filtra furniture_state = 1. `_join` alimenta la
// grilla/detalle de la Galeria (GalleryPhoto.tsx, app/gallery/[id]/page.tsx);
// las variantes planas se usan cuando no se necesitan las relaciones.
export const furnitureService = {
  getJoin: (params?: FurnitureJoinListRequestDto): Promise<FurnitureJoinListResponseDto> => {
    return httpClient.get<FurnitureJoinListResponseDto>(coreUrl(FURNITURE_ENDPOINTS.v1.getJoin), { params })
  },

  getJoinById: (id: number): Promise<FurnitureJoinDetailResponseDto> => {
    return httpClient.get<FurnitureJoinDetailResponseDto>(coreUrl(FURNITURE_ENDPOINTS.v1.getJoinById(id)))
  },

  get: (params?: FurnitureListRequestDto): Promise<FurnitureListResponseDto> => {
    return httpClient.get<FurnitureListResponseDto>(coreUrl(FURNITURE_ENDPOINTS.v1.get), { params })
  },

  getById: (id: number): Promise<FurnitureDetailResponseDto> => {
    return httpClient.get<FurnitureDetailResponseDto>(coreUrl(FURNITURE_ENDPOINTS.v1.getById(id)))
  },
}
