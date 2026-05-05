import type { CompanyStatus } from '../../types/company'

// Devuelve el texto que ve el usuario
export const getCompanyStatusLabel = (status?: CompanyStatus | null) => {
  if (status === 'active') return 'Activa'
  if (status === 'inactive') return 'Inactiva'

  return 'Desconocido'
}

// Devuelve las clases de Tailwind para el badge
export const getCompanyStatusBadge = (status?: CompanyStatus | null) => {
  if (status === 'active') {
    return 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
  }

  if (status === 'inactive') {
    return 'bg-red-50 text-red-700 ring-1 ring-red-200'
  }

  return 'bg-slate-50 text-slate-600 ring-1 ring-slate-200'
}
