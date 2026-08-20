import type { LinksPaginationType } from '@/shared/type/linksPagination.type'
import type { MetaPaginationType } from '@/shared/type/metaPagination.type'

// image_patch es la clave de conexion entre la BD y el sistema de
// archivos: la URL publica final es `{BASE_URL}/storage/{image_patch}`.
export type ImageApiItem = {
  id_image: number
  image_name: string | null
  image_title: string | null
  image_alt: string | null
  image_patch: string | null
  image_type: string | null
  image_size: number | null
  image_width: number | null
  image_height: number | null
  image_created_at: string | null
  image_updated_at: string | null
}

export type ImageListRequestDto = {
  search?: string
  per_page?: number
  page?: number
}

export type ImageListResponseDto = {
  success: boolean
  status: number
  message: string
  data: ImageApiItem[]
  links: LinksPaginationType
  meta: MetaPaginationType
}

export type ImageDetailResponseDto = {
  success: boolean
  message: string
  data: ImageApiItem
}
