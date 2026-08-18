import { create } from 'zustand'
import { imageStorageService } from '../services/imagestorage.service'
import type { ImageStorageFileItem, ImageStorageListRequestDto } from '../model/imagestorage.dto'
import { HttpError } from '@/shared/api/http/httpClient'
import { notify } from '@/shared/lib/notify'

type ImageStorageState = {
  files: ImageStorageFileItem[]
  isLoading: boolean
  hasLoaded: boolean
  error: string | null
  fetchImageStorageFiles: (params?: ImageStorageListRequestDto) => Promise<void>
}

// Listado de archivos crudos del filesystem (storage/app/public/images/),
// no de la tabla `images`. Pensado para un futuro gestor de archivos/media
// library en el panel admin, no para la UI publica.
export const useImageStorageStore = create<ImageStorageState>((set, get) => ({
  files: [],
  isLoading: false,
  hasLoaded: false,
  error: null,

  fetchImageStorageFiles: async (params) => {
    if (get().isLoading) return

    set({ isLoading: true, error: null })

    try {
      const response = await imageStorageService.storageAll(params)
      set({ files: response.data, isLoading: false, hasLoaded: true })
    } catch (err) {
      const message = err instanceof HttpError ? err.message : 'No se pudo cargar los archivos'
      set({ error: message, isLoading: false, hasLoaded: true })
      notify.error(message)
    }
  },
}))
