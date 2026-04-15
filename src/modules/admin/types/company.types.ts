// modules/admin/types/company.types.ts

import { ADMIN_COMPANY_STATUS } from '../constants/admin-company.constants'

/**
 * Tipo base de empresa (lo que viene del backend)
 */
export type Company = {
  companyId: string
  name: string
  ruc: string
  status: CompanyStatus
  createdAt: string | null
}

/**
 * Estados reales de una empresa en backend
 */
export type CompanyStatus = 'ACTIVE' | 'INACTIVE'

/**
 * Filtro de estado en frontend (incluye ALL)
 */
export type CompanyStatusFilter =
  (typeof ADMIN_COMPANY_STATUS)[keyof typeof ADMIN_COMPANY_STATUS]

/**
 * Respuesta de la API
 */
export type GetCompaniesResponse = {
  companies: Company[]
  total: number
}
