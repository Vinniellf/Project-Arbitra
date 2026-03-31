import { useEffect, useState, useCallback, useRef } from 'react'

export const useChatUI = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const scrollPosition = useRef(0)
  const originalOverflow = useRef<string | null>(null)

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen(prev => !prev)
  }, [])

  const closeSidebar = useCallback(() => {
    setIsSidebarOpen(false)
  }, [])

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(prev => {
      if (!prev) {
        scrollPosition.current = window.scrollY
      }
      return !prev
    })
  }, [])

  useEffect(() => {
    if (isFullscreen) {
      originalOverflow.current = document.body.style.overflow
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = originalOverflow.current || 'auto'

      requestAnimationFrame(() => {
        window.scrollTo(0, scrollPosition.current)
      })
    }

    return () => {
      document.body.style.overflow = originalOverflow.current || 'auto'
    }
  }, [isFullscreen])

  // 🔥 ESC para salir de fullscreen o cerrar sidebar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isFullscreen) setIsFullscreen(false)
        else if (isSidebarOpen) setIsSidebarOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isFullscreen, isSidebarOpen])

  return {
    isSidebarOpen,
    toggleSidebar,
    closeSidebar,
    isFullscreen,
    toggleFullscreen,
  }
}
