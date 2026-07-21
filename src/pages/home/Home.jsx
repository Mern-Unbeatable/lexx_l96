import { useMemo, useState } from 'react'
import { MapPin, X } from 'lucide-react'
import PaymentInfoBox from '../../components/PaymentInfoBox'
import LocationPreferencesModal from './components/LocationPreferencesModal'
import RequestToJoinModal from './components/RequestToJoinModal'
import GameCard from './components/GameCard'
import GamesPagination from './components/GamesPagination'
import { useGames } from '../../hooks/useGames'
import { useRequestToJoinMutation } from '../../hooks/useRequestToJoinMutation'
import { mapApiGame } from './utils/gameMapper'
import { showErrorAlert, showSuccessToast } from '../../utils/toast'

const GAMES_PER_PAGE = 5

const EMPTY_LOCATION_PREFS = {
  location: '',
  radius: '',
  latitude: null,
  longitude: null,
}

const Home = () => {
  const joinMutation = useRequestToJoinMutation()
  const [page, setPage] = useState(1)
  const [locationOpen, setLocationOpen] = useState(false)
  const [selectedGame, setSelectedGame] = useState(null)
  const [locationPrefs, setLocationPrefs] = useState(EMPTY_LOCATION_PREFS)
  const gamesQuery = useGames({
    page,
    limit: GAMES_PER_PAGE,
    latitude: locationPrefs.latitude,
    longitude: locationPrefs.longitude,
    radiusKm: locationPrefs.radius || undefined,
  })
  const games = useMemo(
    () => (gamesQuery.data?.games ?? []).map(mapApiGame),
    [gamesQuery.data?.games],
  )
  const pagination = gamesQuery.data?.pagination

  const handlePageChange = (nextPage) => {
    setPage(nextPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const hasLocationFilter = locationPrefs.latitude != null

  const handleApplyLocationPrefs = (prefs) => {
    setLocationPrefs(prefs)
    setPage(1)
  }

  const handleClearLocationFilter = () => {
    setLocationPrefs(EMPTY_LOCATION_PREFS)
    setPage(1)
  }

  const handleRequestJoinClick = (game) => {
    setSelectedGame(game)
  }

  const handleJoinRequest = async ({ message, game }) => {
    try {
      await joinMutation.mutateAsync({
        gameId: game.id,
        message,
      })
      showSuccessToast('Join request sent successfully.')
    } catch (error) {
      await showErrorAlert(error?.message || 'Unable to send join request.')
      throw error
    }
  }

  return (
    <div className="mx-auto container px-4 py-8 sm:px-6 sm:py-10">
      <header className="flex flex-col gap-5 border-b border-line pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-serif text-4xl font-bold text-ink sm:text-5xl">
            Find a Game
          </h1>
          <p className="mt-2 text-base text-muted">
            Browse available games
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
          {hasLocationFilter && (
            <button
              type="button"
              onClick={handleClearLocationFilter}
              className="inline-flex items-center gap-2 rounded-lg border border-line bg-white px-3.5 py-2 text-sm text-ink transition hover:bg-cream"
            >
              <X size={16} strokeWidth={1.75} className="text-muted" />
              Clear filter
            </button>
          )}
          <button
            type="button"
            onClick={() => setLocationOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg border border-line bg-white px-3.5 py-2 text-sm text-ink transition hover:bg-cream"
          >
            <MapPin size={16} strokeWidth={1.75} className="text-muted" />
            {hasLocationFilter ? 'Change location' : 'Find my Location'}
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
            <p>
              {hasLocationFilter
                ? 'No games found within your selected area.'
                : 'No open games found.'}
            </p>
            {hasLocationFilter && (
              <button
                type="button"
                onClick={handleClearLocationFilter}
                className="mt-4 rounded-lg border border-line bg-white px-4 py-2.5 text-sm font-medium text-ink transition hover:bg-cream"
              >
                Show all games
              </button>
            )}
          </div>
        )}

        {!gamesQuery.isError && games.length > 0 && (
          <div className="space-y-5">
            {games.map((game) => (
              <GameCard
                key={game.id}
                game={game}
                onRequestJoin={handleRequestJoinClick}
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
        initialLatitude={locationPrefs.latitude}
        initialLongitude={locationPrefs.longitude}
        onApply={handleApplyLocationPrefs}
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
