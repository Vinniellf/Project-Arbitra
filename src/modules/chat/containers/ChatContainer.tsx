import { useChat } from '@/modules/chat/hooks/useChat'
import { useChatUI } from '@/modules/chat/hooks/useChatUI'
import { ChatLayout } from '@/modules/chat/layouts/ChatLayout'

export const ChatContainer = () => {
  const chat = useChat()
  const ui = useChatUI()

  return (
    <ChatLayout
      chat={chat}
      ui={ui}
    />
  )
}
