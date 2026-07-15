import GameGroup from './GameGroup'
import PaymentInfoBox from '../../../components/PaymentInfoBox'

const GamesList = ({
  tab,
  games,
  upcomingCount,
  acceptedIds,
  onAccept,
  onDecline,
  onOpenChat,
}) => (
  <>
    {tab === 'hosting' && (
      <div className="mt-6">
        <PaymentInfoBox />
      </div>
    )}

    <p className="mt-6 text-sm font-medium uppercase tracking-wider text-muted">
      {tab === 'hosting' ? `${upcomingCount} Upcoming Games` : 'Past Games'}
    </p>

    <div className="mt-4 space-y-5">
      {games.map((game) => (
        <GameGroup
          key={game.id}
          game={game}
          acceptedIds={acceptedIds}
          onAccept={onAccept}
          onDecline={onDecline}
          onOpenChat={onOpenChat}
        />
      ))}
    </div>
  </>
)

export default GamesList
