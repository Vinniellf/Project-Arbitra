import FiltersCard from '../../common/filters/FiltersCard'
import SearchInput from '../../common/filters/SearchInput'
import FilterSelect from '../../common/filters/FilterSelect'
import {
  ADMIN_USER_ENABLED_OPTIONS,
  ADMIN_USER_STATUS_OPTIONS,
} from '../../../constants/admin-user.constants'

type UserFiltersProps = {
  search: string
  statusFilter: string
  enabledFilter: string
  resultsCount: number
  onSearchChange: (value: string) => void
  onStatusFilterChange: (value: string) => void
  onEnabledFilterChange: (value: string) => void
}

export default function UserFilters({
  search,
  statusFilter,
  enabledFilter,
  resultsCount,
  onSearchChange,
  onStatusFilterChange,
  onEnabledFilterChange,
}: UserFiltersProps) {
  return (
    <FiltersCard>
      <SearchInput
        value={search}
        placeholder="Buscar por email, nombre o username..."
        onChange={onSearchChange}
      />

      <FilterSelect
        value={statusFilter}
        onChange={onStatusFilterChange}
        options={ADMIN_USER_STATUS_OPTIONS}
      />

      <FilterSelect
        value={enabledFilter}
        onChange={onEnabledFilterChange}
        options={ADMIN_USER_ENABLED_OPTIONS}
      />

      <div className="lg:ml-auto">
        <span className="inline-flex items-center rounded-xl bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600">
          Resultados: {resultsCount}
        </span>
      </div>
    </FiltersCard>
  )
}
