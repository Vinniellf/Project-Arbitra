import { fetchAuthSession } from 'aws-amplify/auth'
import type { MessageAction } from '../types/chat.types'

const ACTION_MARKER_PREFIX = '__PEPE_ACTION__:'
const SESSION_STORAGE_KEY = 'pepe_chat_sessions'

const readStoredSessions = (): Record<string, string> => {
  try {
    const stored = localStorage.getItem(SESSION_STORAGE_KEY)
    return stored ? (JSON.parse(stored) as Record<string, string>) : {}
  } catch {
    return {}
  }
}

const saveStoredSessions = (sessions: Record<string, string>) => {
  try {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessions))
  } catch (error) {
    console.error('Error guardando sesiones de Pepe:', error)
  }
}

const getOrCreateSessionId = (chatId: string): string => {
  const sessions = readStoredSessions()

  if (!sessions[chatId]) {
    sessions[chatId] = `bedrock-session-${Date.now()}-${Math.floor(
      Math.random() * 1000,
    )}`

    saveStoredSessions(sessions)
  }

  return sessions[chatId]
}

export const getPepeSessionId = (chatId: string): string => {
  return getOrCreateSessionId(chatId)
}

export const clearPepeSession = (chatId: string) => {
  const sessions = readStoredSessions()
  delete sessions[chatId]
  saveStoredSessions(sessions)
}

const getCognitoIdToken = async (): Promise<string | null> => {
  try {
    const session = await fetchAuthSession()
    return session.tokens?.idToken?.toString() ?? null
  } catch (error) {
    console.error('No se pudo obtener la sesión de Cognito:', error)
    return null
  }
}

const isInternalJsonResponse = (value: unknown): boolean => {
  return typeof value === 'object' && value !== null && 'updates' in value
}

const extractActionFromResponse = (
  response: string,
): { cleanResponse: string; action?: MessageAction } => {
  const markerIndex = response.indexOf(ACTION_MARKER_PREFIX)

  if (markerIndex === -1) {
    return {
      cleanResponse: response.trim(),
    }
  }

  const cleanResponse = response.slice(0, markerIndex).trim()

  const markerContent = response
    .slice(markerIndex + ACTION_MARKER_PREFIX.length)
    .trim()

  try {
    const parsed = JSON.parse(markerContent)

    if (parsed?.action === 'generate_ticket') {
      return {
        cleanResponse,
        action: 'generate_ticket',
      }
    }
  } catch {
    return {
      cleanResponse,
    }
  }

  return {
    cleanResponse,
  }
}

export const streamPepeResponse = async (
  chatId: string,
  message: string,
  onChunk: (chunk: string, action?: MessageAction) => void,
  onComplete: () => void,
) => {
  const sessionId = getOrCreateSessionId(chatId)
  const currentPrompt = message.trim()

  if (!currentPrompt) {
    onComplete()
    return
  }

  try {
    const token = await getCognitoIdToken()

    if (!token) {
      onChunk('\n⚠️ Error de autenticación: Por favor inicia sesión nuevamente.')
      onComplete()
      return
    }

    const endpoint = import.meta.env.VITE_LAMBDA_PEPE_DEV_FRONTED_TO_AGENT_URL

    if (!endpoint) {
      onChunk('\n⚠️ No está configurado el endpoint de streaming del agente.')
      onComplete()
      return
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        prompt: currentPrompt,
        sessionId,
      }),
    })

    if (!response.ok) {
      throw new Error('Error comunicando con AgentCore')
    }

    const reader = response.body?.getReader()
    const decoder = new TextDecoder('utf-8')

    if (!reader) {
      throw new Error('No se pudo leer el stream de respuesta.')
    }

    let fullResponse = ''

    while (true) {
      const { done, value } = await reader.read()

      if (done) break

      fullResponse += decoder.decode(value, { stream: true })
    }

    fullResponse += decoder.decode()

    const rawResponse = fullResponse.trim()

    if (!rawResponse) return

    try {
      const parsed = JSON.parse(rawResponse)

      if (isInternalJsonResponse(parsed)) {
        return
      }
    } catch {
      // No es JSON interno.
    }

    const { cleanResponse, action } = extractActionFromResponse(rawResponse)

    if (cleanResponse) {
      onChunk(cleanResponse, action)
    }
  } catch (error) {
    console.error('Error en Pepe:', error)
    onChunk('\n⚠️ Lo siento, tuve un problema de conexión con el servidor central.')
  } finally {
    onComplete()
  }
}
