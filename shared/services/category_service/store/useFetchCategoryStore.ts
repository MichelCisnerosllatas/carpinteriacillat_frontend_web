import { create } from 'zustand'
import { categoriesService } from '../services/categories.service'
import type { CategoryApiItem } from '../model/categoryget.dto'
import { HttpError } from '@/shared/api/http/httpClient'
import { notify } from '@/shared/lib/notify'

type CategoryState = {
  categories: CategoryApiItem[]
  isLoading: boolean
  error: string | null
  fetchCategory: () => Promise<void>
}

// Fuente unica de verdad para "categorias" en toda la app: cualquier feature
// que necesite la lista solo consume este store, no vuelve a pedirla.
export const useCategoryStore = create<CategoryState>((set) => ({
  categories: [],
  isLoading: false,
  error: null,

  fetchCategory: async () => {
    set({ isLoading: true, error: null })

    try {
      const response = await categoriesService.get()
      set({ categories: response.data, isLoading: false })
    } catch (err) {
      const message = err instanceof HttpError ? err.message : 'No se pudo cargar las categorias'
      set({ error: message, isLoading: false })
      notify.error(message)
    }
  },
}))
