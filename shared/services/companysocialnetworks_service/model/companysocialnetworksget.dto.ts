import type { LinksPaginationType } from '@/shared/type/linksPagination.type'
import type { MetaPaginationType } from '@/shared/type/metaPagination.type'

export type CompanySocialNetworkApiItem = {
  id: number
  name: string
  link: string
  order: number
}

export type CompanySocialNetworkListRequestDto = {
  per_page?: number
  page?: number
}

export type CompanySocialNetworkListResponseDto = {
  success: boolean
  status: number
  message: string
  data: CompanySocialNetworkApiItem[]
  links: LinksPaginationType
  meta: MetaPaginationType
}
