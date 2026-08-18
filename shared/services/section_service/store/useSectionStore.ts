import { create } from 'zustand'
import { sectionsService } from '../services/sections.service'
import type { SectionJoinApiItem, SectionJoinListRequestDto } from '../model/sectionjoin.dto'
import { HttpError } from '@/shared/api/http/httpClient'
import { notify } from '@/shared/lib/notify'

type SectionState = {
  sections: SectionJoinApiItem[]
  selectedSection: SectionJoinApiItem | null
  isLoading: boolean
  isLoadingDetail: boolean
  hasLoaded: boolean
  error: string | null
  detailError: string | null
  // Usa la variante `_join` (trae navigation + type_section resueltos):
  // es la pensada para las pantallas del frontend publico. Las variantes
  // planas (post/put/delete) quedan para cuando exista un panel admin.
  fetchSections: (params?: SectionJoinListRequestDto) => Promise<void>
  fetchSectionById: (id: number) => Promise<void>
  clearSelectedSection: () => void
}

// Pensado como CMS liviano: el contenido de home/servicios/nosotros que
// hoy esta hardcodeado por feature podria venir de aqui en vez de estar
// fijo en cada archivo .tsx.
export const useSectionStore = create<SectionState>((set, get) => ({
  sections: [],
  selectedSection: null,
  isLoading: false,
  isLoadingDetail: false,
  hasLoaded: false,
  error: null,
  detailError: null,

  fetchSections: async (params) => {
    if (get().isLoading) return

    set({ isLoading: true, error: null })

    try {
      const response = await sectionsService.getJoin(params)
      const sorted = [...response.data].sort((a, b) => (a.section_order ?? 0) - (b.section_order ?? 0))
      set({ sections: sorted, isLoading: false, hasLoaded: true })
    } catch (err) {
      const message = err instanceof HttpError ? err.message : 'No se pudo cargar las secciones'
      set({ error: message, isLoading: false, hasLoaded: true })
      notify.error(message)
    }
  },

  fetchSectionById: async (id) => {
    if (get().isLoadingDetail) return

    set({ isLoadingDetail: true, detailError: null })

    try {
      const response = await sectionsService.getJoinById(id)
      set({ selectedSection: response.data, isLoadingDetail: false })
    } catch (err) {
      const message = err instanceof HttpError ? err.message : 'No se pudo cargar la seccion'
      set({ detailError: message, isLoadingDetail: false })
      notify.error(message)
    }
  },

  clearSelectedSection: () => set({ selectedSection: null, detailError: null }),
}))
