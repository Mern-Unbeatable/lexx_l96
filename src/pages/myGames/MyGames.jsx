import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { simulateAcceptDelay } from '../../utils/acceptFeedback'
import Swal from 'sweetalert2'
import { queryKeys } from '../../api/queryKeys'
import MyGamesHeader from './components/MyGamesHeader'
import MyGamesTabs from './components/MyGamesTabs'
import HostingTab from './components/HostingTab'
import JoinedTab from './components/JoinedTab'
import PastGamesTab from './components/PastGamesTab'
import MyGamesFooter from './components/MyGamesFooter'
import MatchChat from './components/MatchChat'
import LeaveReviewModal from './components/LeaveReviewModal'
import { useMyGamesCounts } from '../../hooks/useMyGamesCounts'

const MyGames = () => {
  const queryClient = useQueryClient()
  const [tab, setTab] = useState('hosting')
  const [reviewedIds, setReviewedIds] = useState(() => new Set())
  const [chat, setChat] = useState(null)
  const [reviewGame, setReviewGame] = useState(null)
  const countsQuery = useMyGamesCounts()

  const hostingCount = countsQuery.data?.hosting ?? 0
  const joinedCount = countsQuery.data?.joined ?? 0
  const reviewCount = countsQuery.data?.past?.hostedToReview ?? 0

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
    queryClient.invalidateQueries({ queryKey: queryKeys.myGames.all })
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

        {tab === 'hosting' && (
          <HostingTab
            upcomingCount={hostingCount}
            onOpenChat={openChat}
          />
        )}

        {tab === 'joined' && (
          <JoinedTab joinedCount={joinedCount} onOpenChat={openChat} />
        )}

        {tab === 'past' && (
          <PastGamesTab
            hostedCount={countsQuery.data?.past?.hosted ?? 0}
            joinedCount={countsQuery.data?.past?.joined ?? 0}
            reviewCount={reviewCount}
            reviewedIds={reviewedIds}
            onOpenChat={openChat}
            onLeaveReview={setReviewGame}
          />
        )}
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
