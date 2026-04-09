import { useEffect, useState } from 'react'
import type { Empresa } from '../types/empresa'
import { mockEmpresas } from '../services/mock-empresas'

export function useAdminEmpresas() {
  const [empresas, setEmpresas] = useState<Empresa[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        setError(null)

        // Simular delay real
        await new Promise((res) => setTimeout(res, 800))

        setEmpresas(mockEmpresas)
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Error al cargar empresas'

        setError(message)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  return { empresas, loading, error }
}
