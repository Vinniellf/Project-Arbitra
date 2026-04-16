import { API } from '@/shared/config/api'
import { getAccessToken } from '@/shared/api/api-auth'
import { parseErrorResponse } from '@/shared/api/api-errors'
import type { GetCompaniesResponse } from '../../types/company.types'

export async function listCompanies(): Promise<GetCompaniesResponse> {
  const accessToken = await getAccessToken()

  try {
    const response = await fetch(API.admin.companies, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      await parseErrorResponse(response)
    }

    return (await response.json()) as GetCompaniesResponse
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(
        'No se pudo conectar con la API de companies. Revisa CORS, la URL de la API y que API Gateway esté activo.',
      )
    }

    throw error
  }
}
