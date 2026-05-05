import { ADMIN_COMPANY_STATUS } from '../constants/admin-company.constants'

export type CompanyStatus = 'active' | 'inactive'

export type Company = {
  companyId: string
  businessUnit: string
  company: string
  enabled: boolean
  location: string
  ruc: string
  site: string
  status: CompanyStatus
}

export type CompanyStatusFilter =
  (typeof ADMIN_COMPANY_STATUS)[keyof typeof ADMIN_COMPANY_STATUS]

export type GetCompaniesResponse = {
  companies: Company[]
  total: number
}
