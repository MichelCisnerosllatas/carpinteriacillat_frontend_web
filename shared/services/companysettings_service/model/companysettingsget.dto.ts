export type CompanySettingsApiItem = {
  business_name: string
  trade_name: string
  tax_id: string
  logo: string | null
}

export type CompanySettingsResponseDto = {
  success: boolean
  status: number
  message: string
  data: CompanySettingsApiItem
}
