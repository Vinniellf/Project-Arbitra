import { User } from 'lucide-react'
import pepeIcon from '@/assets/icon.webp'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

type Props = {
  role: 'user' | 'assistant'
  content: string
}

export const MessageBubble = ({ role, content }: Props) => {
  const isUser = role === 'user'

  return (
    <div
      className={`
        flex items-end gap-2 sm:gap-3
        ${isUser ? 'justify-end' : 'justify-start'}
      `}
    >
      {!isUser && (
        <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center shrink-0">
          <img
            src={pepeIcon}
            className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
            alt="Bot avatar"
          />
        </div>
      )}

      <div
        className={`
          px-3 sm:px-4
          py-2 sm:py-3
          rounded-xl sm:rounded-2xl
          text-sm sm:text-[15px]
          max-w-[85%] sm:max-w-[75%]
          leading-relaxed
          wrap-break-word
          overflow-hidden
          ${
            isUser
              ? 'bg-blue-600 text-white shadow-sm whitespace-pre-wrap'
              : 'bg-white/80 border border-slate-200 text-slate-800'
          }
        `}
      >
        {isUser ? (
          <span className="whitespace-pre-wrap wrap-break-word">{content}</span>
        ) : (
          <div className="max-w-none text-[15px] leading-7 wrap-break-word">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ children }) => (
                  <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-2 mb-3 leading-tight">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-lg sm:text-xl font-semibold text-slate-900 mt-4 mb-2 leading-tight">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-base sm:text-lg font-semibold text-slate-900 mt-3 mb-2 leading-snug">
                    {children}
                  </h3>
                ),
                p: ({ children }) => (
                  <p className="my-2 whitespace-pre-wrap leading-7 text-slate-800">
                    {children}
                  </p>
                ),
                strong: ({ children }) => (
                  <strong className="font-bold text-slate-900">
                    {children}
                  </strong>
                ),
                em: ({ children }) => (
                  <em className="italic text-slate-700">{children}</em>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc pl-5 my-2 space-y-1">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal pl-5 my-2 space-y-1">
                    {children}
                  </ol>
                ),
                li: ({ children }) => (
                  <li className="leading-7 text-slate-800">{children}</li>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-slate-300 pl-4 my-3 italic text-slate-700">
                    {children}
                  </blockquote>
                ),
                code(props) {
                  const { inline, children } = props as {
                    inline?: boolean
                    children?: React.ReactNode
                  }

                  if (inline) {
                    return (
                      <code className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-900 text-[13px] font-mono">
                        {children}
                      </code>
                    )
                  }

                  return (
                    <code className="block w-full overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-3 text-[13px] font-mono leading-6 my-3">
                      {children}
                    </code>
                  )
                },
                pre: ({ children }) => (
                  <pre className="my-3 overflow-x-auto">{children}</pre>
                ),
                a: ({ href, children }) => (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline underline-offset-2 hover:text-blue-700"
                  >
                    {children}
                  </a>
                ),
                hr: () => <hr className="my-4 border-slate-300" />,
                br: () => <br className="block my-2" />,
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        )}
      </div>

      {isUser && (
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
          <User size={14} className="sm:w-4 sm:h-4 text-slate-600" />
        </div>
      )}
    </div>
  )
}
