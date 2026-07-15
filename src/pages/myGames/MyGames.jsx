import { useState } from 'react'
import { hostedGames, pastGames } from './data/gamesData'
import {
  showAcceptSuccess,
  simulateAcceptDelay,
} from '../../utils/acceptFeedback'
import MyGamesHeader from './components/MyGamesHeader'
import MyGamesTabs from './components/MyGamesTabs'
import GamesList from './components/GamesList'
import MyGamesFooter from './components/MyGamesFooter'
import MatchChat from './components/MatchChat'

const MyGames = () => {
  const [tab, setTab] = useState('hosting')
  const [acceptedIds, setAcceptedIds] = useState(() => new Set())
  const [chat, setChat] = useState(null)
  const games = tab === 'hosting' ? hostedGames : pastGames
  const upcomingCount = hostedGames.length

  const handleAccept = async (player) => {
    await simulateAcceptDelay()
    setAcceptedIds((prev) => new Set(prev).add(player.id))
    await showAcceptSuccess(player.name)
  }

  const openChat = (player, game) => {
    setChat({ player, game })
  }

  return (
    <div className="flex min-h-[calc(100vh-4.5rem)] flex-col">
      <div className="mx-auto w-full container flex-1 px-4 py-8 sm:px-6 sm:py-10">
        <MyGamesHeader />
        <MyGamesTabs tab={tab} onTabChange={setTab} />
        <GamesList
          tab={tab}
          games={games}
          upcomingCount={upcomingCount}
          acceptedIds={acceptedIds}
          onAccept={handleAccept}
          onOpenChat={openChat}
        />
      </div>
      <MyGamesFooter />

      <MatchChat
        open={Boolean(chat)}
        player={chat?.player}
        game={chat?.game}
        onClose={() => setChat(null)}
      />
    </div>
  )
}

export default MyGames
