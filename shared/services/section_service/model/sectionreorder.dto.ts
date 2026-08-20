// El indice de cada id dentro del arreglo define su nuevo section_order
// (empezando en 1); no hace falta calcular el numero ni evitar colisiones.
export type SectionReorderRequestDto = {
  ids: number[]
}

export type SectionReorderResponseDto = {
  success: boolean
  status: number
  message: string
  data: null
  errors?: Record<string, string[]>
}
