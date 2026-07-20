import { useState } from 'react'
import { ChevronDown, LandPlot } from 'lucide-react'
import Stars from './Stars'

const ParticipantCard = ({ participant, onLeaveReview, game }) => (
  <article className="rounded-xl border border-line/80 bg-white p-4 shadow-[0_1px_2px_rgba(26,46,38,0.04)] sm:p-5">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#ebe8e1] text-sm font-semibold text-ink">
          {participant.initials}
        </div>
        <div>
          <p className="font-semibold text-ink">{participant.name}</p>
          <p className="text-sm text-muted">
            Age {participant.age} · Handicap {participant.handicap}
          </p>
          {participant.reviewed && participant.rating !== null && (
            <p className="mt-1.5 flex items-center gap-1.5 text-sm text-muted">
              <Stars rating={participant.rating} />
              <span>{participant.rating.toFixed(1)}</span>
            </p>
          )}
        </div>
      </div>

      {participant.reviewed ? (
        <span className="rounded-full bg-[#e8f0ea] px-2.5 py-1 text-xs font-medium text-forest">
          Reviewed
        </span>
      ) : (
        <button
          type="button"
          onClick={() => onLeaveReview?.({ ...game, participant })}
          className="rounded-full bg-[#d4a017] px-3 py-1 text-xs font-medium text-white transition hover:bg-[#b88912]"
        >
          Leave review
        </button>
      )}
    </div>
  </article>
)

const PastHostedGameGroup = ({ game, onLeaveReview }) => {
  const [open, setOpen] = useState(false)
  const participants = game.participants ?? []

  return (
    <div className="space-y-2.5">
      <div className="flex w-full items-center gap-3 rounded-xl border border-line/80 bg-white px-4 py-3.5 shadow-[0_1px_2px_rgba(26,46,38,0.04)] sm:px-5">
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
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

        {game.needsReview && (
          <span className="shrink-0 rounded-full bg-[#d4a017] px-2.5 py-1 text-xs font-medium text-white">
            Review pending
          </span>
        )}

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
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

      {open && participants.length > 0 && (
        <div className="space-y-2.5">
          {participants.map((participant) => (
            <ParticipantCard
              key={participant.id}
              participant={participant}
              game={game}
              onLeaveReview={onLeaveReview}
            />
          ))}
        </div>
      )}

      {open && participants.length === 0 && (
        <div className="rounded-xl border border-line/80 bg-white px-5 py-8 text-center text-sm text-muted shadow-[0_1px_2px_rgba(26,46,38,0.04)]">
          No participants for this game.
        </div>
      )}
    </div>
  )
}

export default PastHostedGameGroup
