import { fetchAuthSession } from 'aws-amplify/auth'

export async function getAccessToken(): Promise<string> {
  const session = await fetchAuthSession()
  const accessToken = session.tokens?.accessToken?.toString()

  if (!accessToken) {
    throw new Error('No se pudo obtener el access token')
  }

  return accessToken
}
