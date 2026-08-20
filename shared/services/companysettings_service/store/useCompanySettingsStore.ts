import { create } from 'zustand'
import { companySettingsService } from '../services/companysettings.service'
import type { CompanySettingsApiItem } from '../model/companysettingsget.dto'
import { HttpError } from '@/shared/api/http/httpClient'
import { notify } from '@/shared/lib/notify'

type CompanySettingsState = {
  // Singleton: la empresa tiene una sola ficha activa (o ninguna, si el
  // backend responde 404 porque fue deshabilitada).
  settings: CompanySettingsApiItem | null
  isLoading: boolean
  hasLoaded: boolean
  error: string | null
  fetchCompanySettings: () => Promise<void>
}

// Fuente unica de verdad para la razon social, nombre comercial y logo de
// la empresa (Navbar, Footer, metadata, etc).
export const useCompanySettingsStore = create<CompanySettingsState>((set, get) => ({
  settings: null,
  isLoading: false,
  hasLoaded: false,
  error: null,

  fetchCompanySettings: async () => {
    if (get().settings !== null || get().isLoading) return

    set({ isLoading: true, error: null })

    try {
      const response = await companySettingsService.get()
      set({ settings: response.data, isLoading: false, hasLoaded: true })
    } catch (err) {
      const message = err instanceof HttpError ? err.message : 'No se pudo cargar los datos de la empresa'
      set({ error: message, isLoading: false, hasLoaded: true })
      notify.error(message)
    }
  },
}))
