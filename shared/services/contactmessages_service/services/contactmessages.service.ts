import { httpClient } from '@/shared/api/http/httpClient'
import { coreUrl } from '@/shared/api/core/core.url'
import { CONTACT_MESSAGES_ENDPOINTS } from './contactmessages.endpoint'
import type { ContactMessagePostRequestDto, ContactMessagePostResponseDto } from '../model/contactmessagespost.dto'

// Unico endpoint publico de ESCRITURA de todo /v1/public. Limitado a 5
// solicitudes por minuto por IP (throttle:5,1) por el backend; una
// respuesta 429 llega como HttpError con status 429.
export const contactMessagesService = {
  post: (param: ContactMessagePostRequestDto): Promise<ContactMessagePostResponseDto> => {
    return httpClient.post<ContactMessagePostResponseDto>(coreUrl(CONTACT_MESSAGES_ENDPOINTS.v1.post), param)
  },
}
