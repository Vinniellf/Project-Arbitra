import { fetchAuthSession, fetchUserAttributes } from 'aws-amplify/auth'
import type { AuthUser } from '../types/auth.types'

export async function getCurrentSessionUser(): Promise<AuthUser | null> {
  try {
    const session = await fetchAuthSession()
    const attributes = await fetchUserAttributes()

    const idTokenPayload = session.tokens?.idToken?.payload
    const accessTokenPayload = session.tokens?.accessToken?.payload

    const rawGroups =
      idTokenPayload?.['cognito:groups'] ??
      accessTokenPayload?.['cognito:groups'] ??
      idTokenPayload?.['groups'] ??
      accessTokenPayload?.['groups'] ??
      []

    const groups = Array.isArray(rawGroups)
      ? rawGroups.map((g) => String(g).trim().toLowerCase()).filter(Boolean)
      : typeof rawGroups === 'string'
        ? rawGroups
            .replace(/^\[|\]$/g, '')
            .replace(/"/g, '')
            .split(',')
            .map((g) => g.trim().toLowerCase())
            .filter(Boolean)
        : []

    return {
      email: attributes.email,
      name: attributes.name,
      groups,
      isAuthenticated: true,
    }
  } catch {
    return null
  }
}
