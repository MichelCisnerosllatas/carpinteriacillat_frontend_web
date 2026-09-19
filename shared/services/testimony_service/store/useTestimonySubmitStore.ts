import { create } from 'zustand'
import { testimonyService } from '../services/testimony.service'
import type { TestimonyApiItem } from '../model/testimonypost.dto'
import { HttpError } from '@/shared/api/http/httpClient'
import { notify } from '@/shared/lib/notify'
import { TestimonyFormDataType } from '../type/testimony_formdata_type'

type TestimonyState = {
  isSubmitting: boolean
  lastTestimony: TestimonyApiItem | null
  error: string | null

  submitTestimony: (data: TestimonyFormDataType) => Promise<boolean>
  resetTestimony: () => void
}

export const useTestimonySubmitStore = create<TestimonyState>((set) => ({
  isSubmitting: false,
  lastTestimony: null,
  error: null,

  submitTestimony: async (data) => {
    set({ isSubmitting: true, error: null })

    try {
      const response = await testimonyService.post({
        testimony_name: data.name,
        testimony_role: data.role || undefined,
        testimony_city: data.city || undefined,
        testimony_email: data.email || undefined,
        testimony_rating: data.rating ?? undefined,
        testimony_message: data.message,
      })

      set({ isSubmitting: false, lastTestimony: response.data })
      return true
    } catch (err) {
      const message = err instanceof HttpError ? err.message : 'No se pudo enviar el testimonio'

      set({ isSubmitting: false, error: message })
      notify.error(message)
      return false
    }
  },

  resetTestimony: () => set({ isSubmitting: false, lastTestimony: null, error: null }),
}))
