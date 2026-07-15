import { useEffect, useRef, useState } from 'react'
import { CheckCircle2, MessageCircle, Send, X } from 'lucide-react'

const ENTER_MS = 20
const EXIT_MS = 280

const MatchChat = ({ open, onClose, player, game }) => {
  const [draft, setDraft] = useState('')
  const [messages, setMessages] = useState([])
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)
  const [activePlayer, setActivePlayer] = useState(null)
  const [activeGame, setActiveGame] = useState(null)
  const endRef = useRef(null)
  const inputRef = useRef(null)
  const sessionKey = useRef(null)

  useEffect(() => {
    if (open && player && game) {
      setActivePlayer(player)
      setActiveGame(game)
      setMounted(true)
      const showTimer = window.setTimeout(() => setVisible(true), ENTER_MS)
      return () => window.clearTimeout(showTimer)
    }

    setVisible(false)
    const hideTimer = window.setTimeout(() => {
      setMounted(false)
      setActivePlayer(null)
      setActiveGame(null)
    }, EXIT_MS)
    return () => window.clearTimeout(hideTimer)
  }, [open, player, game])

  useEffect(() => {
    if (!open || !player || !game) return

    const key = `${player.id}-${game.id}`
    if (sessionKey.current !== key) {
      sessionKey.current = key
      setDraft('')
      setMessages([
        {
          id: 'sys',
          from: 'system',
          text: `Match confirmed with ${player.name}. Coordinate where to meet before tee-off.`,
        },
      ])
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const focusTimer = window.setTimeout(() => inputRef.current?.focus(), 320)

    return () => {
      document.body.style.overflow = previousOverflow
      window.clearTimeout(focusTimer)
    }
  }, [open, player, game])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  if (!mounted || !activePlayer || !activeGame) return null

  const send = () => {
    const text = draft.trim()
    if (!text) return
    setMessages((prev) => [
      ...prev,
      {
        id: `m-${Date.now()}`,
        from: 'host',
        text,
        time: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      },
    ])
    setDraft('')
  }

  const hostMessages = messages.filter((message) => message.from === 'host')

  return (
    <div
      className="fixed inset-0 z-[80] flex items-end justify-center p-0 sm:items-center sm:p-6"
      role="presentation"
    >
      <button
        type="button"
        className={`absolute inset-0 bg-ink/45 backdrop-blur-[2px] transition-opacity duration-300 ease-out ${
          visible ? 'opacity-100' : 'opacity-0'
        }`}
        aria-label="Close chat"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="match-chat-title"
        className={`relative z-10 flex h-[min(36rem,94vh)] w-full max-w-md flex-col overflow-hidden rounded-t-[1.35rem] border border-white/70 bg-white shadow-[0_24px_60px_rgba(26,46,38,0.22)] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] sm:rounded-[1.35rem] ${
          visible
            ? 'translate-y-0 opacity-100 scale-100'
            : 'translate-y-8 opacity-0 scale-[0.97] sm:translate-y-4'
        }`}
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#e8f0ea] to-transparent" />

        <header className="relative flex items-start gap-3 border-b border-line/70 px-4 pb-4 pt-4 sm:px-5">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-forest text-sm font-semibold text-white shadow-[0_6px_16px_rgba(45,106,79,0.28)]">
            {activePlayer.initials}
          </div>

          <div className="min-w-0 flex-1 pt-0.5">
            <div className="flex items-center gap-2">
              <p
                id="match-chat-title"
                className="truncate font-semibold text-ink"
              >
                {activePlayer.name}
              </p>
              <span className="inline-flex items-center gap-1 rounded-full bg-[#e8f0ea] px-2 py-0.5 text-[11px] font-medium text-forest">
                <span className="size-1.5 rounded-full bg-forest" />
                Matched
              </span>
            </div>
            <p className="mt-0.5 truncate text-sm text-muted">
              {activeGame.course}
            </p>
            <p className="mt-0.5 text-xs text-muted">
              {activeGame.date} · {activeGame.time}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-cream text-muted transition hover:bg-[#ebe8e1] hover:text-ink"
            aria-label="Close"
          >
            <X size={18} strokeWidth={1.75} />
          </button>
        </header>

        <div className="relative flex-1 space-y-3 overflow-y-auto bg-[linear-gradient(180deg,#f7f6f1_0%,#f9f8f3_100%)] px-4 py-4 sm:px-5">
          {messages.map((message) =>
            message.from === 'system' ? (
              <div
                key={message.id}
                className="mx-auto flex max-w-[92%] items-start gap-2.5 rounded-2xl border border-forest/15 bg-[#e8f0ea]/90 px-3.5 py-3 text-sm leading-relaxed text-forest shadow-[0_1px_0_rgba(255,255,255,0.7)]"
              >
                <CheckCircle2
                  size={18}
                  strokeWidth={1.75}
                  className="mt-0.5 shrink-0"
                />
                <p>{message.text}</p>
              </div>
            ) : (
              <div key={message.id} className="flex flex-col items-end gap-1">
                <div className="max-w-[82%] rounded-2xl rounded-br-md bg-forest px-3.5 py-2.5 text-sm leading-relaxed text-white shadow-[0_8px_18px_rgba(45,106,79,0.18)]">
                  {message.text}
                </div>
                {message.time && (
                  <span className="pr-1 text-[11px] text-muted">
                    {message.time}
                  </span>
                )}
              </div>
            ),
          )}

          {hostMessages.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-2 px-6 py-10 text-center">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-white text-forest shadow-[0_1px_3px_rgba(26,46,38,0.06)]">
                <MessageCircle size={22} strokeWidth={1.75} />
              </div>
              <p className="text-sm font-medium text-ink">Start the conversation</p>
              <p className="max-w-xs text-sm leading-relaxed text-muted">
                Suggest a meeting spot — e.g. pro shop, 20 minutes before tee-off.
              </p>
            </div>
          )}

          <div ref={endRef} />
        </div>

        <form
          className="relative border-t border-line/70 bg-white p-3 sm:p-4"
          onSubmit={(event) => {
            event.preventDefault()
            send()
          }}
        >
          <div className="flex items-center gap-2 rounded-2xl border border-line bg-cream/50 p-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] transition focus-within:border-forest/40 focus-within:bg-white focus-within:shadow-[0_0_0_3px_rgba(45,106,79,0.08)]">
            <label className="sr-only" htmlFor="match-chat-input">
              Message
            </label>
            <textarea
              id="match-chat-input"
              ref={inputRef}
              rows={1}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault()
                  send()
                }
              }}
              placeholder="Meet in the pro shop 20 mins before…"
              className="h-11 flex-1 resize-none bg-transparent px-3 py-3 text-sm leading-5 text-ink outline-none placeholder:text-muted/80"
            />
            <button
              type="submit"
              disabled={!draft.trim()}
              className="inline-flex size-11 shrink-0 items-center justify-center self-center rounded-lg bg-forest text-white transition hover:bg-[#244a37] enabled:active:scale-[0.97] disabled:cursor-not-allowed disabled:bg-forest/35"
              aria-label="Send message"
            >
              <Send size={17} strokeWidth={1.85} className="translate-x-px" />
            </button>
          </div>
          <p className="mt-2 px-1 text-[11px] text-muted">
            Enter to send · Shift + Enter for a new line
          </p>
        </form>
      </div>
    </div>
  )
}

export default MatchChat
