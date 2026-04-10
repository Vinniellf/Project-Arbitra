import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'

type ChatMessage = {
  id: string
  role: 'user' | 'assistant'
  content: string
}

type Options = {
  behavior?: ScrollBehavior
  threshold?: number
  offsetTop?: number
  shouldScrollToNextAssistant?: boolean
  onScrolledToNextAssistant?: () => void
}

export const useAutoScroll = (
  messages: ChatMessage[],
  options?: Options,
) => {
  const {
    behavior = 'smooth',
    threshold = 80,
    offsetTop = 20,
    shouldScrollToNextAssistant = false,
    onScrolledToNextAssistant,
  } = options || {}

  const containerRef = useRef<HTMLDivElement | null>(null)
  const lastAssistantRef = useRef<HTMLDivElement | null>(null)

  const [isNearBottom, setIsNearBottom] = useState(true)

  const lastAssistantId = useMemo(() => {
    const lastAssistant = [...messages]
      .filter((m) => m.role === 'assistant' && m.content.trim())
      .at(-1)

    return lastAssistant?.id ?? null
  }, [messages])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleScroll = () => {
      const distance =
        container.scrollHeight -
        container.scrollTop -
        container.clientHeight

      setIsNearBottom(distance < threshold)
    }

    handleScroll()
    container.addEventListener('scroll', handleScroll)

    return () => {
      container.removeEventListener('scroll', handleScroll)
    }
  }, [threshold])

  useLayoutEffect(() => {
    const container = containerRef.current
    const target = lastAssistantRef.current

    if (!container) return
    if (!lastAssistantId) return

    let raf1 = 0
    let raf2 = 0

    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        // CASO 1:
        // usuario estaba arriba y envió un mensaje
        // => llevar al inicio de la nueva respuesta
        if (shouldScrollToNextAssistant && target) {
          const containerRect = container.getBoundingClientRect()
          const targetRect = target.getBoundingClientRect()

          const targetTop =
            targetRect.top - containerRect.top + container.scrollTop

          container.scrollTo({
            top: Math.max(targetTop - offsetTop, 0),
            behavior,
          })

          onScrolledToNextAssistant?.()
          return
        }

        // CASO 2:
        // usuario ya estaba abajo
        // => mantenerlo abajo del todo
        if (isNearBottom) {
          container.scrollTo({
            top: container.scrollHeight,
            behavior,
          })
        }
      })
    })

    return () => {
      cancelAnimationFrame(raf1)
      cancelAnimationFrame(raf2)
    }
  }, [
    lastAssistantId,
    isNearBottom,
    behavior,
    offsetTop,
    shouldScrollToNextAssistant,
    onScrolledToNextAssistant,
  ])

  return {
    containerRef,
    lastAssistantRef,
    isNearBottom,
  }
}
