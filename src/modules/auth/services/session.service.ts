import { fetchAuthSession, fetchUserAttributes } from 'aws-amplify/auth'
import type { AuthUser } from '../types/auth.types'

function normalizeGroups(rawGroups: unknown): string[] {
  if (Array.isArray(rawGroups)) {
    return rawGroups
      .map((group) => String(group).trim().toLowerCase())
      .filter(Boolean)
  }

  if (typeof rawGroups === 'string') {
    return rawGroups
      .replace(/^\[|\]$/g, '')
      .replace(/"/g, '')
      .split(',')
      .map((group) => group.trim().toLowerCase())
      .filter(Boolean)
  }

  return []
}

export async function getCurrentSessionUser(): Promise<AuthUser | null> {
  try {
    const session = await fetchAuthSession()
    const attributes = await fetchUserAttributes()

    const idTokenPayload = session.tokens?.idToken?.payload
    const accessTokenPayload = session.tokens?.accessToken?.payload

    const rawGroups =
      idTokenPayload?.['cognito:groups'] ??
      accessTokenPayload?.['cognito:groups'] ??
      idTokenPayload?.groups ??
      accessTokenPayload?.groups ??
      []

    const groups = normalizeGroups(rawGroups)

    const fullName =
      attributes.name ||
      [attributes.given_name, attributes.family_name].filter(Boolean).join(' ') ||
      attributes.email

    return {
      email: attributes.email,
      name: fullName,
      groups,
      isAuthenticated: true,
    }
  } catch {
    return null
  }
}
