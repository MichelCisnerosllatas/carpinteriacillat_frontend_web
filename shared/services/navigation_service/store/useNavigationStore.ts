import { create } from 'zustand'
import { navigationsService } from '../services/navigations.service'
import type { NavigationApiItem } from '../model/navigationget.dto'
import { HttpError } from '@/shared/api/http/httpClient'
import { notify } from '@/shared/lib/notify'

type NavigationState = {
  navigations: NavigationApiItem[]
  isLoading: boolean
  error: string | null
  fetchNavigations: () => Promise<void>
}

export const useNavigationStore = create<NavigationState>((set, get) => ({
  navigations: [],
  isLoading: false,
  error: null,

  fetchNavigations: async () => {
    // Evita repetir la peticion si el componente se vuelve a montar
    // (o StrictMode lo monta dos veces en dev) y ya tenemos datos.
    if (get().navigations.length > 0 || get().isLoading) return

    set({ isLoading: true, error: null })

    try {
      const response = await navigationsService.get({ state: 1, per_page: 50 })
      const sorted = [...response.data].sort((a, b) => a.navigation_order - b.navigation_order)
      set({ navigations: sorted, isLoading: false })
    } catch (err) {
      const message = err instanceof HttpError ? err.message : 'No se pudo cargar la navegacion'
      set({ error: message, isLoading: false })
      notify.error(message)
    }
  },
}))
