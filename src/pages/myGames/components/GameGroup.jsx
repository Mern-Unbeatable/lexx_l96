import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, LandPlot } from 'lucide-react'
import RequestCard from './RequestCard'

const GameGroup = ({
  game,
  defaultOpen = true,
  acceptedIds,
  declinedIds,
  onAccept,
  onDecline,
  onOpenChat,
  onLeaveReview,
}) => {
  const [open, setOpen] = useState(defaultOpen)
  const visibleRequests = game.requests || []

  return (
    <div className="space-y-2.5">
      <div className="flex w-full items-center gap-3 rounded-xl border border-line/80 bg-white px-4 py-3.5 shadow-[0_1px_2px_rgba(26,46,38,0.04)] sm:px-5">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex min-w-0 flex-1 items-center gap-3 text-left"
        >
          <LandPlot
            size={18}
            strokeWidth={1.75}
            className="shrink-0 text-forest"
            aria-hidden="true"
          />
          <span className="min-w-0 flex-1 text-sm sm:text-[15px]">
            <span className="font-semibold text-ink">{game.course}</span>
            <span className="text-muted">
              {' '}
              · {game.date} · {game.time}
            </span>
          </span>
        </button>

        {game.pending > 0 && (
          <Link
            to={`/my-games/${game.id}/requests`}
            className="shrink-0 rounded-full bg-forest px-2.5 py-1 text-xs font-medium text-white transition hover:bg-[#244a37]"
          >
            {game.pending} pending
          </Link>
        )}
        {game.needsReview && (
          <button
            type="button"
            onClick={() => onLeaveReview?.(game)}
            className="shrink-0 rounded-full bg-[#d4a017] px-2.5 py-1 text-xs font-medium text-white transition hover:bg-[#b88912]"
          >
            Leave review
          </button>
        )}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="shrink-0 rounded p-1 text-muted transition hover:text-ink"
          aria-label={open ? 'Collapse' : 'Expand'}
        >
          <ChevronDown
            size={18}
            strokeWidth={1.75}
            className={`transition duration-200 ${open ? 'rotate-180' : ''}`}
          />
        </button>
      </div>

      {open && visibleRequests.length > 0 && (
        <div className="space-y-2.5">
          {visibleRequests.map((request) => {
            const requestKey = request.joinRequestId || request.id
            const isAccepted =
              acceptedIds?.has(requestKey) || request.status === 'accepted'

            return (
            <RequestCard
              key={requestKey}
              request={request}
              accepted={isAccepted}
              declined={
                declinedIds?.has(requestKey) || request.status === 'declined'
              }
              onAccept={(player) => onAccept?.(player, game)}
              onDecline={(player) => onDecline?.(player, game)}
              onOpenChat={(player) => onOpenChat?.(player, game)}
            />
            )
          })}
        </div>
      )}

      {open && visibleRequests.length === 0 && (
        <div className="rounded-xl border border-line/80 bg-white px-5 py-8 text-center text-sm text-muted shadow-[0_1px_2px_rgba(26,46,38,0.04)]">
          {game.needsReview ? (
            <div className="space-y-3">
              <p>Leave a review for your playing partners.</p>
              <button
                type="button"
                onClick={() => onLeaveReview?.(game)}
                className="rounded-lg bg-forest px-4 py-2 text-sm font-medium text-white transition hover:bg-[#244a37]"
              >
                Leave a review
              </button>
            </div>
          ) : (
            'No pending requests.'
          )}
        </div>
      )}
    </div>
  )
}

export default GameGroup
