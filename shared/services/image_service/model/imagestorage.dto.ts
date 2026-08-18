import type { LinksPaginationType } from '@/shared/type/linksPagination.type'
import type { MetaPaginationType } from '@/shared/type/metaPagination.type'

// Fuente: sistema de archivos del servidor (storage/app/public/images/),
// no la base de datos. Puede incluir archivos sin registro en `images`.
export type ImageStorageFileItem = {
  path: string
  url: string
  last_modified: number
}

export type ImageStorageListRequestDto = {
  folder?: string
  per_page?: number
  page?: number
}

export type ImageStorageListResponseDto = {
  success: boolean
  message: string
  data: ImageStorageFileItem[]
  links?: LinksPaginationType
  meta?: MetaPaginationType
}

export type ImageStoragePathRequestDto = {
  path: string
}

// /exists siempre responde 200; leer data.exists para el resultado real.
export type ImageStorageExistsResponseDto = {
  success: boolean
  message: string
  data: {
    path: string
    url: string
    exists: boolean
  }
}

// /show responde 404 (data: null) si el archivo no existe.
export type ImageStorageShowResponseDto = {
  success: boolean
  message: string
  data: {
    path: string
    url: string
    exists: boolean
  } | null
}

export type ImageStorageDeleteResponseDto = {
  success: boolean
  message: string
}

export type ImageStorageMoveRequestDto = {
  old_path: string
  // Al menos uno de los dos es obligatorio. La extension se preserva
  // siempre, no hace falta incluirla en new_name.
  new_name?: string
  new_folder?: string
}

export type ImageStorageMoveResponseDto = {
  success: boolean
  message: string
  data: {
    old_path: string
    new_path: string
    url: string
  }
}
