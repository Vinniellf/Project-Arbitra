import { useNavigate } from 'react-router-dom'
import { useUiBlock } from './useUiBlock'

export const useSafeNavigate = () => {
  const navigate = useNavigate()
  const { isBlocked, blockMessage } = useUiBlock()

  const safeNavigate = (to: string) => {
    if (isBlocked) {
      window.alert(blockMessage || 'Espera a que termine el proceso actual.')
      return
    }

    navigate(to)
  }

  return {
    safeNavigate,
    isBlocked,
  }
}
