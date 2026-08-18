import type { ImageApiItem } from './imageget.dto'

// Mismo body para PUT (completo) y PATCH (parcial, todos los campos
// opcionales): actualiza metadatos del registro, no el archivo fisico.
export type ImagePutRequestDto = {
  image_name?: string
  image_title?: string
  image_alt?: string
  image_patch?: string
  image_type?: string
  image_size?: number
  image_width?: number
  image_height?: number
}

export type ImagePutResponseDto = {
  success: boolean
  status: number
  message: string
  data: ImageApiItem
}
