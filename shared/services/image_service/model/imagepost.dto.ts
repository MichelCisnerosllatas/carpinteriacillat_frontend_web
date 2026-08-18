import type { ImageApiItem } from './imageget.dto'

// Flujo A (un solo paso, recomendado): sube el archivo y registra la BD en
// la misma llamada. multipart/form-data, `image` siempre requerido.
export type ImageUploadRequestDto = {
  image: File
  image_name?: string
  image_title?: string
  image_alt?: string
  folder?: string
}

export type ImagePostResponseDto = {
  success: boolean
  status: number
  message: string
  data: ImageApiItem
  errors?: Record<string, string[]>
}

// Flujo B, paso 1: sube el archivo al storage SIN crear registro en la BD.
export type ImageUploadOnlyRequestDto = {
  image: File
  name?: string
  folder?: string
}

export type ImageUploadOnlyResponseDto = {
  success: boolean
  message: string
  data: {
    path: string
    url: string
  }
}
