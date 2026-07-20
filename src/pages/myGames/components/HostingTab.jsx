import GameGroup from './GameGroup'
import PaymentInfoBox from '../../../components/PaymentInfoBox'
import { hostedGames } from '../data/gamesData'

const HostingTab = ({
  upcomingCount,
  acceptedIds,
  declinedIds,
  onAccept,
  onDecline,
  onOpenChat,
}) => (
  <>
    <div className="mt-6">
      <PaymentInfoBox />
    </div>

    <p className="mt-6 text-sm font-medium uppercase tracking-wider text-muted">
      {upcomingCount} Upcoming Games
    </p>

    <div className="mt-4 space-y-5">
      {hostedGames.map((game) => (
        <GameGroup
          key={game.id}
          game={game}
          acceptedIds={acceptedIds}
          declinedIds={declinedIds}
          onAccept={onAccept}
          onDecline={onDecline}
          onOpenChat={onOpenChat}
        />
      ))}
    </div>
  </>
)

export default HostingTab
