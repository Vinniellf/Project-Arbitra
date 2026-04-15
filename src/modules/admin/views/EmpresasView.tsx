import PageHeader from '../components/layout/PageHeader'
import PageErrorState from '../components/common/feedback/PageErrorState'
import CompaniesTable from '../components/companies/CompanyTable'

import { Building2, RefreshCw } from 'lucide-react'
import { useAdminEmpresas } from '../hooks/companies/useAdminEmpresas'

export default function EmpresasView() {
  const { empresas, loading, error } = useAdminEmpresas()

  const headerIcon = loading ? (
    <RefreshCw className="h-7 w-7 animate-spin text-white" />
  ) : (
    <Building2 className="h-7 w-7 text-white" />
  )

  const formatDate = (date?: string | null) => {
    if (!date) return '-'
    return new Date(date).toLocaleDateString()
  }

  const getStatusBadge = (status: string) => {
    return status === 'ACTIVE'
      ? 'bg-emerald-100 text-emerald-700'
      : 'bg-slate-100 text-slate-600'
  }

  const getStatusLabel = (status: string) => {
    return status === 'ACTIVE' ? 'Activa' : 'Inactiva'
  }

  return (
    <div className="min-h-full bg-slate-50 p-2">
      <div className="mx-auto max-w-7xl space-y-6">
        <PageHeader
          title="Empresas"
          subtitle="Gestión de empresas registradas en el sistema"
          icon={headerIcon}
        />

        {error ? (
          <PageErrorState title="Error al cargar empresas" message={error} />
        ) : (
          <CompaniesTable
            companies={empresas}
            loading={loading}
            formatDate={formatDate}
            getStatusBadge={getStatusBadge}
            getStatusLabel={getStatusLabel}
          />
        )}
      </div>
    </div>
  )
}
