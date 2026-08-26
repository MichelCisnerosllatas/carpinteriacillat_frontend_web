import { create } from 'zustand'
import { navigationsService } from '../services/navigations.service'
import type { NavigationApiItem } from '../model/navigationget.dto'
import { pickActiveNavigations } from '../lib/pickActiveNavigations'
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

// OJO: este store hace el fetch DESDE EL NAVEGADOR (fetch en el cliente).
// Desde que app/layout.tsx tambien pide la navegacion en el SERVIDOR antes
// de mandar el HTML (ver "initialNavigations" que reciben Header y
// Footer), este fetch de aca ya no es el que decide que se ve primero en
// pantalla — eso ahora lo resuelve initialNavigations. Este fetch queda
// como respaldo/actualizacion en segundo plano: por si el fetch del
// servidor fallo, o para tener el dato mas fresco disponible en el store
// para cualquier otro componente que lo necesite mas adelante.
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
      set({ navigations: pickActiveNavigations(response.data), isLoading: false, hasLoaded: true })
    } catch (err) {
      const message = err instanceof HttpError ? err.message : 'No se pudo cargar la navegacion'
      set({ error: message, isLoading: false, hasLoaded: true })
      notify.error(message)
    }
  },
}))
