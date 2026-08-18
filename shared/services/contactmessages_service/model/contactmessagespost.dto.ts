export type ContactMessageProjectType =
  | 'cocina'
  | 'closet_dormitorio'
  | 'oficina'
  | 'puertas_ventanas'
  | 'restauracion'
  | 'otro'

export type ContactMessagePostRequestDto = {
  name: string
  email: string
  phone: string
  project_type: ContactMessageProjectType
  message: string
  // Honeypot anti-spam: debe ir vacio/ausente. El formulario real lo oculta
  // con CSS; si un bot lo llena igual, el backend rechaza la solicitud.
  website?: string
}

export type ContactMessageApiItem = {
  id: number
  created_at: string
}

export type ContactMessagePostResponseDto = {
  success: boolean
  status: number
  message: string
  data: ContactMessageApiItem
  errors?: Record<string, string[]>
}
