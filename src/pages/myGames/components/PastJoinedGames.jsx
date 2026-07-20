import { useMemo } from 'react'
import JoinedRequestCard from './JoinedRequestCard'
import { useMyPastJoinedGames } from '../../../hooks/useMyPastJoinedGames'
import { mapPastJoinedRequest } from '../utils/joinedRequestMapper'

const PastJoinedGames = ({ joinedCount, onOpenChat }) => {
  const pastJoinedQuery = useMyPastJoinedGames()
  const requests = useMemo(
    () => (pastJoinedQuery.data?.requests ?? []).map(mapPastJoinedRequest),
    [pastJoinedQuery.data?.requests],
  )
  const totalItems =
    pastJoinedQuery.data?.pagination?.totalItems ?? joinedCount ?? requests.length

  return (
    <>
      <p className="mt-6 text-sm font-medium uppercase tracking-wider text-muted">
        {totalItems} Past Joined Games
      </p>

      {pastJoinedQuery.isPending && (
        <div className="mt-4 rounded-xl border border-line/60 bg-white px-6 py-12 text-center text-sm text-muted">
          Loading past joined games…
        </div>
      )}

      {pastJoinedQuery.isError && (
        <div className="mt-4 rounded-xl border border-red-200 bg-white px-6 py-12 text-center">
          <p className="text-sm text-red-500">
            {pastJoinedQuery.error?.message ||
              'Unable to load past joined games.'}
          </p>
          <button
            type="button"
            onClick={() => pastJoinedQuery.refetch()}
            className="mt-4 rounded-lg bg-forest px-4 py-2.5 text-sm font-medium text-white"
          >
            Try Again
          </button>
        </div>
      )}

      {!pastJoinedQuery.isPending &&
        !pastJoinedQuery.isError &&
        requests.length === 0 && (
          <div className="mt-4 rounded-xl border border-line/60 bg-white px-6 py-12 text-center text-sm text-muted">
            No past joined games.
          </div>
        )}

      {!pastJoinedQuery.isError && requests.length > 0 && (
        <div className="mt-4 space-y-5">
          {requests.map((item) => (
            <JoinedRequestCard
              key={item.id}
              item={item}
              onOpenChat={onOpenChat}
            />
          ))}
        </div>
      )}
    </>
  )
}

export default PastJoinedGames
