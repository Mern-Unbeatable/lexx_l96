import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Swal from 'sweetalert2'
import { useRequireAuth } from '../../hooks/useRequireAuth'
import { getConversations } from '../../services/chatApi'
import MyGamesHeader from './components/MyGamesHeader'
import MyGamesTabs from './components/MyGamesTabs'
import HostingTab from './components/HostingTab'
import JoinedTab from './components/JoinedTab'
import PastGamesTab from './components/PastGamesTab'
import MyGamesFooter from './components/MyGamesFooter'
import MatchChat from './components/MatchChat'
import LeaveReviewModal from './components/LeaveReviewModal'
import { useMyGamesCounts } from '../../hooks/useMyGamesCounts'
import { useLeaveReviewMutation } from '../../hooks/useLeaveReviewMutation'

const MAIN_TABS = new Set(['hosting', 'joined', 'past'])

const MyGames = () => {
  const isAuthenticated = useRequireAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const tabParam = searchParams.get('tab')
  const tab = MAIN_TABS.has(tabParam) ? tabParam : 'hosting'
  const [reviewedIds, setReviewedIds] = useState(() => new Set())
  const [chat, setChat] = useState(null)
  const [reviewGame, setReviewGame] = useState(null)
  const countsQuery = useMyGamesCounts()
  const leaveReviewMutation = useLeaveReviewMutation()

  const hostingCount = countsQuery.data?.hosting ?? 0
  const joinedCount = countsQuery.data?.joined ?? 0
  const reviewCount =
    (countsQuery.data?.past?.hostedToReview ?? 0) +
    (countsQuery.data?.past?.joinedToReview ?? 0)

  const handleTabChange = (nextTab) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        next.set('tab', nextTab)
        if (nextTab !== 'past') {
          next.delete('past')
        }
        return next
      },
      { replace: true },
    )
  }

  const openChat = (player, game) => {
    const gameId = game.id || game.gameId
    if (!player?.id || !gameId) return

    setChat({
      player: {
        ...player,
        id: player.id,
        initials:
          player.initials ||
          player.name
            ?.replace(/\./g, '')
            .split(/\s+/)
            .filter(Boolean)
            .slice(0, 2)
            .map((part) => part[0])
            .join('')
            .toUpperCase(),
      },
      game: {
        ...game,
        id: gameId,
        course: game.course || game.courseName,
        date: game.date,
        time: game.time,
      },
      conversationId: game.conversationId ?? player.conversationId ?? null,
    })
  }

  useEffect(() => {
    const conversationId = searchParams.get('conversation')
    if (!conversationId) return undefined

    let cancelled = false

    const openConversationFromNotification = async () => {
      try {
        const conversations = await getConversations()
        const conversation = conversations.find((item) => item.id === conversationId)

        if (!conversation || cancelled) return

        const nextTab =
          searchParams.get('tab') === 'hosting' || conversation.viewerTab === 'hosting'
            ? 'hosting'
            : 'joined'

        openChat(
          {
            id: conversation.otherUser.id,
            name: conversation.otherUser.name,
          },
          {
            id: conversation.game.id,
            courseName: conversation.game.courseName,
            date: conversation.game.date,
            time: conversation.game.time,
            conversationId: conversation.id,
          },
        )

        setSearchParams(
          (prev) => {
            const next = new URLSearchParams(prev)
            next.set('tab', nextTab)
            next.delete('conversation')
            return next
          },
          { replace: true },
        )
      } catch {
        // Ignore lookup errors and keep the page usable.
      }
    }

    openConversationFromNotification()

    return () => {
      cancelled = true
    }
  }, [searchParams, setSearchParams])

  const handleReviewSubmit = async ({ gameId, revieweeId, rating }) => {
    await leaveReviewMutation.mutateAsync({
      gameId,
      revieweeId,
      rating,
    })

    setReviewedIds((prev) => new Set(prev).add(gameId))

    await Swal.fire({
      icon: 'success',
      title: 'Review submitted!',
      text: 'Thanks for rating your round.',
      confirmButtonText: 'Got it',
      confirmButtonColor: '#2D6A4F',
    })
  }

  if (!isAuthenticated) return null

  return (
    <div className="flex min-h-[calc(100vh-4.5rem)] flex-col">
      <div className="mx-auto w-full container flex-1 px-4 py-8 sm:px-6 sm:py-10">
        <MyGamesHeader />
        <MyGamesTabs
          tab={tab}
          onTabChange={handleTabChange}
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
            hostedReviewCount={countsQuery.data?.past?.hostedToReview ?? 0}
            joinedReviewCount={countsQuery.data?.past?.joinedToReview ?? 0}
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
        conversationId={chat?.conversationId}
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
