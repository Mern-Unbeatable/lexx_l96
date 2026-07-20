import JoinedRequestCard from './JoinedRequestCard'
import { pastJoinedGames } from '../data/gamesData'

const PastJoinedGames = ({ joinedCount, onOpenChat }) => (
  <>
    <p className="mt-6 text-sm font-medium uppercase tracking-wider text-muted">
      {joinedCount} Past Joined Games
    </p>

    {pastJoinedGames.length === 0 ? (
      <div className="mt-4 rounded-xl border border-line/60 bg-white px-6 py-12 text-center text-sm text-muted">
        No past joined games.
      </div>
    ) : (
      <div className="mt-4 space-y-5">
        {pastJoinedGames.map((item) => (
          <JoinedRequestCard
            key={item.id}
            item={item}
            onOpenChat={onOpenChat}
          />
        ))}
      </div>
    )}
  </>
)

export default PastJoinedGames
