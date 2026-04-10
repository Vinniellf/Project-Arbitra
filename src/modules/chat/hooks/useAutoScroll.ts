import { useEffect, useRef } from 'react'
import type { Message } from '../types/chat.types'

type Options = {
  loading?: boolean
  shouldScrollToNextAssistant?: boolean
  onScrolledToNextAssistant?: () => void
}

export const useAutoScroll = (
  messages: Message[],
  {
    loading = false,
    shouldScrollToNextAssistant = false,
    onScrolledToNextAssistant,
  }: Options = {}
) => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const lastAssistantRef = useRef<HTMLDivElement | null>(null)

  const scrollContainerToBottom = (behavior: ScrollBehavior = 'smooth') => {
    const container = containerRef.current
    if (!container) return

    container.scrollTo({
      top: container.scrollHeight,
      behavior,
    })
  }

  const scrollContainerToAssistant = (behavior: ScrollBehavior = 'smooth') => {
    const container = containerRef.current
    const assistantNode = lastAssistantRef.current

    if (!container || !assistantNode) return

    const containerRect = container.getBoundingClientRect()
    const assistantRect = assistantNode.getBoundingClientRect()

    const currentScrollTop = container.scrollTop
    const relativeTop =
      assistantRect.top - containerRect.top + currentScrollTop - 16

    container.scrollTo({
      top: relativeTop,
      behavior,
    })
  }

  useEffect(() => {
    if (!messages.length) return

    const lastMessage = messages[messages.length - 1]

    if (lastMessage.role === 'user') {
      requestAnimationFrame(() => {
        scrollContainerToBottom('smooth')
      })
      return
    }

    if (shouldScrollToNextAssistant) {
      requestAnimationFrame(() => {
        scrollContainerToAssistant('smooth')
        onScrolledToNextAssistant?.()
      })
    }
  }, [messages, shouldScrollToNextAssistant, onScrolledToNextAssistant])

  useEffect(() => {
    if (!loading) return

    requestAnimationFrame(() => {
      scrollContainerToBottom('smooth')
    })
  }, [loading])

  return {
    containerRef,
    lastAssistantRef,
  }
}
