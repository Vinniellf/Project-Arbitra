export const SESSION_CONFIG = {
  INACTIVITY_TIMEOUT_MS: 3 * 60 * 1000, // 3 minutos
  ACTIVITY_EVENTS: [
    'mousemove',
    'mousedown',
    'keydown',
    'scroll',
    'touchstart',
    'click',
  ] as const,
} as const
