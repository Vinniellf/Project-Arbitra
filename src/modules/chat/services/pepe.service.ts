import { fetchAuthSession } from 'aws-amplify/auth'

const chatSessions: Record<string, string> = {}

const getOrCreateSessionId = (chatId: string): string => {
  if (!chatSessions[chatId]) {
    chatSessions[chatId] = `bedrock-session-${Date.now()}-${Math.floor(Math.random() * 1000)}`
  }
  return chatSessions[chatId]
}

export const resetPepeState = (chatId: string) => {
  delete chatSessions[chatId]
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
  onChunk: (chunk: string) => void,
  onComplete: () => void
) => {
  const sessionId = getOrCreateSessionId(chatId)
  const currentPrompt = message.trim()

  if (!currentPrompt) return

  try {
    const token = await getCognitoIdToken()

    if (!token) {
      console.error('No se encontró el ID Token.')
      onChunk('\n⚠️ Error de autenticación: Por favor inicia sesión nuevamente.')
      onComplete()
      return
    }

    const response = await fetch(
      import.meta.env.VITE_LAMBDA_PEPE_DEV_FRONTED_TO_AGENT_URL,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          prompt: currentPrompt,
          sessionId,
        }),
      }
    )

    if (!response.ok) {
      throw new Error('Error comunicando con AgentCore')
    }

    const reader = response.body?.getReader()
    const decoder = new TextDecoder('utf-8')

    if (!reader) {
      throw new Error('No se pudo leer el stream de respuesta.')
    }

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      const chunk = decoder.decode(value, { stream: true })
      onChunk(chunk)
    }
  } catch (error) {
    console.error('Error en Pepe:', error)
    onChunk('\n⚠️ Lo siento, tuve un problema de conexión con el servidor central.')
  } finally {
    onComplete()
  }
}
