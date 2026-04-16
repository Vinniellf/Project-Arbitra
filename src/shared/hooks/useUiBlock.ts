import { useContext } from 'react'
import {
  UiBlockContext,
  type UiBlockContextType,
} from '../context/ui-block-context'

export const useUiBlock = (): UiBlockContextType => {
  const context = useContext(UiBlockContext)

  if (!context) {
    throw new Error('useUiBlock debe usarse dentro de UiBlockProvider')
  }

  return context
}
