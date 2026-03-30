import { Send, Mic } from 'lucide-react'
import { useState } from 'react'

type Props = {
  onSend: (text: string) => void
}

export const ChatInput = ({ onSend }: Props) => {
  const [text, setText] = useState('')

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
    <div className="w-full flex justify-center">
      <div
        className="
          w-full max-w-3xl
          flex items-center
          bg-white/90 backdrop-blur-xl
          border border-gray-200/60
          rounded-2xl
          shadow-md
          px-4 py-2
          gap-2
        "
      >
        {/* INPUT */}
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Escribe tu mensaje..."
          className="
            flex-1
            bg-transparent
            outline-none
            text-sm
            text-gray-700
            placeholder:text-gray-400
          "
        />

        {/* MIC */}
        <button
          className="
            p-2 rounded-lg
            text-gray-400
            hover:text-gray-600
            hover:bg-gray-100
            transition
          "
        >
          <Mic size={18} />
        </button>

        {/* SEND */}
        <button
          onClick={handleSend}
          disabled={!text.trim()}
          className="
            p-2.5 rounded-xl
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
