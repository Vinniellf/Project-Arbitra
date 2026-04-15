import FiltersCard from '../common/filters/FiltersCard'
import SearchInput from '../common/filters/SearchInput'
import FilterSelect from '../common/filters/FilterSelect'
import { Building2, RefreshCw } from 'lucide-react'

type CompanyFiltersProps = {
  search: string
  statusFilter: string
  resultsCount: number
  loading?: boolean
  onSearchChange: (value: string) => void
  onStatusFilterChange: (value: string) => void
  onRefresh: () => void
}

const COMPANY_STATUS_OPTIONS = [
  { label: 'Todos los estados', value: 'ALL' },
  { label: 'Activas', value: 'ACTIVE' },
  { label: 'Inactivas', value: 'INACTIVE' },
] as const

export default function CompanyFilters({
  search,
  statusFilter,
  resultsCount,
  loading = false,
  onSearchChange,
  onStatusFilterChange,
  onRefresh,
}: CompanyFiltersProps) {
  return (
    <FiltersCard>
      <div className="flex w-full flex-col gap-2.5 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex min-w-0 flex-1 flex-col gap-2.5 lg:flex-row lg:items-center">
          <div className="min-w-0 flex-1 lg:max-w-120">
            <SearchInput
              value={search}
              placeholder="Buscar por nombre o RUC..."
              onChange={onSearchChange}
            />
          </div>

          <div className="w-full lg:w-52">
            <FilterSelect
              value={statusFilter}
              onChange={onStatusFilterChange}
              options={COMPANY_STATUS_OPTIONS}
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 xl:justify-end">
          <button
            type="button"
            onClick={onRefresh}
            disabled={loading}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-100 hover:text-violet-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw
              className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`}
            />
          </button>

          <div className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 sm:text-sm">
            <Building2 className="h-4 w-4 text-slate-500" />
            <span>{loading ? 'Cargando...' : `Resultados: ${resultsCount}`}</span>
          </div>
        </div>
      </div>
    </FiltersCard>
  )
}
