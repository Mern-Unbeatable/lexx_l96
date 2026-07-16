import GameGroup from './GameGroup'
import JoinedRequestCard from './JoinedRequestCard'
import PaymentInfoBox from '../../../components/PaymentInfoBox'

const sectionTitle = {
  hosting: (count) => `${count} Upcoming Games`,
  joined: (count) => `${count} Join Requests`,
  past: () => 'Past Games',
}

const GamesList = ({
  tab,
  games,
  upcomingCount,
  joinedCount,
  acceptedIds,
  declinedIds,
  onAccept,
  onDecline,
  onOpenChat,
  onLeaveReview,
}) => (
  <>
    {(tab === 'hosting' || tab === 'joined') && (
      <div className="mt-6">
        <PaymentInfoBox />
      </div>
    )}

    <p className="mt-6 text-sm font-medium uppercase tracking-wider text-muted">
      {tab === 'hosting'
        ? sectionTitle.hosting(upcomingCount)
        : tab === 'joined'
          ? sectionTitle.joined(joinedCount)
          : sectionTitle.past()}
    </p>

    <div className="mt-4 space-y-5">
      {tab === 'joined'
        ? games.map((item) => (
            <JoinedRequestCard
              key={item.id}
              item={item}
              onOpenChat={onOpenChat}
            />
          ))
        : games.map((game) => (
            <GameGroup
              key={game.id}
              game={game}
              acceptedIds={acceptedIds}
              declinedIds={declinedIds}
              onAccept={onAccept}
              onDecline={onDecline}
              onOpenChat={onOpenChat}
              onLeaveReview={onLeaveReview}
            />
          ))}
    </div>
  </>
)

export default GamesList
