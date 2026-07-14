import Detail from './Detail'
import { cardClass } from '../data/profileData'

const PersonalDetails = ({ profile }) => (
  <section className={cardClass}>
    <h2 className="font-serif text-xl font-semibold text-ink sm:text-2xl">
      Personal Details
    </h2>
    <div className="mt-6 grid gap-5 sm:grid-cols-2">
      <Detail label="First Name" value={profile.firstName} />
      <Detail label="Last Name" value={profile.lastName} />
      <Detail label="Email" value={profile.email} />
      <Detail label="Phone" value={profile.phone} />
      <Detail label="Location" value={profile.location} />
      <Detail label="Home Course" value={profile.homeCourse} />
    </div>
    <div className="mt-8 border-t border-line pt-6">
      <p className="text-[11px] font-medium uppercase tracking-wide text-muted">
        About
      </p>
      <p className="mt-2 text-sm leading-relaxed text-ink/80 sm:text-[15px]">
        {profile.about}
      </p>
    </div>
  </section>
)

export default PersonalDetails
