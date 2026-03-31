import { useEffect, useRef, useState } from 'react'

type Options = {
  behavior?: ScrollBehavior
}

export const useAutoScroll = (
  messages: unknown[],
  loading: boolean,
  options?: Options,
) => {
  const { behavior = 'smooth' } = options || {}

  const containerRef = useRef<HTMLDivElement | null>(null)
  const bottomRef = useRef<HTMLDivElement | null>(null)

  const [isAtBottom, setIsAtBottom] = useState(true)

  // 🔍 detectar si el usuario está abajo
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleScroll = () => {
      const distance =
        container.scrollHeight -
        container.scrollTop -
        container.clientHeight

      setIsAtBottom(distance < 50)
    }

    container.addEventListener('scroll', handleScroll)

    return () => {
      container.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // 🔥 SCROLL INTELIGENTE HÍBRIDO
  useEffect(() => {
    const container = containerRef.current
    const bottom = bottomRef.current

    if (!container || !bottom) return
    if (!isAtBottom) return

    const id = requestAnimationFrame(() => {
      // 1️⃣ scroll inteligente basado en DOM
      bottom.scrollIntoView({
        behavior,
        block: 'nearest',
      })

      // 2️⃣ fallback para asegurar fondo real
      const maxScroll =
        container.scrollHeight - container.clientHeight

      if (container.scrollTop < maxScroll - 5) {
        container.scrollTo({
          top: maxScroll,
          behavior,
        })
      }
    })

    return () => cancelAnimationFrame(id)
  }, [messages, loading, isAtBottom, behavior])

  // 🔽 scroll manual (botón ↓)
  const scrollToBottom = () => {
    const container = containerRef.current
    if (!container) return

    container.scrollTo({
      top: container.scrollHeight,
      behavior,
    })
  }

  return {
    containerRef,
    bottomRef,
    isAtBottom,
    scrollToBottom,
  }
}
