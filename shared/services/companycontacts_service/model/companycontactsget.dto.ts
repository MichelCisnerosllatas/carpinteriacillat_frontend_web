import type { LinksPaginationType } from '@/shared/type/linksPagination.type'
import type { MetaPaginationType } from '@/shared/type/metaPagination.type'

export type CompanyContactApiItem = {
  id: number
  name: string
  phone: string | null
  type: string
  email: string | null
  is_primary: boolean
  order: number
}

export type CompanyContactListRequestDto = {
  type?: string
  per_page?: number
  page?: number
}

export type CompanyContactListResponseDto = {
  success: boolean
  status: number
  message: string
  data: CompanyContactApiItem[]
  links: LinksPaginationType
  meta: MetaPaginationType
}
