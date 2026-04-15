import { Users } from 'lucide-react'
import EmptyStateCard from '../common/listing/EmptyStateCard'

export default function UsersEmptyState() {
  return (
    <EmptyStateCard
      icon={<Users className="h-8 w-8 text-slate-400" />}
      title="No se encontraron usuarios"
      description="Intenta ajustar el texto de búsqueda o cambiar los filtros aplicados."
    />
  )
}
