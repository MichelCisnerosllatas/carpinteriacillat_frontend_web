import { create } from 'zustand'
import { contactMessagesService } from '../services/contactmessages.service'
import type { ContactMessageApiItem, ContactMessagePostRequestDto } from '../model/contactmessagespost.dto'
import { HttpError } from '@/shared/api/http/httpClient'
import { notify } from '@/shared/lib/notify'

type ContactMessageState = {
  isSubmitting: boolean
  // Ultimo mensaje enviado con exito (util para mostrar un "gracias, te
  // contactaremos pronto" con el id/fecha que devuelve el backend).
  lastMessage: ContactMessageApiItem | null
  // NOTA: el DTO de la respuesta define `errors?: Record<string, string[]>`
  // para validacion 422 por campo, pero shared/api/http/httpClient.ts hoy
  // descarta el body en toda respuesta de error (solo construye un mensaje
  // generico "Error {status} al llamar {url}" a partir de HttpError). Hasta
  // que httpClient no forwardee ese body, aqui solo hay un mensaje general,
  // no errores por campo.
  error: string | null
  // Devuelve true/false en vez de lanzar, para que el formulario decida
  // que hacer (limpiar campos, mostrar error, etc) sin try/catch propio.
  submitContactMessage: (payload: ContactMessagePostRequestDto) => Promise<boolean>
  resetContactMessage: () => void
}

// Unico servicio de ESCRITURA de todo /v1/public. El backend limita a 5
// solicitudes por minuto por IP; una respuesta 429 llega como HttpError.
export const useContactMessageStore = create<ContactMessageState>((set) => ({
  isSubmitting: false,
  lastMessage: null,
  error: null,

  submitContactMessage: async (payload) => {
    set({ isSubmitting: true, error: null })

    try {
      const response = await contactMessagesService.post(payload)
      set({ isSubmitting: false, lastMessage: response.data })
      notify.success('Tu mensaje fue enviado. Te contactaremos pronto.')
      return true
    } catch (err) {
      const message = err instanceof HttpError ? err.message : 'No se pudo enviar el mensaje'
      set({ isSubmitting: false, error: message })
      notify.error(message)
      return false
    }
  },

  resetContactMessage: () => set({ isSubmitting: false, lastMessage: null, error: null }),
}))
