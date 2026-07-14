import GameGroup from './GameGroup'

const GamesList = ({ tab, games, upcomingCount }) => (
  <>
    <p className="mt-6 text-sm font-medium uppercase tracking-wider text-muted">
      {tab === 'hosting' ? `${upcomingCount} Upcoming Games` : 'Past Games'}
    </p>

    <div className="mt-4 space-y-5">
      {games.map((game) => (
        <GameGroup key={game.id} game={game} />
      ))}
    </div>
  </>
)

export default GamesList
