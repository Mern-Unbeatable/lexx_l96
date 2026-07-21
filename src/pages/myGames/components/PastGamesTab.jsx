import { useSearchParams } from 'react-router-dom'
import PastGamesSubTabs from './PastGamesSubTabs'
import PastHostedGames from './PastHostedGames'
import PastJoinedGames from './PastJoinedGames'

const PAST_TABS = new Set(['hosted', 'joined'])

const PastGamesTab = ({
  hostedCount = 0,
  joinedCount = 0,
  reviewCount = 0,
  hostedReviewCount = 0,
  joinedReviewCount = 0,
  reviewedIds,
  onOpenChat,
  onLeaveReview,
}) => {
  const [searchParams, setSearchParams] = useSearchParams()
  const pastParam = searchParams.get('past')
  const subTab = PAST_TABS.has(pastParam) ? pastParam : 'hosted'

  const handleSubTabChange = (nextSubTab) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        next.set('tab', 'past')
        next.set('past', nextSubTab)
        return next
      },
      { replace: true },
    )
  }

  return (
    <>
      <PastGamesSubTabs
        tab={subTab}
        onTabChange={handleSubTabChange}
        hostedCount={hostedCount}
        joinedCount={joinedCount}
        hostedReviewCount={hostedReviewCount}
        joinedReviewCount={joinedReviewCount}
      />

      {subTab === 'hosted' ? (
        <PastHostedGames
          hostedCount={hostedCount}
          onLeaveReview={onLeaveReview}
        />
      ) : (
        <PastJoinedGames
          joinedCount={joinedCount}
          onOpenChat={onOpenChat}
          onLeaveReview={onLeaveReview}
        />
      )}
    </>
  )
}

export default PastGamesTab
