import { useParams } from 'react-router-dom'
import { hostedGames } from '../myGames/data/gamesData'
import JoinRequestsHeader from './components/JoinRequestsHeader'
import PendingRequestsList from './components/PendingRequestsList'
import JoinRequestsFooter from './components/JoinRequestsFooter'

const JoinRequests = () => {
  const { gameId } = useParams()
  const game =
    hostedGames.find((item) => String(item.id) === String(gameId)) ||
    hostedGames[0]

  return (
    <div className="flex min-h-[calc(100vh-4.5rem)] flex-col">
      <div className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 sm:px-6 sm:py-10">
        <JoinRequestsHeader game={game} />
        <PendingRequestsList requests={game.requests} />
      </div>
      <JoinRequestsFooter />
    </div>
  )
}

export default JoinRequests
