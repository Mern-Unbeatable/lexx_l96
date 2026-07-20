import { useMemo } from 'react'
import PastHostedGameGroup from './PastHostedGameGroup'
import { useMyPastHostedGames } from '../../../hooks/useMyPastHostedGames'
import { mapPastHostedGame } from '../utils/pastHostedGameMapper'

const PastHostedGames = ({ hostedCount, onLeaveReview }) => {
  const pastHostedQuery = useMyPastHostedGames()
  const games = useMemo(
    () => (pastHostedQuery.data?.games ?? []).map(mapPastHostedGame),
    [pastHostedQuery.data?.games],
  )
  const totalItems =
    pastHostedQuery.data?.pagination?.totalItems ?? hostedCount ?? games.length

  return (
    <>
      <p className="mt-6 text-sm font-medium uppercase tracking-wider text-muted">
        {totalItems} Past Hosted Games
      </p>

      {pastHostedQuery.isPending && (
        <div className="mt-4 rounded-xl border border-line/60 bg-white px-6 py-12 text-center text-sm text-muted">
          Loading past hosted games…
        </div>
      )}

      {pastHostedQuery.isError && (
        <div className="mt-4 rounded-xl border border-red-200 bg-white px-6 py-12 text-center">
          <p className="text-sm text-red-500">
            {pastHostedQuery.error?.message ||
              'Unable to load past hosted games.'}
          </p>
          <button
            type="button"
            onClick={() => pastHostedQuery.refetch()}
            className="mt-4 rounded-lg bg-forest px-4 py-2.5 text-sm font-medium text-white"
          >
            Try Again
          </button>
        </div>
      )}

      {!pastHostedQuery.isPending &&
        !pastHostedQuery.isError &&
        games.length === 0 && (
          <div className="mt-4 rounded-xl border border-line/60 bg-white px-6 py-12 text-center text-sm text-muted">
            No past hosted games.
          </div>
        )}

      {!pastHostedQuery.isError && games.length > 0 && (
        <div className="mt-4 space-y-5">
          {games.map((game) => (
            <PastHostedGameGroup
              key={game.id}
              game={game}
              onLeaveReview={onLeaveReview}
            />
          ))}
        </div>
      )}
    </>
  )
}

export default PastHostedGames
