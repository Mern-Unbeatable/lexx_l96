import { useState } from 'react'
import { hostedGames, pastGames } from './data/gamesData'
import MyGamesHeader from './components/MyGamesHeader'
import MyGamesTabs from './components/MyGamesTabs'
import GamesList from './components/GamesList'
import MyGamesFooter from './components/MyGamesFooter'

const MyGames = () => {
  const [tab, setTab] = useState('hosting')
  const games = tab === 'hosting' ? hostedGames : pastGames
  const upcomingCount = hostedGames.length

  return (
    <div className="flex min-h-[calc(100vh-4.5rem)] flex-col">
      <div className="mx-auto w-full container flex-1 px-4 py-8 sm:px-6 sm:py-10">
        <MyGamesHeader />
        <MyGamesTabs tab={tab} onTabChange={setTab} />
        <GamesList tab={tab} games={games} upcomingCount={upcomingCount} />
      </div>
      <MyGamesFooter />
    </div>
  )
}

export default MyGames
