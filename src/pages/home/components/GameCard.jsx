import { useNavigate } from 'react-router-dom'
import { MapPin } from 'lucide-react'
import { useAuth } from '../../../context/AuthContext'

const Detail = ({ label, value }) => (
  <div>
    <p className="text-xs uppercase tracking-wide text-muted">{label}</p>
    <p className="mt-1 text-[15px] font-medium text-ink">{value}</p>
  </div>
)

const getGameAvailability = (game) => {
  const spotsLeft = Number(game.spotsLeft) || 0
  const status = String(game.status || '').toUpperCase()

  if (status === 'CANCELLED') {
    return {
      canJoin: false,
      badge: 'Cancelled',
      badgeClass: 'bg-red-50 text-red-700',
      spotsDisplay: 'This game was cancelled',
      buttonLabel: 'Game cancelled',
    }
  }

  if (status === 'FULL' || spotsLeft <= 0) {
    return {
      canJoin: false,
      badge: 'Full',
      badgeClass: 'bg-amber-50 text-amber-800',
      spotsDisplay: 'All spots taken',
      buttonLabel: 'All spots filled',
    }
  }

  const spotLabel = spotsLeft === 1 ? 'spot' : 'spots'

  return {
    canJoin: status === 'OPEN',
    badge: `${spotsLeft} ${spotLabel} left`,
    badgeClass: 'bg-[#f0eeea] text-muted',
    spotsDisplay: `${spotsLeft} ${spotLabel} left`,
    buttonLabel: 'Request to Join',
  }
}

const GameCard = ({ game, onRequestJoin }) => {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const { canJoin, badge, badgeClass, spotsDisplay, buttonLabel } =
    getGameAvailability(game)
  const needsLogin = canJoin && !isAuthenticated
  const actionLabel = needsLogin ? 'Log in to join this game' : buttonLabel

  const handleActionClick = () => {
    if (!canJoin) return

    if (needsLogin) {
      navigate('/login')
      return
    }

    onRequestJoin?.(game)
  }

  return (
    <article className="rounded-xl border border-line/60 bg-white p-6 shadow-[0_1px_3px_rgba(26,46,38,0.06)] sm:p-8">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#ebe8e1] text-sm font-semibold text-ink">
            {game.host.initials}
          </div>
          <div className="min-w-0">
            <p className="truncate font-semibold text-ink">{game.host.name}</p>
            <p className="text-sm text-muted">
              Handicap {game.host.handicap ?? '—'}
            </p>
          </div>
        </div>
        <span
          className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${badgeClass}`}
        >
          {badge}
        </span>
      </div>

      <div className="mt-7">
        <p className="text-xs uppercase tracking-wide text-muted">Course</p>
        <h2 className="mt-1 text-xl font-semibold tracking-tight text-ink sm:text-2xl">
          {game.course}
        </h2>
        {game.locationName && (
          <p className="mt-2 flex items-start gap-1.5 text-sm leading-relaxed text-muted">
            <MapPin size={15} className="mt-0.5 shrink-0" />
            <span>{game.locationName}</span>
          </p>
        )}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-x-8 gap-y-5">
        <Detail label="Date" value={game.date} />
        <Detail label="Time" value={game.time} />
        <Detail label="Age Range" value={game.ageRange} />
        <Detail label="Handicap Range" value={game.handicapRange} />
        <Detail label="Cost" value={game.cost} />
        <Detail label="Spots Available" value={spotsDisplay} />
      </div>

      {game.notes && (
        <div className="mt-6">
          <p className="text-xs uppercase tracking-wide text-muted">Notes</p>
          <p className="mt-1 text-[15px] leading-relaxed text-muted">
            {game.notes}
          </p>
        </div>
      )}

      {typeof onRequestJoin === 'function' && (
        <button
          type="button"
          disabled={!canJoin}
          onClick={handleActionClick}
          className="mt-8 w-full rounded-lg bg-forest px-4 py-3.5 text-center text-[15px] font-medium text-white transition hover:bg-[#244a37] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {actionLabel}
        </button>
      )}
    </article>
  )
}

export default GameCard
