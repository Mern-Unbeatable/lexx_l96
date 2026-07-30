import { useMemo, useState } from 'react'
import Swal from 'sweetalert2'
import GameGroup from './GameGroup'
import PaymentInfoBox from '../../../components/PaymentInfoBox'
import { useMyHostingGames } from '../../../hooks/useMyHostingGames'
import { useAcceptJoinRequestMutation } from '../../../hooks/useAcceptJoinRequestMutation'
import { useDeclineJoinRequestMutation } from '../../../hooks/useDeclineJoinRequestMutation'
import { useDeleteGameMutation } from '../../../hooks/useDeleteGameMutation'
import { mapHostingGame } from '../utils/hostingGameMapper'
import { showAcceptSuccess } from '../../../utils/acceptFeedback'
import { showErrorAlert, showSuccessToast } from '../../../utils/toast'

const HostingTab = ({
  upcomingCount,
  onOpenChat,
  onViewReviews,
}) => {
  const [acceptedIds, setAcceptedIds] = useState(() => new Set())
  const [declinedIds, setDeclinedIds] = useState(() => new Set())
  const [deletingGameId, setDeletingGameId] = useState(null)
  const acceptMutation = useAcceptJoinRequestMutation()
  const declineMutation = useDeclineJoinRequestMutation()
  const deleteGameMutation = useDeleteGameMutation()
  const hostingQuery = useMyHostingGames()
  const games = useMemo(
    () => (hostingQuery.data?.games ?? []).map(mapHostingGame),
    [hostingQuery.data?.games],
  )
  const totalItems =
    hostingQuery.data?.pagination?.totalItems ?? upcomingCount ?? games.length

  const handleAccept = async (player) => {
    try {
      await acceptMutation.mutateAsync(player.joinRequestId)
      setAcceptedIds((prev) => new Set(prev).add(player.joinRequestId))
      await showAcceptSuccess(player.name)
    } catch (error) {
      await showErrorAlert(error?.message || 'Unable to accept join request.')
      throw error
    }
  }

  const handleDecline = async (player) => {
    try {
      await declineMutation.mutateAsync(player.joinRequestId)
      setDeclinedIds((prev) => new Set(prev).add(player.joinRequestId))
      await Swal.fire({
        icon: 'success',
        title: 'Request declined',
        text: `${player.name}'s join request was declined.`,
        confirmButtonText: 'OK',
        confirmButtonColor: '#2D6A4F',
      })
    } catch (error) {
      await showErrorAlert(error?.message || 'Unable to decline join request.')
      throw error
    }
  }

  const handleDelete = async (game) => {
    const result = await Swal.fire({
      icon: 'warning',
      title: 'Delete this game?',
      text: 'This cannot be undone. You can only delete a game before accepting any players.',
      showCancelButton: true,
      confirmButtonText: 'Delete game',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#b42318',
      cancelButtonColor: '#6b7280',
    })

    if (!result.isConfirmed) return

    setDeletingGameId(game.id)
    try {
      await deleteGameMutation.mutateAsync(game.id)
      showSuccessToast('Game deleted successfully.')
    } catch (error) {
      await showErrorAlert(error?.message || 'Unable to delete game.')
    } finally {
      setDeletingGameId(null)
    }
  }

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
              onAccept={handleAccept}
              onDecline={handleDecline}
              onOpenChat={onOpenChat}
              onViewReviews={onViewReviews}
              onDelete={handleDelete}
              deleting={deletingGameId === game.id}
            />
          ))}
        </div>
      )}
    </>
  )
}

export default HostingTab
