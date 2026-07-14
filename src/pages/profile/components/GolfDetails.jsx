import Detail from './Detail'
import { cardClass } from '../data/profileData'

const GolfDetails = ({ profile }) => (
  <section className={cardClass}>
    <h2 className="font-serif text-xl font-semibold text-ink sm:text-2xl">
      Golf Details
    </h2>
    <div className="mt-6 space-y-5">
      <Detail
        label="Handicap Index"
        value={profile.handicap}
        valueClassName="text-2xl font-semibold text-forest"
      />
      <Detail label="Membership" value={profile.membership} />
    </div>
  </section>
)

export default GolfDetails
