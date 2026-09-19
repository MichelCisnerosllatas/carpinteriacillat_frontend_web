export type TestimonyPostRequestDto = {
  testimony_name: string
  testimony_role?: string
  testimony_city?: string
  testimony_email?: string
  testimony_rating?: number
  testimony_message: string
}

export type TestimonyApiItem = {
  id: number
}

export type TestimonyPostResponseDto = {
  success: boolean
  message: string
  data: TestimonyApiItem
}
