import { useEffect, useState } from 'react'

export const useBottomSpacer = (
  inputRef: React.RefObject<HTMLElement | null>
) => {
  const [height, setHeight] = useState(80)

  useEffect(() => {
    const element = inputRef.current
    if (!element) return

    const updateHeight = () => {
      const rect = element.getBoundingClientRect()

      setHeight((prev) => {
        const next = rect.height + 12 // margen visual
        return Math.abs(prev - next) > 1 ? next : prev
      })
    }

    updateHeight()

    const resizeObserver = new ResizeObserver(updateHeight)
    resizeObserver.observe(element)

    window.addEventListener('resize', updateHeight)

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener('resize', updateHeight)
    }
  }, [inputRef])

  return height
}
