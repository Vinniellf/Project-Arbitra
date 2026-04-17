import { Send } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

type Props = {
  onSend: (text: string) => void
  loading?: boolean
}

export const ChatInput = ({ onSend, loading = false }: Props) => {
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

    return () => {
      window.removeEventListener('keydown', handleGlobalKey)
    }
  }, [])

  useEffect(() => {
    const textarea = textareaRef.current
    if (!textarea) return

    textarea.style.height = '0px'
    textarea.style.height = `${Math.min(textarea.scrollHeight, 128)}px`
  }, [text])

  const handleSend = () => {
    if (loading) return

    const message = text.trim()
    if (!message) return

    onSend(message)
    setText('')

    if (textareaRef.current) {
      textareaRef.current.style.height = '36px'
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (loading) return

    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="w-full flex justify-center">
      <div
        className="
          w-full max-w-2xl
          flex items-center gap-1.5
          rounded-xl border border-gray-200
          bg-white shadow-sm
          px-2.5 py-1.5
          focus-within:ring-2 focus-within:ring-blue-100
        "
      >
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          placeholder={loading ? 'Pepe está escribiendo...' : 'Escribe tu mensaje...'}
          disabled={loading}
          className="
            flex-1
            min-h-9
            max-h-32
            resize-none
            overflow-y-auto
            bg-transparent
            px-1
            py-1.5
            text-sm
            text-gray-700
            placeholder:text-gray-400
            outline-none
            leading-5
            disabled:cursor-not-allowed
            disabled:opacity-60
          "
        />

        <button
          onClick={handleSend}
          disabled={loading || !text.trim()}
          type="button"
          className="
            flex h-9 w-9 shrink-0 items-center justify-center
            rounded-lg bg-blue-500 text-white shadow-sm
            transition hover:bg-blue-600
            disabled:cursor-not-allowed disabled:opacity-50
          "
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  )
}
