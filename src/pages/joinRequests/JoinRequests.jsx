import { useState } from 'react'
import { useParams } from 'react-router-dom'
import Swal from 'sweetalert2'
import { useRequireAuth } from '../../hooks/useRequireAuth'
import { hostedGames } from '../myGames/data/gamesData'
import {
  showAcceptSuccess,
  simulateAcceptDelay,
} from '../../utils/acceptFeedback'
import MatchChat from '../myGames/components/MatchChat'
import PaymentInfoBox from '../../components/PaymentInfoBox'
import JoinRequestsHeader from './components/JoinRequestsHeader'
import PendingRequestsList from './components/PendingRequestsList'
import JoinRequestsFooter from './components/JoinRequestsFooter'

const JoinRequests = () => {
  const isAuthenticated = useRequireAuth()
  const { gameId } = useParams()
  const game =
    hostedGames.find((item) => String(item.id) === String(gameId)) ||
    hostedGames[0]
  const [acceptedIds, setAcceptedIds] = useState(() => new Set())
  const [declinedIds, setDeclinedIds] = useState(() => new Set())
  const [chatPlayer, setChatPlayer] = useState(null)

  const handleAccept = async (player) => {
    await simulateAcceptDelay()
    setAcceptedIds((prev) => new Set(prev).add(player.id))
    await showAcceptSuccess(player.name)
  }

  const handleDecline = async (player) => {
    await simulateAcceptDelay(500)
    setDeclinedIds((prev) => new Set(prev).add(player.id))
    await Swal.fire({
      icon: 'info',
      title: 'Request declined',
      text: `${player.name}'s join request was declined.`,
      confirmButtonText: 'OK',
      confirmButtonColor: '#2D6A4F',
    })
  }

  if (!isAuthenticated) return null

  return (
    <div className="flex min-h-[calc(100vh-4.5rem)] flex-col">
      <div className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 sm:px-6 sm:py-10">
        <JoinRequestsHeader game={game} />
        <div className="mt-6">
          <PaymentInfoBox />
        </div>
        <PendingRequestsList
          requests={game.requests}
          acceptedIds={acceptedIds}
          declinedIds={declinedIds}
          onAccept={handleAccept}
          onDecline={handleDecline}
          onOpenChat={setChatPlayer}
        />
      </div>
      <JoinRequestsFooter />

      <MatchChat
        open={Boolean(chatPlayer)}
        player={chatPlayer}
        game={game}
        onClose={() => setChatPlayer(null)}
      />
    </div>
  )
}

export default JoinRequests
