import Detail from './Detail'

const PersonalDetails = ({ profile }) => (
  <section className="h-full rounded-2xl border border-line/80 bg-white p-6 shadow-[0_1px_2px_rgba(26,46,38,0.04)] sm:p-7">
    <h2 className="font-serif text-xl font-semibold text-ink sm:text-2xl">
      Personal Details
    </h2>
    <div className="mt-6 grid gap-x-8 gap-y-5 sm:grid-cols-2">
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
      <p className="mt-2 text-[15px] leading-relaxed text-ink/85">
        {profile.about || '—'}
      </p>
    </div>
  </section>
)

export default PersonalDetails
