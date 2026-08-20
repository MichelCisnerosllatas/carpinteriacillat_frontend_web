import type { LinksPaginationType } from '@/shared/type/linksPagination.type'
import type { MetaPaginationType } from '@/shared/type/metaPagination.type'



// Pensado para las interfaces de paginacion principales del frontend: cada
// seccion trae ya su navegacion y tipo de seccion. Solo lectura (GET),
// no reemplaza los endpoints CRUD de sectionget/post/put.dto.
export type SectionJoinApiItem = {
  id_section: number
  section_name: string
  section_title: string | null
  section_description: string | null
  section_content: string | null
  section_order: number | null
  section_state: number
  section_created_at: string
  section_created_at_format: string
  section_updated_at: string | null
  section_updated_at_format: string | null
  navigation: SectionNavigationSummary
  type_section: SectionTypeSectionSummary
}

export type SectionJoinListRequestDto = {
  search?: string
  state?: number
  per_page?: number
  page?: number
}

export type SectionJoinListResponseDto = {
  success: boolean
  status: number
  message: string
  data: SectionJoinApiItem[]
  links: LinksPaginationType
  meta: MetaPaginationType
}

export type SectionJoinDetailResponseDto = {
  success: boolean
  status: number
  message: string
  data: SectionJoinApiItem
}

export type SectionNavigationSummary = {
  id_navigation: number
  navigation_name: string
  navigation_description?: string | null
  navigation_url: string
  navigation_order?: number
  navigation_state?: number
}

export type SectionTypeSectionSummary = {
  id_typesection: number
  typesection_name: string
  typesection_description?: string | null
  typesection_state?: number
}