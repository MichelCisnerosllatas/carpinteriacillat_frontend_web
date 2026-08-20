import { create } from 'zustand'
import { imagesService } from '../services/images.service'
import type { ImageApiItem, ImageListRequestDto } from '../model/imageget.dto'
import { HttpError } from '@/shared/api/http/httpClient'
import { notify } from '@/shared/lib/notify'

type ImagesState = {
  images: ImageApiItem[]
  selectedImage: ImageApiItem | null
  isLoading: boolean
  isLoadingDetail: boolean
  hasLoaded: boolean
  error: string | null
  detailError: string | null
  fetchImages: (params?: ImageListRequestDto) => Promise<void>
  fetchImageById: (id: number) => Promise<void>
  clearSelectedImage: () => void
}

// Lecturas del registro de imagenes (tabla `images`, no el filesystem). Las
// operaciones de escritura (post/put/delete/upload) son de panel admin y se
// llaman directo desde images.service.ts cuando exista esa UI, no desde aqui.
export const useImagesStore = create<ImagesState>((set, get) => ({
  images: [],
  selectedImage: null,
  isLoading: false,
  isLoadingDetail: false,
  hasLoaded: false,
  error: null,
  detailError: null,

  fetchImages: async (params) => {
    if (get().isLoading) return

    set({ isLoading: true, error: null })

    try {
      const response = await imagesService.get(params)
      set({ images: response.data, isLoading: false, hasLoaded: true })
    } catch (err) {
      const message = err instanceof HttpError ? err.message : 'No se pudo cargar las imagenes'
      set({ error: message, isLoading: false, hasLoaded: true })
      notify.error(message)
    }
  },

  fetchImageById: async (id) => {
    if (get().isLoadingDetail) return

    set({ isLoadingDetail: true, detailError: null })

    try {
      const response = await imagesService.getById(id)
      set({ selectedImage: response.data, isLoadingDetail: false })
    } catch (err) {
      const message = err instanceof HttpError ? err.message : 'No se pudo cargar la imagen'
      set({ detailError: message, isLoadingDetail: false })
      notify.error(message)
    }
  },

  clearSelectedImage: () => set({ selectedImage: null, detailError: null }),
}))
