import { Send } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

type Props = {
  onSend: (text: string) => void
}

export const ChatInput = ({ onSend }: Props) => {
  const [text, setText] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  // TAB → enfocar input (global)
  useEffect(() => {
    const handleGlobalKey = (e: KeyboardEvent) => {
      if (e.key === 'Tab' && document.activeElement !== inputRef.current) {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }

    window.addEventListener('keydown', handleGlobalKey)
    return () => window.removeEventListener('keydown', handleGlobalKey)
  }, [])

  const handleSend = () => {
    if (!text.trim()) return
    onSend(text)
    setText('')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="w-full flex justify-center px-2 sm:px-4">
      <div
        className="
          w-full max-w-3xl
          flex items-center
          bg-white/90 backdrop-blur-xl
          border border-gray-200/60
          rounded-xl sm:rounded-2xl
          shadow-md
          px-3 sm:px-4
          py-2
          gap-1.5 sm:gap-2
        "
      >
        {/* INPUT */}
        <input
          ref={inputRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Escribe tu mensaje..."
          className="
            flex-1
            bg-transparent
            outline-none
            text-sm sm:text-base
            text-gray-700
            placeholder:text-gray-400
          "
        />

        {/* MIC (opcional ocultar en móvil muy pequeño) */}
        {/* <button
          className="
            hidden xs:flex sm:flex
            p-2 rounded-lg
            text-gray-400
            hover:text-gray-600
            hover:bg-gray-100
            transition
          "
        >
          <Mic size={18} />
        </button> */}

        {/* SEND */}
        <button
          onClick={handleSend}
          disabled={!text.trim()}
          className="
            p-2 sm:p-2.5
            rounded-lg sm:rounded-xl
            bg-blue-500
            text-white
            hover:bg-blue-600
            transition
            shadow-md
            disabled:opacity-50
            disabled:cursor-not-allowed
          "
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  )
}
