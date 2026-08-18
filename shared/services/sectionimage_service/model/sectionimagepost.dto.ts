import type { SectionImageApiItem } from './sectionimageget.dto'

export type SectionImagePostRequestDto = {
  id_section: number
  id_image: number
  sectionimage_link?: string
  sectionimage_fix?: string
  sectionimage_order?: number
  sectionimage_state: number
  sectionimage_created_at?: string
}

export type SectionImagePostResponseDto = {
  success: boolean
  status: number
  message: string
  data: SectionImageApiItem
  errors?: Record<string, string[]>
}
