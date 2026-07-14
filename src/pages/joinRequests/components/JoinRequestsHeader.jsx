import { LandPlot } from 'lucide-react'

const GameInfoPill = ({ course, date, time }) => (
  <div className="mt-5 inline-flex max-w-full items-center gap-2.5 rounded-full bg-forest px-4 py-2.5 text-sm text-white">
    <LandPlot size={16} strokeWidth={1.75} className="shrink-0" aria-hidden="true" />
    <span className="truncate">
      {course} · {date} · {time}
    </span>
  </div>
)

const JoinRequestsHeader = ({ game }) => (
  <header>
    <h1 className="font-serif text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
      Join Requests
    </h1>
    <p className="mt-2 text-sm text-muted sm:text-base">
      Manage requests for your upcoming game
    </p>
    <GameInfoPill course={game.course} date={game.date} time={game.time} />
  </header>
)

export default JoinRequestsHeader
