import type { LinksPaginationType } from '@/shared/type/linksPagination.type'
import type { MetaPaginationType } from '@/shared/type/metaPagination.type'

export type SectionApiItem = {
  id_section: number
  id_navigation: number | null
  id_typesection: number | null
  section_name: string
  section_title: string | null
  section_description: string | null
  section_content: string | null
  section_order: number | null
  section_state: number
  section_created_at: string
  section_updated_at: string | null
}

export type SectionListRequestDto = {
  search?: string
  state?: number
  per_page?: number
  page?: number
}

export type SectionListResponseDto = {
  success: boolean
  status: number
  message: string
  data: SectionApiItem[]
  links: LinksPaginationType
  meta: MetaPaginationType
}

export type SectionDetailResponseDto = {
  success: boolean
  status: number
  message: string
  data: SectionApiItem
}
