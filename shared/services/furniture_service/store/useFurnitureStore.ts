import { create } from 'zustand'
import { furnitureService } from '../services/furniture.service'
import type { FurnitureJoinApiItem, FurnitureJoinListRequestDto } from '../model/furniturejoin.dto'
import { HttpError } from '@/shared/api/http/httpClient'
import { notify } from '@/shared/lib/notify'

type FurnitureState = {
  furnitures: FurnitureJoinApiItem[]
  selectedFurniture: FurnitureJoinApiItem | null
  isLoading: boolean
  isLoadingDetail: boolean
  hasLoaded: boolean
  error: string | null
  detailError: string | null
  // Sin guard de "ya esta cargado": a diferencia de navigation/category,
  // la lista se puede volver a pedir con otros parametros (search,
  // id_category, page) para filtrar la grilla de la Galeria.
  fetchFurnitures: (params?: FurnitureJoinListRequestDto) => Promise<void>
  fetchFurnitureById: (id: number) => Promise<void>
  clearSelectedFurniture: () => void
}

// Pensado para reemplazar el array estatico de features/gallery/data/galleryItems.ts:
// usa las variantes `_join` (imagen principal, color, madera, categoria y
// galeria de imagenes) que el backend ya deja listas para grilla/detalle.
export const useFurnitureStore = create<FurnitureState>((set, get) => ({
  furnitures: [],
  selectedFurniture: null,
  isLoading: false,
  isLoadingDetail: false,
  hasLoaded: false,
  error: null,
  detailError: null,

  fetchFurnitures: async (params) => {
    if (get().isLoading) return

    set({ isLoading: true, error: null })

    try {
      const response = await furnitureService.getJoin(params)
      const sorted = [...response.data].sort((a, b) => a.furniture_order - b.furniture_order)
      set({ furnitures: sorted, isLoading: false, hasLoaded: true })
    } catch (err) {
      const message = err instanceof HttpError ? err.message : 'No se pudo cargar los muebles'
      set({ error: message, isLoading: false, hasLoaded: true })
      notify.error(message)
    }
  },

  fetchFurnitureById: async (id) => {
    if (get().isLoadingDetail) return

    set({ isLoadingDetail: true, detailError: null })

    try {
      const response = await furnitureService.getJoinById(id)
      set({ selectedFurniture: response.data, isLoadingDetail: false })
    } catch (err) {
      const message = err instanceof HttpError ? err.message : 'No se pudo cargar el mueble'
      set({ detailError: message, isLoadingDetail: false })
      notify.error(message)
    }
  },

  clearSelectedFurniture: () => set({ selectedFurniture: null, detailError: null }),
}))
