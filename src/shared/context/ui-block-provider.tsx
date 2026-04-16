import {
  useCallback,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { UiBlockContext } from './ui-block-context'

type UiBlockProviderProps = {
  children: ReactNode
}

export const UiBlockProvider = ({ children }: UiBlockProviderProps) => {
  const [isBlocked, setIsBlocked] = useState(false)
  const [blockMessage, setBlockMessage] = useState('')

  const startBlock = useCallback(
    (message = 'Procesando, por favor espera...') => {
      setIsBlocked(true)
      setBlockMessage(message)
    },
    []
  )

  const stopBlock = useCallback(() => {
    setIsBlocked(false)
    setBlockMessage('')
  }, [])

  const value = useMemo(
    () => ({
      isBlocked,
      blockMessage,
      startBlock,
      stopBlock,
    }),
    [isBlocked, blockMessage, startBlock, stopBlock]
  )

  return (
    <UiBlockContext.Provider value={value}>
      {children}
    </UiBlockContext.Provider>
  )
}
