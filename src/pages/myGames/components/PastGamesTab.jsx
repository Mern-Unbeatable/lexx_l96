import GameGroup from './GameGroup'
import { pastGames } from '../data/gamesData'

const PastGamesTab = ({ reviewedIds, onOpenChat, onLeaveReview }) => {
  const games = pastGames.map((game) => ({
    ...game,
    needsReview: game.needsReview && !reviewedIds.has(game.id),
  }))

  return (
    <>
      <p className="mt-6 text-sm font-medium uppercase tracking-wider text-muted">
        Past Games
      </p>

      <div className="mt-4 space-y-5">
        {games.map((game) => (
          <GameGroup
            key={game.id}
            game={game}
            onOpenChat={onOpenChat}
            onLeaveReview={onLeaveReview}
          />
        ))}
      </div>
    </>
  )
}

export default PastGamesTab
