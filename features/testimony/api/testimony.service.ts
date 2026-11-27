import { httpClient } from '@/shared/api/http/httpClient'
import { coreUrl } from '@/shared/api/core/core.url'
import { TESTIMONY_ENDPOINTS } from './testimony.endpoint'
import type { TestimonyPostRequestDto, TestimonyPostResponseDto } from '../model/testimonypost.dto'

// Igual criterio que contactMessagesService: el testimonio enviado queda pendiente de moderación
// en el intranet (testimony_state = 2) — nunca aparece de inmediato en el carrusel del sitio.
export const testimonyService = {
  post: (param: TestimonyPostRequestDto): Promise<TestimonyPostResponseDto> => {
    return httpClient.post<TestimonyPostResponseDto>(coreUrl(TESTIMONY_ENDPOINTS.v1.post), param)
  },
}
