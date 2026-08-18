import { create } from 'zustand'
import { companySocialNetworksService } from '../services/companysocialnetworks.service'
import type { CompanySocialNetworkApiItem, CompanySocialNetworkListRequestDto } from '../model/companysocialnetworksget.dto'
import { HttpError } from '@/shared/api/http/httpClient'
import { notify } from '@/shared/lib/notify'

type CompanySocialNetworksState = {
  socialNetworks: CompanySocialNetworkApiItem[]
  isLoading: boolean
  hasLoaded: boolean
  error: string | null
  fetchCompanySocialNetworks: (params?: CompanySocialNetworkListRequestDto) => Promise<void>
}

// Fuente unica de verdad para los links de redes sociales (Facebook,
// Instagram, WhatsApp, etc) que hoy estan hardcodeados en el Footer.
// El backend ya filtra show_on_website = 1 y status = 1, y ordena por `order`.
export const useCompanySocialNetworksStore = create<CompanySocialNetworksState>((set, get) => ({
  socialNetworks: [],
  isLoading: false,
  hasLoaded: false,
  error: null,

  fetchCompanySocialNetworks: async (params) => {
    if (get().socialNetworks.length > 0 || get().isLoading) return

    set({ isLoading: true, error: null })

    try {
      const response = await companySocialNetworksService.get(params)
      set({ socialNetworks: response.data, isLoading: false, hasLoaded: true })
    } catch (err) {
      const message = err instanceof HttpError ? err.message : 'No se pudo cargar las redes sociales'
      set({ error: message, isLoading: false, hasLoaded: true })
      notify.error(message)
    }
  },
}))
