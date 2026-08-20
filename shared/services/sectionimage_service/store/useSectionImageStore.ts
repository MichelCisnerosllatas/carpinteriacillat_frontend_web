import { create } from 'zustand'
import { sectionImagesService } from '../services/sectionimages.service'
import type { SectionImageJoinApiItem, SectionImageJoinListRequestDto } from '../model/sectionimagejoin.dto'
import { HttpError } from '@/shared/api/http/httpClient'
import { notify } from '@/shared/lib/notify'

type SectionImageState = {
  sectionImages: SectionImageJoinApiItem[]
  selectedSectionImage: SectionImageJoinApiItem | null
  isLoading: boolean
  isLoadingDetail: boolean
  hasLoaded: boolean
  error: string | null
  detailError: string | null
  // Usa la variante `_join` (3 niveles: section -> navigation/type_section,
  // e image), pensada para carruseles/galerias dentro de una seccion.
  fetchSectionImages: (params?: SectionImageJoinListRequestDto) => Promise<void>
  fetchSectionImageById: (id: number) => Promise<void>
  clearSelectedSectionImage: () => void
}

export const useSectionImageStore = create<SectionImageState>((set, get) => ({
  sectionImages: [],
  selectedSectionImage: null,
  isLoading: false,
  isLoadingDetail: false,
  hasLoaded: false,
  error: null,
  detailError: null,

  fetchSectionImages: async (params) => {
    if (get().isLoading) return

    set({ isLoading: true, error: null })

    try {
      const response = await sectionImagesService.getJoin(params)
      const sorted = [...response.data].sort((a, b) => (a.sectionimage_order ?? 0) - (b.sectionimage_order ?? 0))
      set({ sectionImages: sorted, isLoading: false, hasLoaded: true })
    } catch (err) {
      const message = err instanceof HttpError ? err.message : 'No se pudo cargar las imagenes de la seccion'
      set({ error: message, isLoading: false, hasLoaded: true })
      notify.error(message)
    }
  },

  fetchSectionImageById: async (id) => {
    if (get().isLoadingDetail) return

    set({ isLoadingDetail: true, detailError: null })

    try {
      const response = await sectionImagesService.getJoinById(id)
      set({ selectedSectionImage: response.data, isLoadingDetail: false })
    } catch (err) {
      const message = err instanceof HttpError ? err.message : 'No se pudo cargar la imagen de la seccion'
      set({ detailError: message, isLoadingDetail: false })
      notify.error(message)
    }
  },

  clearSelectedSectionImage: () => set({ selectedSectionImage: null, detailError: null }),
}))
