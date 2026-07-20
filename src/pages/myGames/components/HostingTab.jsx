import { useMemo } from 'react'
import GameGroup from './GameGroup'
import PaymentInfoBox from '../../../components/PaymentInfoBox'
import { useMyHostingGames } from '../../../hooks/useMyHostingGames'
import { mapHostingGame } from '../utils/hostingGameMapper'

const HostingTab = ({
  upcomingCount,
  acceptedIds,
  declinedIds,
  onAccept,
  onDecline,
  onOpenChat,
}) => {
  const hostingQuery = useMyHostingGames()
  const games = useMemo(
    () => (hostingQuery.data?.games ?? []).map(mapHostingGame),
    [hostingQuery.data?.games],
  )
  const totalItems =
    hostingQuery.data?.pagination?.totalItems ?? upcomingCount ?? games.length

  return (
    <>
      <div className="mt-6">
        <PaymentInfoBox />
      </div>

      <p className="mt-6 text-sm font-medium uppercase tracking-wider text-muted">
        {totalItems} Upcoming Games
      </p>

      {hostingQuery.isPending && (
        <div className="mt-4 rounded-xl border border-line/60 bg-white px-6 py-12 text-center text-sm text-muted">
          Loading hosted games…
        </div>
      )}

      {hostingQuery.isError && (
        <div className="mt-4 rounded-xl border border-red-200 bg-white px-6 py-12 text-center">
          <p className="text-sm text-red-500">
            {hostingQuery.error?.message || 'Unable to load hosted games.'}
          </p>
          <button
            type="button"
            onClick={() => hostingQuery.refetch()}
            className="mt-4 rounded-lg bg-forest px-4 py-2.5 text-sm font-medium text-white"
          >
            Try Again
          </button>
        </div>
      )}

      {!hostingQuery.isPending &&
        !hostingQuery.isError &&
        games.length === 0 && (
          <div className="mt-4 rounded-xl border border-line/60 bg-white px-6 py-12 text-center text-sm text-muted">
            No upcoming hosted games.
          </div>
        )}

      {!hostingQuery.isError && games.length > 0 && (
        <div className="mt-4 space-y-5">
          {games.map((game) => (
            <GameGroup
              key={game.id}
              game={game}
              acceptedIds={acceptedIds}
              declinedIds={declinedIds}
              onAccept={onAccept}
              onDecline={onDecline}
              onOpenChat={onOpenChat}
            />
          ))}
        </div>
      )}
    </>
  )
}

export default HostingTab
