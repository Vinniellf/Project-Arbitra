import { useState } from 'react'
import { useUiBlock } from './useUiBlock'

export const useAsyncBlock = () => {
  const { isBlocked, startBlock, stopBlock } = useUiBlock()
  const [localLoading, setLocalLoading] = useState(false)

  const runWithBlock = async <T>(
    callback: () => Promise<T>,
    message = 'Procesando...'
  ): Promise<T> => {
    if (isBlocked) {
      throw new Error('Ya hay un proceso en ejecución. Espera un momento.')
    }

    startBlock(message)
    setLocalLoading(true)

    try {
      return await callback()
    } finally {
      setLocalLoading(false)
      stopBlock()
    }
  }

  return {
    isBlocked,
    localLoading,
    runWithBlock,
  }
}
