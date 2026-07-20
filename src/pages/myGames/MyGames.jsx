import { useState } from 'react'
import { hostedGames, myJoinRequests, pastGames } from './data/gamesData'
import {
  showAcceptSuccess,
  simulateAcceptDelay,
} from '../../utils/acceptFeedback'
import Swal from 'sweetalert2'
import MyGamesHeader from './components/MyGamesHeader'
import MyGamesTabs from './components/MyGamesTabs'
import GamesList from './components/GamesList'
import MyGamesFooter from './components/MyGamesFooter'
import MatchChat from './components/MatchChat'
import LeaveReviewModal from './components/LeaveReviewModal'
import { useMyGamesCounts } from '../../hooks/useMyGamesCounts'

const gamesByTab = {
  hosting: hostedGames,
  joined: myJoinRequests,
  past: pastGames,
}

const MyGames = () => {
  const [tab, setTab] = useState('hosting')
  const [acceptedIds, setAcceptedIds] = useState(() => new Set())
  const [declinedIds, setDeclinedIds] = useState(() => new Set())
  const [reviewedIds, setReviewedIds] = useState(() => new Set())
  const [chat, setChat] = useState(null)
  const [reviewGame, setReviewGame] = useState(null)
  const countsQuery = useMyGamesCounts()

  const games =
    tab === 'past'
      ? pastGames.map((game) => ({
          ...game,
          needsReview: game.needsReview && !reviewedIds.has(game.id),
        }))
      : gamesByTab[tab]

  const hostingCount = countsQuery.data?.hosting ?? 0
  const joinedCount = countsQuery.data?.joined ?? 0
  const reviewCount = countsQuery.data?.past?.hostedToReview ?? 0

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

  const openChat = (player, game) => {
    setChat({
      player: {
        ...player,
        id: player.id || player.name,
      },
      game: {
        ...game,
        id: game.id,
        course: game.course,
        date: game.date,
        time: game.time,
      },
    })
  }

  const handleReviewSubmit = async (payload) => {
    console.log('Review submitted:', payload)
    await simulateAcceptDelay(600)
    setReviewedIds((prev) => new Set(prev).add(payload.gameId))
    await Swal.fire({
      icon: 'success',
      title: 'Review submitted!',
      text: 'Thanks for rating your round.',
      confirmButtonText: 'Got it',
      confirmButtonColor: '#2D6A4F',
    })
  }

  return (
    <div className="flex min-h-[calc(100vh-4.5rem)] flex-col">
      <div className="mx-auto w-full container flex-1 px-4 py-8 sm:px-6 sm:py-10">
        <MyGamesHeader />
        <MyGamesTabs
          tab={tab}
          onTabChange={setTab}
          hostingCount={hostingCount}
          joinedCount={joinedCount}
          reviewCount={reviewCount}
        />
        <GamesList
          tab={tab}
          games={games}
          upcomingCount={hostingCount}
          joinedCount={joinedCount}
          acceptedIds={acceptedIds}
          declinedIds={declinedIds}
          onAccept={handleAccept}
          onDecline={handleDecline}
          onOpenChat={openChat}
          onLeaveReview={setReviewGame}
        />
      </div>
      <MyGamesFooter />

      <MatchChat
        open={Boolean(chat)}
        player={chat?.player}
        game={chat?.game}
        onClose={() => setChat(null)}
      />

      <LeaveReviewModal
        open={Boolean(reviewGame)}
        game={reviewGame}
        onClose={() => setReviewGame(null)}
        onSubmit={handleReviewSubmit}
      />
    </div>
  )
}

export default MyGames
