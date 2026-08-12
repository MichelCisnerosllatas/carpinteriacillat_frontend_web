import { create } from 'zustand'
import { navigationsService } from '../services/navigations.service'
import type { NavigationApiItem } from '../model/navigationget.dto'
import { HttpError } from '@/shared/api/http/httpClient'
import { notify } from '@/shared/lib/notify'

type NavigationState = {
  navigations: NavigationApiItem[]
  isLoading: boolean
  // Se pone en true al terminar el PRIMER intento (haya salido bien o mal).
  // Sirve para distinguir "todavia no llego la respuesta" (no mostrar el
  // fallback, se veria como un cambio de texto raro) de "la peticion fallo
  // de verdad" (ahi si tiene sentido mostrar el fallback).
  hasLoaded: boolean
  error: string | null
  fetchNavigations: () => Promise<void>
}

export const useNavigationStore = create<NavigationState>((set, get) => ({
  navigations: [],
  isLoading: false,
  hasLoaded: false,
  error: null,

  fetchNavigations: async () => {
    // Evita repetir la peticion si el componente se vuelve a montar
    // (o StrictMode lo monta dos veces en dev) y ya tenemos datos.
    if (get().navigations.length > 0 || get().isLoading) return

    set({ isLoading: true, error: null })

    try {
      const response = await navigationsService.get({ state: 1, per_page: 50 })
      // No confiamos ciegamente en que el backend filtro por "state" (el
      // query param puede ser ignorado o cambiar de comportamiento): se
      // valida de nuevo en el cliente para que SOLO se muestren los links
      // activos (navigation_state === 1), y se ordenan por navigation_order.
      const active = response.data.filter((item) => item.navigation_state === 1)
      const sorted = [...active].sort((a, b) => a.navigation_order - b.navigation_order)
      set({ navigations: sorted, isLoading: false, hasLoaded: true })
    } catch (err) {
      const message = err instanceof HttpError ? err.message : 'No se pudo cargar la navegacion'
      set({ error: message, isLoading: false, hasLoaded: true })
      notify.error(message)
    }
  },
}))
