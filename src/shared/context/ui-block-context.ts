import { createContext } from 'react'

export type UiBlockContextType = {
  isBlocked: boolean
  blockMessage: string
  startBlock: (message?: string) => void
  stopBlock: () => void
}

export const UiBlockContext = createContext<UiBlockContextType | undefined>(
  undefined
)
