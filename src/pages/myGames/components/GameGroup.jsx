import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import RequestCard from './RequestCard'

const GameGroup = ({ game, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="space-y-2.5">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-3 rounded-xl border border-line/80 bg-white px-4 py-3.5 text-left shadow-[0_1px_2px_rgba(26,46,38,0.04)] transition hover:bg-[#fafafa] sm:px-5"
      >
        <span
          className="size-3.5 shrink-0 rounded-[3px] bg-forest"
          aria-hidden="true"
        />
        <span className="min-w-0 flex-1 text-sm sm:text-[15px]">
          <span className="font-semibold text-ink">{game.course}</span>
          <span className="text-muted">
            {' '}
            · {game.date} · {game.time}
          </span>
        </span>
        {game.pending > 0 && (
          <span className="shrink-0 rounded-full bg-forest px-2.5 py-1 text-xs font-medium text-white">
            {game.pending} pending
          </span>
        )}
        {game.needsReview && (
          <span className="shrink-0 rounded-full bg-[#d4a017] px-2.5 py-1 text-xs font-medium text-white">
            Review
          </span>
        )}
        <ChevronDown
          size={18}
          strokeWidth={1.75}
          className={`shrink-0 text-muted transition duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && game.requests.length > 0 && (
        <div className="space-y-2.5">
          {game.requests.map((request) => (
            <RequestCard key={request.id} request={request} />
          ))}
        </div>
      )}

      {open && game.requests.length === 0 && (
        <div className="rounded-xl border border-line/80 bg-white px-5 py-8 text-center text-sm text-muted shadow-[0_1px_2px_rgba(26,46,38,0.04)]">
          {game.needsReview
            ? 'Leave a review for your playing partners.'
            : 'No pending requests.'}
        </div>
      )}
    </div>
  )
}

export default GameGroup
