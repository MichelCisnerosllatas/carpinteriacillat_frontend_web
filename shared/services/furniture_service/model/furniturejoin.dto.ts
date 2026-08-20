import type { LinksPaginationType } from '@/shared/type/linksPagination.type'
import type { MetaPaginationType } from '@/shared/type/metaPagination.type'

export type FurnitureImageSummary = {
  id_image: number
  image_name: string
  image_title: string | null
  image_alt: string | null
  // Ruta relativa de storage, no una URL absoluta: antepone
  // NEXT_PUBLIC_CORE_STORAGE_URL_* para armar la URL final.
  image_patch: string
  image_type: string
}

export type FurnitureTypeColorSummary = {
  id_typecolor: number
  typecolor_name: string
  typecolor_description: string | null
}

export type FurnitureTypeWoodSummary = {
  id_typewood: number
  typewood_name: string
  typewood_description: string | null
}

export type FurnitureCategorySummary = {
  id_category: number
  category_name: string
  category_description: string | null
}

export type FurnitureGalleryImage = {
  id_furniture_image: number
  furnitureimage_order: number
  image: FurnitureImageSummary
}

// Grilla/detalle de la Galeria: mueble activo con imagen principal, color,
// madera, categoria y galeria de imagenes adicionales.
export type FurnitureJoinApiItem = {
  id_furniture: number
  furniture_name: string
  furniture_title: string
  furniture_description: string
  furniture_largo: string
  furniture_ancho: string
  furniture_order: number
  images: FurnitureImageSummary
  type_color: FurnitureTypeColorSummary
  type_wood: FurnitureTypeWoodSummary
  category: FurnitureCategorySummary
  gallery_images: FurnitureGalleryImage[]
}

export type FurnitureJoinListRequestDto = {
  search?: string
  id_category?: number
  per_page?: number
  page?: number
}

export type FurnitureJoinListResponseDto = {
  success: boolean
  status: number
  message: string
  data: FurnitureJoinApiItem[]
  links: LinksPaginationType
  meta: MetaPaginationType
}

export type FurnitureJoinDetailResponseDto = {
  success: boolean
  status: number
  message: string
  data: FurnitureJoinApiItem
}
