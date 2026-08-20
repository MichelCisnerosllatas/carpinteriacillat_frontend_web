import type { SectionApiItem } from './sectionget.dto'

export type SectionPostRequestDto = {
  id_navigation?: number
  id_typesection?: number
  section_name: string
  section_title?: string
  section_description?: string
  section_content?: string
  section_order?: number
  section_state: number
  section_created_at?: string
}

export type SectionPostResponseDto = {
  success: boolean
  status: number
  message: string
  data: SectionApiItem
  errors?: Record<string, string[]>
}
