import { create } from 'zustand'
import { companyContactsService } from '../services/companycontacts.service'
import type { CompanyContactApiItem, CompanyContactListRequestDto } from '../model/companycontactsget.dto'
import { HttpError } from '@/shared/api/http/httpClient'
import { notify } from '@/shared/lib/notify'

type CompanyContactsState = {
  contacts: CompanyContactApiItem[]
  isLoading: boolean
  hasLoaded: boolean
  error: string | null
  fetchCompanyContacts: (params?: CompanyContactListRequestDto) => Promise<void>
}

// Fuente unica de verdad para los contactos publicos de la empresa
// (telefonos, correos, WhatsApp, etc). El backend ya filtra
// show_on_website = 1 y status = 1, y ordena por `order`.
export const useCompanyContactsStore = create<CompanyContactsState>((set, get) => ({
  contacts: [],
  isLoading: false,
  hasLoaded: false,
  error: null,

  fetchCompanyContacts: async (params) => {
    if (get().contacts.length > 0 || get().isLoading) return

    set({ isLoading: true, error: null })

    try {
      const response = await companyContactsService.get(params)
      set({ contacts: response.data, isLoading: false, hasLoaded: true })
    } catch (err) {
      const message = err instanceof HttpError ? err.message : 'No se pudo cargar los contactos'
      set({ error: message, isLoading: false, hasLoaded: true })
      notify.error(message)
    }
  },
}))
