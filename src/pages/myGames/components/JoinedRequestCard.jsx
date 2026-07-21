import { LandPlot, MapPin, MessageCircle } from 'lucide-react'
import Stars from './Stars'

const statusStyles = {
  accepted: 'bg-[#e8f0ea] text-forest',
  completed: 'bg-[#e8f0ea] text-forest',
  pending: 'bg-[#f0eeea] text-muted',
}

const JoinedRequestCard = ({ item, onOpenChat, onLeaveReview }) => {
  const showChat = item.canChat ?? item.status === 'accepted'
  const isPastGame =
    item.isPast || item.status === 'completed' || item.status === 'accepted'

  return (
    <article className="rounded-xl border border-line/80 bg-white p-4 shadow-[0_1px_2px_rgba(26,46,38,0.04)] sm:p-5">
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <div className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#e8f0ea] text-forest">
              <LandPlot size={18} strokeWidth={1.75} aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-ink">{item.course}</p>
              <p className="mt-0.5 text-sm text-muted">
                {item.date} · {item.time}
              </p>
              {item.location && (
                <p className="mt-1.5 flex items-center gap-1.5 text-sm text-muted">
                  <MapPin
                    size={14}
                    strokeWidth={1.75}
                    className="shrink-0 text-forest"
                    aria-hidden="true"
                  />
                  <span>{item.location}</span>
                </p>
              )}
            </div>
          </div>
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${statusStyles[item.status]}`}
          >
            {item.status}
          </span>
        </div>

        <div className="flex flex-col gap-4 border-t border-line/70 pt-4 lg:flex-row lg:items-center lg:gap-6">
          <div className="flex min-w-0 flex-1 items-start gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#ebe8e1] text-sm font-semibold text-ink">
              {item.host.initials}
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-medium uppercase tracking-wide text-muted">
                Host
              </p>
              <p className="font-semibold text-ink">{item.host.name}</p>
              <p className="mt-0.5 text-sm text-muted">
                Age {item.host.age} · Handicap {item.host.handicap}
              </p>
              {item.host.reviews > 0 ? (
                <p className="mt-1.5 flex flex-wrap items-center gap-1.5 text-sm text-muted">
                  <Stars rating={item.host.rating} />
                  <span>
                    {item.host.rating.toFixed(1)} · {item.host.reviews} reviews
                  </span>
                </p>
              ) : (
                <p className="mt-1.5 text-sm text-muted">No reviews yet</p>
              )}
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-medium uppercase tracking-wide text-muted">
              Your message
            </p>
            <p className="mt-1 text-[15px] italic leading-relaxed text-ink/75">
              &ldquo;{item.message}&rdquo;
            </p>
          </div>

          <div className="flex shrink-0 items-center justify-end">
            {item.isPast && item.needsReview ? (
              <button
                type="button"
                onClick={() =>
                  onLeaveReview?.({
                    id: item.gameId,
                    course: item.course,
                    date: item.date,
                    time: item.time,
                    host: item.host,
                  })
                }
                className="rounded-full bg-[#d4a017] px-3 py-1 text-xs font-medium text-white transition hover:bg-[#b88912]"
              >
                Leave review
              </button>
            ) : item.isPast && item.hostReviewed ? (
              <div className="text-right">
                <span className="rounded-full bg-[#e8f0ea] px-2.5 py-1 text-xs font-medium text-forest">
                  Reviewed
                </span>
                {item.givenRating !== null && (
                  <p className="mt-1.5 flex items-center justify-end gap-1.5 text-sm text-muted">
                    <Stars rating={item.givenRating} />
                    <span>{item.givenRating.toFixed(1)}</span>
                  </p>
                )}
              </div>
            ) : showChat ? (
              <button
                type="button"
                onClick={() => onOpenChat?.(item.host, item)}
                className="inline-flex items-center gap-2 rounded-lg bg-forest px-4 py-2 text-sm font-medium text-white transition hover:bg-[#244a37]"
              >
                <MessageCircle size={16} strokeWidth={1.75} />
                Chat
              </button>
            ) : isPastGame ? (
              <p className="text-sm text-muted">Game completed</p>
            ) : (
              <p className="text-sm text-muted">Awaiting hosts approval</p>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}

export default JoinedRequestCard
