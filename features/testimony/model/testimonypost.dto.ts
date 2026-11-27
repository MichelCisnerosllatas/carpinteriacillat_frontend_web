export type TestimonyPostRequestDto = {
  testimony_name: string
  testimony_role?: string
  testimony_city?: string
  testimony_email?: string
  testimony_rating?: number
  testimony_message: string
  // Trabajo de la galería (web_works.id_web_work) al que pertenece el comentario (opcional;
  // el Home no lo manda). El backend solo lo acepta si el trabajo está publicado.
  id_web_work?: number
}

export type TestimonyApiItem = {
  id: number
}

export type TestimonyPostResponseDto = {
  success: boolean
  message: string
  data: TestimonyApiItem
}
