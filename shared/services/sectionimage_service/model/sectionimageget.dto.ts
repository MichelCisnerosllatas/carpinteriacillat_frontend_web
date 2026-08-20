import type { MetaPaginationType } from '@/shared/type/metaPagination.type'

// Nota: los campos de esta tabla usan el prefijo `sectionimage` (sin guion
// bajo intermedio), no `section_image`. Asi estan definidos en la BD.
export type SectionImageApiItem = {
  id_section_image: number
  id_section: number
  id_image: number
  sectionimage_link: string | null
  sectionimage_fix: string | null
  sectionimage_order: number | null
  sectionimage_state: number
  sectionimage_created_at: string
  sectionimage_updated_at: string | null
}

export type SectionImageListRequestDto = {
  state?: number
  per_page?: number
  page?: number
}

export type SectionImageListResponseDto = {
  success: boolean
  status: number
  message: string
  data: SectionImageApiItem[]
  meta: MetaPaginationType
}

export type SectionImageDetailResponseDto = {
  success: boolean
  status: number
  message: string
  data: SectionImageApiItem
}
