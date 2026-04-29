import { fetchAuthSession } from 'aws-amplify/auth'
import { API } from '@/shared/config/api'
import type { MessageAction } from '../types/chat.types'


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

    const endpoint = API.pepe.chat

    if (!endpoint) {
      onChunk('\n⚠️ No está configurado el endpoint de API Gateway.')
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
      throw new Error(`Error del API Gateway: ${response.status}`)
    }

    const data = await response.json()
    if (data.response) {
      onChunk(data.response, data.action as MessageAction)
    }

  } catch (error) {
    console.error('Error comunicándose con Pepe:', error)
    onChunk('\n⚠️ Lo siento, tuve un problema de conexión con el servidor central.')
  } finally {
    onComplete()
  }
}