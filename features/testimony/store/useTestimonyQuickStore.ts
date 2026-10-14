// features/testimony/store/useTestimonyQuickStore.ts
//
// Estado del formulario RÁPIDO de comentarios (detalle de un trabajo, /gallery/[id]).
// Es otro store, separado de useTestimonySubmitStore (formulario completo del Home y
// /testimonials), para que cada formulario maneje su propio estado sin pisarse.
// Los dos usan el mismo servicio: testimonyService.post.
import { create } from 'zustand'
import { testimonyService } from '../api/testimony.service'
import { HttpError } from '@/shared/api/http/httpClient'
import { notify } from '@/shared/lib/notify'
import { useGoogleAuthStore } from '@/features/google-auth/store/google-auth.store'
import { loginWithGoogle } from '@/features/google-auth/lib/login-with-google'

type TestimonyQuickState = {
  rating: number | null
  message: string
  formError: string | null
  // isConnecting: el popup de Google está abierto. isSubmitting: llamada al backend.
  isConnecting: boolean
  isSubmitting: boolean

  setRating: (rating: number) => void
  setMessage: (message: string) => void
  submit: (idFurniture: number) => Promise<boolean>
  reset: () => void
}

const initialState = {
  rating: null,
  message: '',
  formError: null,
  isConnecting: false,
  isSubmitting: false,
}

export const useTestimonyQuickStore = create<TestimonyQuickState>((set, get) => ({
  ...initialState,

  setRating: (rating) => set({ rating, formError: null }),
  setMessage: (message) => set({ message }),

  // Valida, pide la cuenta de Google si todavía no hay sesión y envía.
  // Devuelve true si el comentario se guardó (queda pendiente de aprobación en el intranet).
  submit: async (idFurniture) => {
    const { rating, message } = get()

    if (!rating) {
      set({ formError: 'Selecciona una valoración.' })
      return false
    }
    if (!message.trim()) {
      set({ formError: 'Escribe tu comentario.' })
      return false
    }
    set({ formError: null })

    // Sin sesión: se abre el popup de Google y, apenas elige la cuenta, se envía (un solo click).
    let user = useGoogleAuthStore.getState().user
    if (!user?.email) {
      set({ isConnecting: true })
      try {
        user = await loginWithGoogle()
      } catch {
        set({ isConnecting: false, formError: 'No se pudo conectar con tu cuenta de Google. Intenta nuevamente.' })
        return false
      }
      set({ isConnecting: false })
    }

    set({ isSubmitting: true })
    try {
      await testimonyService.post({
        testimony_name: user.name ?? '',
        testimony_email: user.email ?? undefined,
        testimony_rating: rating,
        testimony_message: message.trim(),
        id_furniture: idFurniture,
      })

      set({ ...initialState })
      return true
    } catch (err) {
      const errorMessage = err instanceof HttpError ? err.message : 'No se pudo enviar el comentario'

      set({ isSubmitting: false })
      notify.error(errorMessage)
      return false
    }
  },

  reset: () => set({ ...initialState }),
}))
