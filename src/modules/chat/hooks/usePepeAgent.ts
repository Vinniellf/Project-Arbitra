import { useState } from 'react'
import { sendPepeAgentMessage } from '../services/generate-ticket-api.service'
import type { PepeAgentApiResponse } from '../types/pepe-agent.types'

export const usePepeAgent = () => {
  const [loading, setLoading] = useState(false)

  const sendMessage = async (
    message: string,
    sessionId: string
  ): Promise<PepeAgentApiResponse> => {
    setLoading(true)

    try {
      return await sendPepeAgentMessage({
        message,
        sessionId,
      })
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    sendMessage,
  }
}
