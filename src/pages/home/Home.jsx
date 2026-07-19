import { useMemo, useState } from 'react'
import { MapPin } from 'lucide-react'
import PaymentInfoBox from '../../components/PaymentInfoBox'
import LocationPreferencesModal from './components/LocationPreferencesModal'
import RequestToJoinModal from './components/RequestToJoinModal'
import GameCard from './components/GameCard'
import GamesPagination from './components/GamesPagination'
import { useGames } from '../../hooks/useGames'
import { useAuth } from '../../context/AuthContext'
import { mapApiGame } from './utils/gameMapper'
import { showInfoAlert } from '../../utils/toast'

const GAMES_PER_PAGE = 5

const Home = () => {
  const { user } = useAuth()
  const [page, setPage] = useState(1)
  const [locationOpen, setLocationOpen] = useState(false)
  const [selectedGame, setSelectedGame] = useState(null)
  const [locationPrefs, setLocationPrefs] = useState({
    location: '',
    radius: '',
  })
  const gamesQuery = useGames({ page, limit: GAMES_PER_PAGE })
  const games = useMemo(
    () => (gamesQuery.data?.games ?? []).map(mapApiGame),
    [gamesQuery.data?.games],
  )
  const pagination = gamesQuery.data?.pagination

  const handlePageChange = (nextPage) => {
    setPage(nextPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleJoinRequest = () =>
    showInfoAlert('Join request API is not connected yet.')

  return (
    <div className="mx-auto container px-4 py-8 sm:px-6 sm:py-10">
      <header className="flex flex-col gap-5 border-b border-line pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-serif text-4xl font-bold text-ink sm:text-5xl">
            Find a Game
          </h1>
          <p className="mt-2 text-base text-muted">
            {user
              ? `Your profile: Age ${user.age ?? user.personalInfo?.age ?? '—'} · Handicap ${
                  user.currentHandicap ?? '—'
                }`
              : 'Browse available games'}
            {locationPrefs.location
              ? ` · Near ${locationPrefs.location}${
                  locationPrefs.radius
                    ? ` (${locationPrefs.radius} km)`
                    : ''
                }`
              : ''}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setLocationOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg border border-line bg-white px-3.5 py-2 text-sm text-ink transition hover:bg-cream"
          >
            <MapPin size={16} strokeWidth={1.75} className="text-muted" />
            Find my Location
          </button>
        </div>
      </header>

      <div className="mt-6">
        <PaymentInfoBox />
      </div>

      <section className="mt-8" aria-live="polite">
        {gamesQuery.isPending && (
          <div className="rounded-xl border border-line/60 bg-white px-6 py-12 text-center text-sm text-muted">
            Loading games…
          </div>
        )}

        {gamesQuery.isError && (
          <div className="rounded-xl border border-red-200 bg-white px-6 py-12 text-center">
            <p className="text-sm text-red-500">
              {gamesQuery.error?.message || 'Unable to load games.'}
            </p>
            <button
              type="button"
              onClick={() => gamesQuery.refetch()}
              className="mt-4 rounded-lg bg-forest px-4 py-2.5 text-sm font-medium text-white"
            >
              Try Again
            </button>
          </div>
        )}

        {!gamesQuery.isPending && !gamesQuery.isError && games.length === 0 && (
          <div className="rounded-xl border border-line/60 bg-white px-6 py-12 text-center text-sm text-muted">
            No open games found.
          </div>
        )}

        {!gamesQuery.isError && games.length > 0 && (
          <div className="space-y-5">
            {games.map((game) => (
              <GameCard
                key={game.id}
                game={game}
                onRequestJoin={setSelectedGame}
              />
            ))}
          </div>
        )}

        {pagination && (
          <GamesPagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            hasPrevious={pagination.hasPrevious}
            hasNext={pagination.hasNext}
            disabled={gamesQuery.isFetching}
            onPageChange={handlePageChange}
          />
        )}
      </section>

      <LocationPreferencesModal
        open={locationOpen}
        onClose={() => setLocationOpen(false)}
        initialLocation={locationPrefs.location}
        initialRadius={locationPrefs.radius}
        onApply={setLocationPrefs}
      />

      <RequestToJoinModal
        open={Boolean(selectedGame)}
        game={selectedGame}
        onClose={() => setSelectedGame(null)}
        onSubmit={handleJoinRequest}
      />
    </div>
  )
}

export default Home
