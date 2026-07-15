import { useEffect, useRef, useState } from 'react'
import { Send, X } from 'lucide-react'

const MatchChat = ({ open, onClose, player, game }) => {
  const [draft, setDraft] = useState('')
  const [messages, setMessages] = useState([])
  const endRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (!open || !player) return

    setDraft('')
    setMessages([
      {
        id: 'sys',
        from: 'system',
        text: `Match confirmed with ${player.name} at ${game.course}. Coordinate where to meet before tee-off.`,
      },
    ])

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const timer = window.setTimeout(() => inputRef.current?.focus(), 50)

    return () => {
      document.body.style.overflow = previousOverflow
      window.clearTimeout(timer)
    }
  }, [open, player, game])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  if (!open || !player) return null

  const send = () => {
    const text = draft.trim()
    if (!text) return
    setMessages((prev) => [
      ...prev,
      { id: `m-${Date.now()}`, from: 'host', text },
    ])
    setDraft('')
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center p-0 sm:items-center sm:p-6">
      <button
        type="button"
        className="absolute inset-0 bg-ink/40"
        aria-label="Close chat"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="match-chat-title"
        className="relative z-10 flex h-[min(32rem,92vh)] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl border border-line bg-white shadow-[0_20px_50px_rgba(26,46,38,0.18)] sm:rounded-2xl"
      >
        <header className="flex items-start justify-between gap-3 border-b border-line px-4 py-3.5 sm:px-5">
          <div className="min-w-0">
            <p
              id="match-chat-title"
              className="font-semibold text-ink"
            >
              Chat with {player.name}
            </p>
            <p className="mt-0.5 truncate text-sm text-muted">
              {game.course} · {game.date} · {game.time}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg text-muted transition hover:bg-[#f5f5f5] hover:text-ink"
            aria-label="Close"
          >
            <X size={18} strokeWidth={1.75} />
          </button>
        </header>

        <div className="flex-1 space-y-3 overflow-y-auto bg-cream/60 px-4 py-4 sm:px-5">
          {messages.map((message) =>
            message.from === 'system' ? (
              <p
                key={message.id}
                className="rounded-lg bg-[#e8f0ea] px-3 py-2 text-center text-sm leading-relaxed text-forest"
              >
                {message.text}
              </p>
            ) : (
              <div key={message.id} className="flex justify-end">
                <div className="max-w-[85%] rounded-2xl rounded-br-md bg-forest px-3.5 py-2.5 text-sm leading-relaxed text-white">
                  {message.text}
                </div>
              </div>
            ),
          )}
          <div ref={endRef} />
        </div>

        <form
          className="flex items-end gap-2 border-t border-line bg-white p-3 sm:p-4"
          onSubmit={(event) => {
            event.preventDefault()
            send()
          }}
        >
          <label className="sr-only" htmlFor="match-chat-input">
            Message
          </label>
          <textarea
            id="match-chat-input"
            ref={inputRef}
            rows={2}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault()
                send()
              }
            }}
            placeholder="e.g. Meet in the pro shop 20 minutes before"
            className="min-h-[2.75rem] flex-1 resize-none rounded-xl border border-line bg-cream/40 px-3.5 py-2.5 text-sm text-ink outline-none transition placeholder:text-muted focus:border-forest focus:bg-white"
          />
          <button
            type="submit"
            disabled={!draft.trim()}
            className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-forest text-white transition hover:bg-[#244a37] disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Send message"
          >
            <Send size={18} strokeWidth={1.75} />
          </button>
        </form>
      </div>
    </div>
  )
}

export default MatchChat
