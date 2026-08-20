import type { SectionImageApiItem } from './sectionimageget.dto'

export type SectionImagePutRequestDto = {
  id_section: number
  id_image: number
  sectionimage_link: string | null
  sectionimage_fix: string | null
  sectionimage_order: number
  sectionimage_state: number
}

export type SectionImagePutResponseDto = {
  success: boolean
  status: number
  message: string
  data: SectionImageApiItem
  errors?: Record<string, string[]>
}
