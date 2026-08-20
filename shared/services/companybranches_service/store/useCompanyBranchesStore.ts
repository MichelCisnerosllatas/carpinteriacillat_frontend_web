import { create } from 'zustand'
import { companyBranchesService } from '../services/companybranches.service'
import type { CompanyBranchApiItem, CompanyBranchListRequestDto } from '../model/companybranchesget.dto'
import { HttpError } from '@/shared/api/http/httpClient'
import { notify } from '@/shared/lib/notify'

type CompanyBranchesState = {
  branches: CompanyBranchApiItem[]
  isLoading: boolean
  // true al terminar el primer intento (haya salido bien o mal). Sirve para
  // distinguir "todavia no llego la respuesta" de "la peticion fallo de verdad".
  hasLoaded: boolean
  error: string | null
  fetchCompanyBranches: (params?: CompanyBranchListRequestDto) => Promise<void>
}

// Fuente unica de verdad para las sucursales de la empresa. El backend ya
// filtra status = 1, asi que aqui no se vuelve a filtrar nada.
export const useCompanyBranchesStore = create<CompanyBranchesState>((set, get) => ({
  branches: [],
  isLoading: false,
  hasLoaded: false,
  error: null,

  fetchCompanyBranches: async (params) => {
    // Evita repetir la peticion si el componente se vuelve a montar y ya
    // tenemos datos (mismo criterio que useNavigationStore).
    if (get().branches.length > 0 || get().isLoading) return

    set({ isLoading: true, error: null })

    try {
      const response = await companyBranchesService.get(params)
      set({ branches: response.data, isLoading: false, hasLoaded: true })
    } catch (err) {
      const message = err instanceof HttpError ? err.message : 'No se pudo cargar las sucursales'
      set({ error: message, isLoading: false, hasLoaded: true })
      notify.error(message)
    }
  },
}))
