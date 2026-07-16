import { useState } from 'react'
import { MapPin, SlidersHorizontal, ChevronDown } from 'lucide-react'
import Swal from 'sweetalert2'
import PaymentInfoBox from '../../components/PaymentInfoBox'
import LocationPreferencesModal from './components/LocationPreferencesModal'
import RequestToJoinModal from './components/RequestToJoinModal'

const Detail = ({ label, value }) => (
  <div>
    <p className="text-xs uppercase tracking-wide text-muted">{label}</p>
    <p className="mt-1 text-[15px] font-medium text-ink">{value}</p>
  </div>
)

const game = {
  host: { name: 'James H.', initials: 'JH' },
  spotsLeft: 3,
  course: 'Sunningdale Golf Club',
  date: 'Saturday 19 Jul',
  time: '08:30',
  ageRange: '25-60',
  handicapRange: '0-18',
  cost: '£35 per person',
  notes: 'Happy to share a buggy. Meeting at the pro shop 15 mins before.',
}

const Home = () => {
  const [locationOpen, setLocationOpen] = useState(false)
  const [requestOpen, setRequestOpen] = useState(false)
  const [locationPrefs, setLocationPrefs] = useState({
    location: '',
    radius: '',
  })

  const handleJoinRequest = async ({ message }) => {
    console.log('Join request:', { game, message })
    await new Promise((resolve) => window.setTimeout(resolve, 500))
    await Swal.fire({
      icon: 'success',
      title: 'Request sent!',
      text: `Your join request was sent to ${game.host.name}.`,
      confirmButtonText: 'Got it',
      confirmButtonColor: '#2D6A4F',
    })
  }
  return (
    <div className="mx-auto container px-4 py-8 sm:px-6 sm:py-10">
      <header className="flex flex-col gap-5 border-b border-line pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-serif text-4xl font-bold text-ink sm:text-5xl">
            Find a Game
          </h1>
          <p className="mt-2 text-base text-muted">
            Your profile: Age 38 · Handicap 14
            {locationPrefs.location
              ? ` · Near ${locationPrefs.location}${
                  locationPrefs.radius
                    ? ` (${locationPrefs.radius} km)`
                    : ''
                }`
              : ''}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setLocationOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg border border-line bg-white px-3.5 py-2 text-sm text-ink transition hover:bg-cream"
          >
            <MapPin size={16} strokeWidth={1.75} className="text-muted" />
            Find my Location
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg border border-line bg-white px-3.5 py-2 text-sm text-ink transition hover:bg-cream"
          >
            <SlidersHorizontal size={16} strokeWidth={1.75} className="text-muted" />
            Filters
            <ChevronDown size={16} strokeWidth={1.75} className="text-muted" />
          </button>
        </div>
      </header>

      <div className="mt-6">
        <PaymentInfoBox />
      </div>

      <article className="mt-8 rounded-xl border border-line/60 bg-white p-6 shadow-[0_1px_3px_rgba(26,46,38,0.06)] sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#ebe8e1] text-sm font-semibold text-ink">
              {game.host.initials}
            </div>
            <div>
              <p className="font-semibold text-ink">{game.host.name}</p>
              <p className="text-sm text-muted">Hosted game</p>
            </div>
          </div>
          <span className="rounded-full bg-[#f0eeea] px-3 py-1 text-xs font-medium text-muted">
            {game.spotsLeft} spots left
          </span>
        </div>

        <div className="mt-8">
          <p className="text-xs uppercase tracking-wide text-muted">Course</p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight text-ink sm:text-2xl">
            {game.course}
          </h2>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-x-8 gap-y-5">
          <Detail label="Date" value={game.date} />
          <Detail label="Time" value={game.time} />
          <Detail label="Age Range" value={game.ageRange} />
          <Detail label="Handicap Range" value={game.handicapRange} />
          <Detail label="Cost" value={game.cost} />
          <Detail label="Spots Available" value={`${game.spotsLeft} spots left`} />
        </div>

        <div className="mt-6">
          <p className="text-xs uppercase tracking-wide text-muted">Notes</p>
          <p className="mt-1 text-[15px] leading-relaxed text-muted">{game.notes}</p>
        </div>

        <button
          type="button"
          onClick={() => setRequestOpen(true)}
          className="mt-8 w-full rounded-lg bg-forest px-4 py-3.5 text-center text-[15px] font-medium text-white transition hover:bg-[#244a37] active:scale-[0.99]"
        >
          Request to Join
        </button>
      </article>

      <LocationPreferencesModal
        open={locationOpen}
        onClose={() => setLocationOpen(false)}
        initialLocation={locationPrefs.location}
        initialRadius={locationPrefs.radius}
        onApply={setLocationPrefs}
      />

      <RequestToJoinModal
        open={requestOpen}
        game={game}
        onClose={() => setRequestOpen(false)}
        onSubmit={handleJoinRequest}
      />
    </div>
  )
}

export default Home
