import type { SectionApiItem } from './sectionget.dto'

export type SectionPutRequestDto = {
  id_navigation?: number
  id_typesection: number
  section_name: string
  section_title?: string
  section_description?: string
  section_content?: string
  section_order: number
  section_state: number
}

export type SectionPutResponseDto = {
  success: boolean
  status: number
  message: string
  data: SectionApiItem
  errors?: Record<string, string[]>
}
