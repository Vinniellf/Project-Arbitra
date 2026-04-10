import { Send } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

type Props = {
  onSend: (text: string) => void
}

export const ChatInput = ({ onSend }: Props) => {
  const [text, setText] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const handleGlobalKey = (e: KeyboardEvent) => {
      if (
        e.key === 'Tab' &&
        document.activeElement !== textareaRef.current &&
        !e.ctrlKey &&
        !e.metaKey &&
        !e.altKey
      ) {
        e.preventDefault()
        textareaRef.current?.focus()
      }
    }

    window.addEventListener('keydown', handleGlobalKey)
    return () => window.removeEventListener('keydown', handleGlobalKey)
  }, [])

  useEffect(() => {
    const textarea = textareaRef.current
    if (!textarea) return

    textarea.style.height = '0px'
    textarea.style.height = `${Math.min(textarea.scrollHeight, 160)}px`
  }, [text])

  const handleSend = () => {
    const message = text.trim()
    if (!message) return

    onSend(message)
    setText('')

    if (textareaRef.current) {
      textareaRef.current.style.height = '44px'
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="w-full flex justify-center">
      <div
        className="
          w-full max-w-3xl
          flex items-end gap-2
          rounded-2xl border border-gray-200
          bg-white shadow-sm
          px-3 py-2
        "
      >
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          placeholder="Escribe tu mensaje..."
          className="
            flex-1
            min-h-11
            max-h-40
            resize-none
            overflow-y-auto
            bg-transparent
            px-1 py-2
            text-sm sm:text-base
            text-gray-700
            placeholder:text-gray-400
            outline-none
            leading-6
          "
        />

        <button
          onClick={handleSend}
          disabled={!text.trim()}
          type="button"
          className="
            flex h-11 w-11 shrink-0 items-center justify-center
            rounded-xl bg-blue-500 text-white shadow-sm
            transition hover:bg-blue-600
            disabled:cursor-not-allowed disabled:opacity-50
          "
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  )
}
