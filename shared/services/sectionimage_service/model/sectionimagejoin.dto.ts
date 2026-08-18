import type { LinksPaginationType } from '@/shared/type/linksPagination.type'
import type { MetaPaginationType } from '@/shared/type/metaPagination.type'

export type SectionImageJoinNavigationSummary = {
  id_navigation: number
  navigation_name: string
  navigation_url: string
}

export type SectionImageJoinTypeSectionSummary = {
  id_typesection: number
  typesection_name: string
}

export type SectionImageJoinSectionSummary = {
  id_section: number
  section_name: string
  section_title?: string | null
  navigation: SectionImageJoinNavigationSummary
  type_section: SectionImageJoinTypeSectionSummary
}

export type SectionImageJoinImageSummary = {
  id_image: number
  image_name: string
  image_title: string | null
  image_alt: string | null
  image_patch: string
  image_type: string
}

// Estructura de 3 niveles: section (con navigation y type_section dentro) e
// image. Solo lectura (GET), no reemplaza los endpoints CRUD.
export type SectionImageJoinApiItem = {
  id_section_image: number
  sectionimage_link: string | null
  sectionimage_fix: string | null
  sectionimage_order: number | null
  sectionimage_state: number
  sectionimage_created_at: string
  sectionimage_created_at_format: string
  sectionimage_updated_at: string | null
  sectionimage_updated_at_format: string | null
  section: SectionImageJoinSectionSummary
  image: SectionImageJoinImageSummary
}

export type SectionImageJoinListRequestDto = {
  state?: number
  per_page?: number
  page?: number
}

export type SectionImageJoinListResponseDto = {
  success: boolean
  status: number
  message: string
  data: SectionImageJoinApiItem[]
  links: LinksPaginationType
  meta: MetaPaginationType
}

export type SectionImageJoinDetailResponseDto = {
  success: boolean
  status: number
  message: string
  data: SectionImageJoinApiItem
}
