export type TestimonyPostRequestDto = {
  testimony_name: string
  testimony_role?: string
  testimony_city?: string
  testimony_email?: string
  testimony_rating?: number
  testimony_message: string
  // Mueble de la galería al que pertenece el comentario (opcional; el Home no lo manda).
  id_furniture?: number
}

export type TestimonyApiItem = {
  id: number
}

export type TestimonyPostResponseDto = {
  success: boolean
  message: string
  data: TestimonyApiItem
}
