import { useMemo, useState } from 'react'
import { MapPin, X } from 'lucide-react'
import PaymentInfoBox from '../../components/PaymentInfoBox'
import DateFilterPicker from './components/DateFilterPicker'
import LocationPreferencesModal from './components/LocationPreferencesModal'
import RequestToJoinModal from './components/RequestToJoinModal'
import GameCard from './components/GameCard'
import { useGames } from '../../hooks/useGames'
import { useRequestToJoinMutation } from '../../hooks/useRequestToJoinMutation'
import { mapApiGame } from './utils/gameMapper'
import { showErrorAlert, showSuccessToast } from '../../utils/toast'

const GAMES_PER_PAGE = 6

const EMPTY_GAME_FILTERS = {
  location: '',
  radius: '',
  latitude: null,
  longitude: null,
  date: '',
}

const todayIso = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const formatFilterDate = (isoDate) => {
  const [year, month, day] = isoDate.split('-').map(Number)
  const date = new Date(Date.UTC(year, month - 1, day))
  if (Number.isNaN(date.getTime())) return isoDate

  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    timeZone: 'UTC',
  }).format(date)
}

const Home = () => {
  const joinMutation = useRequestToJoinMutation()
  const [locationOpen, setLocationOpen] = useState(false)
  const [selectedGame, setSelectedGame] = useState(null)
  const [gameFilters, setGameFilters] = useState(EMPTY_GAME_FILTERS)
  const gamesQuery = useGames({
    limit: GAMES_PER_PAGE,
    latitude: gameFilters.latitude,
    longitude: gameFilters.longitude,
    radiusKm: gameFilters.radius || undefined,
    date: gameFilters.date || undefined,
  })
  const games = useMemo(() => {
    const mapped = (gamesQuery.data?.pages ?? [])
      .flatMap((page) => page.games)
      .map(mapApiGame)

    if (!gameFilters.date) return mapped

    return mapped.filter((game) => game.dateIso === gameFilters.date)
  }, [gamesQuery.data?.pages, gameFilters.date])
  const hasMoreGames = gamesQuery.hasNextPage
  const isInitialLoading = gamesQuery.isPending
  const isLoadingMore = gamesQuery.isFetchingNextPage

  const hasLocationFilter = gameFilters.latitude != null
  const hasDateFilter = Boolean(gameFilters.date)
  const hasActiveFilters = hasLocationFilter || hasDateFilter

  const handleApplyLocationPrefs = (locationPrefs) => {
    setGameFilters((prev) => ({
      ...prev,
      ...locationPrefs,
    }))
  }

  const handleClearFilters = () => {
    setGameFilters(EMPTY_GAME_FILTERS)
  }

  const handleDateChange = (date) => {
    setGameFilters((prev) => ({ ...prev, date }))
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

  const filterSubtitleParts = []
  if (gameFilters.location) {
    filterSubtitleParts.push(
      `Near ${gameFilters.location}${
        gameFilters.radius ? ` (${gameFilters.radius} km)` : ''
      }`,
    )
  }
  if (hasDateFilter) {
    filterSubtitleParts.push(`On ${formatFilterDate(gameFilters.date)}`)
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
            {filterSubtitleParts.length > 0
              ? ` · ${filterSubtitleParts.join(' · ')}`
              : ''}
          </p>
        </div>

        <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleClearFilters}
              className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-line bg-white px-3 text-xs text-ink transition hover:bg-cream sm:h-[38px] sm:gap-2 sm:px-3.5 sm:text-sm"
            >
              <X
                size={16}
                strokeWidth={1.75}
                className="size-3.5 shrink-0 text-muted sm:size-4"
              />
              Clear filter
            </button>
          )}
          <div className="flex items-center gap-2 max-sm:ml-auto">
            <button
              type="button"
              onClick={() => setLocationOpen(true)}
              className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-line bg-white px-3 text-xs text-ink transition hover:bg-cream sm:h-[38px] sm:gap-2 sm:px-3.5 sm:text-sm"
            >
              <MapPin
                size={16}
                strokeWidth={1.75}
                className="size-3.5 shrink-0 text-muted sm:size-4"
              />
              {hasLocationFilter ? 'Change location' : 'Find my Location'}
            </button>
            <DateFilterPicker
              value={gameFilters.date}
              onChange={handleDateChange}
              minDate={todayIso()}
              hasActiveFilter={hasDateFilter}
            />
          </div>
        </div>
      </header>

      <div className="mt-6">
        <PaymentInfoBox />
      </div>

      <section className="mt-8" aria-live="polite">
        {isInitialLoading && (
          <div className="rounded-xl border border-line/60 bg-white px-6 py-12 text-center text-sm text-muted">
            Loading games…
          </div>
        )}

        {gamesQuery.isError && !isInitialLoading && (
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

        {!isInitialLoading && !gamesQuery.isError && games.length === 0 && (
          <div className="rounded-xl border border-line/60 bg-white px-6 py-12 text-center text-sm text-muted">
            <p>
              {hasActiveFilters
                ? 'No games found matching your filters.'
                : 'No open games found.'}
            </p>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleClearFilters}
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

        {hasMoreGames && games.length > 0 && (
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={() => gamesQuery.fetchNextPage()}
              disabled={isLoadingMore}
              className="rounded-lg border border-line bg-white px-6 py-3 text-sm font-medium text-ink transition hover:bg-cream disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoadingMore ? 'Loading more games…' : 'Load more games'}
            </button>
          </div>
        )}
      </section>

      <LocationPreferencesModal
        open={locationOpen}
        onClose={() => setLocationOpen(false)}
        initialLocation={gameFilters.location}
        initialRadius={gameFilters.radius}
        initialLatitude={gameFilters.latitude}
        initialLongitude={gameFilters.longitude}
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
