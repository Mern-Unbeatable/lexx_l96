import { useState } from 'react'
import { Loader2, MessageCircle } from 'lucide-react'

const JoinRequestCard = ({
  request,
  accepted = false,
  declined = false,
  onAccept,
  onDecline,
  onOpenChat,
}) => {
  const [accepting, setAccepting] = useState(false)
  const [declining, setDeclining] = useState(false)

  const handleAccept = async () => {
    if (accepting || declining) return
    setAccepting(true)
    try {
      await onAccept?.(request)
    } finally {
      setAccepting(false)
    }
  }

  const handleDecline = async () => {
    if (accepting || declining) return
    setDeclining(true)
    try {
      await onDecline?.(request)
    } finally {
      setDeclining(false)
    }
  }

  if (declined) {
    return (
      <article className="rounded-xl border border-line/80 bg-white p-4 opacity-70 shadow-[0_1px_2px_rgba(26,46,38,0.04)] sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#ebe8e1] text-sm font-semibold text-ink">
              {request.initials}
            </div>
            <div>
              <p className="font-semibold text-ink">{request.name}</p>
              <p className="text-sm text-muted">Request declined</p>
            </div>
          </div>
          <span className="rounded-full bg-[#f0eeea] px-2.5 py-1 text-xs font-medium text-muted">
            Declined
          </span>
        </div>
      </article>
    )
  }

  return (
    <article className="rounded-xl border border-line/80 bg-white p-4 shadow-[0_1px_2px_rgba(26,46,38,0.04)] sm:p-5">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:gap-8">
        <div className="flex min-w-[12rem] items-center gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#ebe8e1] text-sm font-semibold text-ink">
            {request.initials}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-semibold text-ink">{request.name}</p>
              {accepted && (
                <span className="rounded-full bg-[#e8f0ea] px-2 py-0.5 text-xs font-medium text-forest">
                  Accepted
                </span>
              )}
            </div>
            <p className="mt-0.5 text-sm text-muted">
              Age {request.age} · Handicap {request.handicap}
            </p>
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-medium uppercase tracking-wide text-muted">
            Message
          </p>
          <p className="mt-1 text-[15px] text-ink/80">
            &ldquo;{request.message}&rdquo;
          </p>
        </div>

        <div className="relative flex min-h-10 shrink-0 items-center justify-end gap-2">
          <div
            className={`flex items-center gap-2 transition-all duration-300 ${
              accepted || accepting || declining
                ? 'pointer-events-none absolute opacity-0 scale-95'
                : 'opacity-100 scale-100'
            }`}
          >
            <button
              type="button"
              onClick={handleDecline}
              disabled={accepting || declining}
              className="rounded-lg border border-line bg-white px-4 py-2 text-sm font-medium text-ink transition hover:bg-[#f5f5f5] disabled:opacity-50"
            >
              Decline
            </button>
            <button
              type="button"
              onClick={handleAccept}
              disabled={accepting || declining}
              className="inline-flex min-w-[5.5rem] items-center justify-center gap-2 rounded-lg bg-forest px-4 py-2 text-sm font-medium text-white transition hover:bg-[#244a37] disabled:opacity-80"
            >
              Accept
            </button>
          </div>

          {(accepting || declining) && !accepted && (
            <div className="inline-flex items-center justify-center gap-2 rounded-lg bg-forest px-4 py-2 text-sm font-medium text-white">
              <Loader2 size={16} strokeWidth={2} className="animate-spin" />
              {declining ? 'Declining…' : 'Accepting…'}
            </div>
          )}

          <button
            type="button"
            onClick={() => onOpenChat?.(request)}
            className={`inline-flex items-center gap-2 rounded-lg bg-forest px-4 py-2 text-sm font-medium text-white transition-all duration-300 hover:bg-[#244a37] ${
              accepted
                ? 'translate-y-0 opacity-100 scale-100'
                : 'pointer-events-none absolute translate-y-1 opacity-0 scale-95'
            }`}
          >
            <MessageCircle size={16} strokeWidth={1.75} />
            Chat
          </button>
        </div>
      </div>
    </article>
  )
}

export default JoinRequestCard
