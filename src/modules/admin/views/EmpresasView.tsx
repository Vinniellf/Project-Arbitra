import PageHeader from '../components/common/layout/PageHeader'
import PageErrorState from '../components/common/feedback/PageErrorState'
import { Building2, RefreshCw } from 'lucide-react'
import { useAdminEmpresas } from '../hooks/useAdminEmpresas'

export default function EmpresasView() {
  const { empresas, loading, error } = useAdminEmpresas()

  const headerIcon = loading ? (
    <RefreshCw className="h-7 w-7 text-white animate-spin" />
  ) : (
    <Building2 className="h-7 w-7 text-white" />
  )

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
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            {loading ? (
              <p className="text-sm text-slate-500">Cargando empresas...</p>
            ) : (
              <p className="text-sm text-slate-700">
                Aquí irá la lista de empresas ({empresas.length})
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
