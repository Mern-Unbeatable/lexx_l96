import { useState } from 'react'
import { ChevronDown, Star } from 'lucide-react'

const hostedGames = [
  {
    id: 1,
    course: 'Sunningdale Golf Club',
    date: 'Saturday 19 Jul',
    time: '08:30',
    pending: 2,
    requests: [
      {
        id: 'r1',
        initials: 'TB',
        name: 'Tom B.',
        age: 42,
        handicap: 12,
        rating: 4.7,
        reviews: 3,
        message: 'Looking forward to a good round!',
      },
      {
        id: 'r2',
        initials: 'SM',
        name: 'Sarah M.',
        age: 38,
        handicap: 8,
        rating: null,
        reviews: 0,
        message: 'Happy to share a buggy if needed.',
      },
    ],
  },
  {
    id: 2,
    course: 'Wentworth Club',
    date: 'Sunday 20 Jul',
    time: '09:15',
    pending: 1,
    requests: [
      {
        id: 'r3',
        initials: 'JK',
        name: 'James K.',
        age: 45,
        handicap: 14,
        rating: 4.2,
        reviews: 5,
        message: 'Prefer walking if the weather holds.',
      },
    ],
  },
]

const pastGames = [
  {
    id: 3,
    course: 'Royal St George\'s',
    date: 'Friday 4 Jul',
    time: '07:45',
    pending: 0,
    needsReview: true,
    requests: [],
  },
]

function Stars({ rating }) {
  const filled = Math.round(rating ?? 0)
  return (
    <span className="inline-flex items-center gap-0.5" aria-hidden="true">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={12}
          strokeWidth={0}
          className={n <= filled ? 'fill-forest text-forest' : 'fill-line text-line'}
        />
      ))}
    </span>
  )
}

function RequestCard({ request }) {
  return (
    <article className="rounded-xl border border-line/70 bg-white p-4 shadow-[0_1px_3px_rgba(26,46,38,0.05)] sm:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex min-w-0 flex-1 gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#ebe8e1] text-sm font-semibold text-ink">
            {request.initials}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-ink">{request.name}</p>
            <p className="mt-0.5 text-sm text-muted">
              Age {request.age} · Handicap {request.handicap}
            </p>
            {request.reviews > 0 ? (
              <p className="mt-1.5 flex flex-wrap items-center gap-1.5 text-sm text-ink">
                <span className="font-medium">{request.rating.toFixed(1)}</span>
                <Stars rating={request.rating} />
                <span className="text-muted">· {request.reviews} reviews</span>
              </p>
            ) : (
              <p className="mt-1.5 text-sm text-muted">No reviews yet</p>
            )}
          </div>
        </div>

        <div className="min-w-0 flex-1 lg:px-4">
          <p className="text-[11px] font-medium uppercase tracking-wide text-muted">
            Message
          </p>
          <p className="mt-1 font-serif text-[15px] italic leading-relaxed text-ink/80">
            &ldquo;{request.message}&rdquo;
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2 self-stretch lg:self-center">
          <button
            type="button"
            className="rounded-lg border border-line bg-white px-4 py-2 text-sm font-medium text-ink transition hover:bg-cream"
          >
            Decline
          </button>
          <button
            type="button"
            className="rounded-lg bg-forest px-4 py-2 text-sm font-medium text-white transition hover:bg-[#244a37]"
          >
            Accept
          </button>
        </div>
      </div>
    </article>
  )
}

function GameGroup({ game, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <section className="overflow-hidden rounded-xl border border-line/70 bg-[#f3f1eb]/70">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-3 px-4 py-3.5 text-left sm:px-5"
      >
        <span className="size-3.5 shrink-0 rounded-[3px] bg-forest" aria-hidden="true" />
        <span className="min-w-0 flex-1">
          <span className="font-semibold text-ink">{game.course}</span>
          <span className="text-muted">
            {' '}
            · {game.date} · {game.time}
          </span>
        </span>
        {game.pending > 0 && (
          <span className="rounded-full bg-forest px-2.5 py-1 text-xs font-medium text-white">
            {game.pending} pending
          </span>
        )}
        {game.needsReview && (
          <span className="rounded-full bg-[#d4a017] px-2.5 py-1 text-xs font-medium text-white">
            Review
          </span>
        )}
        <ChevronDown
          size={18}
          strokeWidth={1.75}
          className={`shrink-0 text-muted transition ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && game.requests.length > 0 && (
        <div className="space-y-3 border-t border-line/60 bg-cream/40 p-3 sm:p-4">
          {game.requests.map((request) => (
            <RequestCard key={request.id} request={request} />
          ))}
        </div>
      )}

      {open && game.requests.length === 0 && (
        <div className="border-t border-line/60 px-5 py-8 text-center text-sm text-muted">
          {game.needsReview
            ? 'Leave a review for your playing partners.'
            : 'No pending requests.'}
        </div>
      )}
    </section>
  )
}

export default function MyGames() {
  const [tab, setTab] = useState('hosting')
  const games = tab === 'hosting' ? hostedGames : pastGames
  const upcomingCount = hostedGames.length

  return (
    <div className="flex min-h-[calc(100vh-4.5rem)] flex-col">
      <div className="mx-auto w-full container flex-1 px-4 py-8 sm:px-6 sm:py-10">
        <header>
          <h1 className="font-serif text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
            My Games
          </h1>
          <p className="mt-2 text-sm text-muted sm:text-[15px]">
            Manage your hosted games and review your playing partners
          </p>
        </header>

        <div className="mt-6 flex gap-6 border-b border-line">
          <button
            type="button"
            onClick={() => setTab('hosting')}
            className={`inline-flex items-center gap-2 border-b-2 pb-3 text-sm transition ${
              tab === 'hosting'
                ? 'border-ink font-semibold text-ink'
                : 'border-transparent text-muted hover:text-ink'
            }`}
          >
            Hosting
            <span className="flex size-5 items-center justify-center rounded-full bg-forest text-[11px] font-semibold text-white">
              3
            </span>
          </button>
          <button
            type="button"
            onClick={() => setTab('past')}
            className={`inline-flex items-center gap-2 border-b-2 pb-3 text-sm transition ${
              tab === 'past'
                ? 'border-ink font-semibold text-ink'
                : 'border-transparent text-muted hover:text-ink'
            }`}
          >
            Past Games
            <span className="rounded-full bg-[#e8c44a] px-2 py-0.5 text-[11px] font-semibold text-ink">
              1 to review
            </span>
          </button>
        </div>

        <p className="mt-6 text-xs font-medium uppercase tracking-wider text-muted">
          {tab === 'hosting'
            ? `${upcomingCount} Upcoming Games`
            : 'Past Games'}
        </p>

        <div className="mt-4 space-y-4">
          {games.map((game) => (
            <GameGroup key={game.id} game={game} />
          ))}
        </div>
      </div>

      <footer className="py-8 text-center text-xs text-muted">
        © 2026 Golf Links · Premium Pairings
      </footer>
    </div>
  )
}
