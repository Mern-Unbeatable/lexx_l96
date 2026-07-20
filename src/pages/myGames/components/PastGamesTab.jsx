import { useState } from 'react'
import PastGamesSubTabs from './PastGamesSubTabs'
import PastHostedGames from './PastHostedGames'
import PastJoinedGames from './PastJoinedGames'

const PastGamesTab = ({
  hostedCount = 0,
  joinedCount = 0,
  reviewCount = 0,
  reviewedIds,
  onOpenChat,
  onLeaveReview,
}) => {
  const [subTab, setSubTab] = useState('hosted')

  return (
    <>
      <PastGamesSubTabs
        tab={subTab}
        onTabChange={setSubTab}
        hostedCount={hostedCount}
        joinedCount={joinedCount}
        reviewCount={reviewCount}
      />

      {subTab === 'hosted' ? (
        <PastHostedGames
          hostedCount={hostedCount}
          onLeaveReview={onLeaveReview}
        />
      ) : (
        <PastJoinedGames joinedCount={joinedCount} onOpenChat={onOpenChat} />
      )}
    </>
  )
}

export default PastGamesTab
