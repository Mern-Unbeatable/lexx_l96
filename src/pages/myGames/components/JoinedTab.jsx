import JoinedRequestCard from './JoinedRequestCard'
import PaymentInfoBox from '../../../components/PaymentInfoBox'
import { myJoinRequests } from '../data/gamesData'

const JoinedTab = ({ joinedCount, onOpenChat }) => (
  <>
    <div className="mt-6">
      <PaymentInfoBox />
    </div>

    <p className="mt-6 text-sm font-medium uppercase tracking-wider text-muted">
      {joinedCount} Join Requests
    </p>

    <div className="mt-4 space-y-5">
      {myJoinRequests.map((item) => (
        <JoinedRequestCard
          key={item.id}
          item={item}
          onOpenChat={onOpenChat}
        />
      ))}
    </div>
  </>
)

export default JoinedTab
