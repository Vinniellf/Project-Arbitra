import { useCallback, useEffect, useState } from 'react'
import { listCompanies } from '../../services/companies/companies.service'
import type { Company } from '../../types/company'

type UseAdminEmpresasReturn = {
  empresas: Company[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useAdminEmpresas(): UseAdminEmpresasReturn {
  const [empresas, setEmpresas] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchEmpresas = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await listCompanies()
      setEmpresas(response.companies ?? [])
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Error al cargar empresas'
      setError(message)
      setEmpresas([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void fetchEmpresas()
  }, [fetchEmpresas])

  return {
    empresas,
    loading,
    error,
    refetch: fetchEmpresas,
  }
}
