import { useMemo } from 'react'
import JoinedRequestCard from './JoinedRequestCard'
import PaymentInfoBox from '../../../components/PaymentInfoBox'
import { useMyJoinedGames } from '../../../hooks/useMyJoinedGames'
import { mapJoinedRequest } from '../utils/joinedRequestMapper'

const JoinedTab = ({ joinedCount, onOpenChat }) => {
  const joinedQuery = useMyJoinedGames()
  const requests = useMemo(
    () => (joinedQuery.data?.requests ?? []).map(mapJoinedRequest),
    [joinedQuery.data?.requests],
  )
  const totalItems =
    joinedQuery.data?.pagination?.totalItems ?? joinedCount ?? requests.length

  return (
    <>
      <div className="mt-6">
        <PaymentInfoBox />
      </div>

      <p className="mt-6 text-sm font-medium uppercase tracking-wider text-muted">
        {totalItems} Join Requests
      </p>

      {joinedQuery.isPending && (
        <div className="mt-4 rounded-xl border border-line/60 bg-white px-6 py-12 text-center text-sm text-muted">
          Loading join requests…
        </div>
      )}

      {joinedQuery.isError && (
        <div className="mt-4 rounded-xl border border-red-200 bg-white px-6 py-12 text-center">
          <p className="text-sm text-red-500">
            {joinedQuery.error?.message || 'Unable to load join requests.'}
          </p>
          <button
            type="button"
            onClick={() => joinedQuery.refetch()}
            className="mt-4 rounded-lg bg-forest px-4 py-2.5 text-sm font-medium text-white"
          >
            Try Again
          </button>
        </div>
      )}

      {!joinedQuery.isPending &&
        !joinedQuery.isError &&
        requests.length === 0 && (
          <div className="mt-4 rounded-xl border border-line/60 bg-white px-6 py-12 text-center text-sm text-muted">
            No join requests yet.
          </div>
        )}

      {!joinedQuery.isError && requests.length > 0 && (
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

export default JoinedTab
