import { useCallback, useEffect, useRef } from 'react'

import { SESSION_CONFIG } from '@/shared/config/session.config'

type UseInactivityLogoutParams = {
  enabled: boolean
  onTimeout: () => void
}

export const useInactivityLogout = ({
  enabled,
  onTimeout,
}: UseInactivityLogoutParams) => {
  const timerRef = useRef<number | null>(null)
  const alreadyTriggeredRef = useRef(false)

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const startTimer = useCallback(() => {
    clearTimer()

    timerRef.current = window.setTimeout(() => {
      if (alreadyTriggeredRef.current) return

      alreadyTriggeredRef.current = true
      onTimeout()
    }, SESSION_CONFIG.INACTIVITY_TIMEOUT_MS)
  }, [clearTimer, onTimeout])

  const resetTimer = useCallback(() => {
    if (!enabled) return
    startTimer()
  }, [enabled, startTimer])

  useEffect(() => {
    if (!enabled) {
      clearTimer()
      alreadyTriggeredRef.current = false
      return
    }

    alreadyTriggeredRef.current = false

    const handleActivity = () => {
      resetTimer()
    }

    SESSION_CONFIG.ACTIVITY_EVENTS.forEach((eventName) => {
      window.addEventListener(eventName, handleActivity, { passive: true })
    })

    startTimer()

    return () => {
      clearTimer()

      SESSION_CONFIG.ACTIVITY_EVENTS.forEach((eventName) => {
        window.removeEventListener(eventName, handleActivity)
      })
    }
  }, [enabled, clearTimer, resetTimer, startTimer])
}
