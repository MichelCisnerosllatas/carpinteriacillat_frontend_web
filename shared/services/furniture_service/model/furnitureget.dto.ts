import type { LinksPaginationType } from '@/shared/type/linksPagination.type'
import type { MetaPaginationType } from '@/shared/type/metaPagination.type'

// Muebles activos (furniture_state = 1), version plana sin relaciones.
export type FurnitureApiItem = {
  id_furniture: number
  id_image: number
  id_typecolor: number
  id_typewood: number
  id_category: number
  furniture_name: string
  furniture_title: string
  furniture_description: string
  furniture_largo: string
  furniture_ancho: string
  furniture_order: number
}

export type FurnitureListRequestDto = {
  search?: string
  per_page?: number
  page?: number
}

export type FurnitureListResponseDto = {
  success: boolean
  status: number
  message: string
  data: FurnitureApiItem[]
  links: LinksPaginationType
  meta: MetaPaginationType
}

export type FurnitureDetailResponseDto = {
  success: boolean
  status: number
  message: string
  data: FurnitureApiItem
}
