import { Flag, Trophy, Users, Calendar, Pencil, Check } from 'lucide-react'

const profile = {
  firstName: 'James',
  lastName: 'Whitfield',
  initials: 'JW',
  email: 'james.whitfield@email.com',
  phone: '+44 7700 900 142',
  location: 'Surrey, England',
  homeCourse: 'Sunningdale Golf Club',
  handicap: 8,
  roundsPlayed: 47,
  roundsHosted: 12,
  memberSince: '12 March 2022',
  membership: 'Premium',
  about:
    'Passionate golfer with a love for links courses and early morning tee times. Always happy to welcome new playing partners.',
}

const cardClass =
  'rounded-xl border border-line/70 bg-white p-5 shadow-[0_1px_3px_rgba(26,46,38,0.05)]'

const StatCard = ({ icon: Icon, value, label }) => (
  <div className={`${cardClass} flex items-start gap-3`}>
    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#e8f0ea] text-forest">
      <Icon size={18} strokeWidth={1.75} />
    </div>
    <div>
      <p className="text-xl font-semibold tracking-tight text-ink sm:text-2xl">
        {value}
      </p>
      <p className="mt-0.5 text-xs text-muted sm:text-sm">{label}</p>
    </div>
  </div>
)

const Detail = ({ label, value, valueClassName = 'text-ink' }) => (
  <div>
    <p className="text-[11px] font-medium uppercase tracking-wide text-muted">
      {label}
    </p>
    <p className={`mt-1 text-sm font-medium sm:text-[15px] ${valueClassName}`}>
      {value}
    </p>
  </div>
)

const Profile = () => {
  const fullName = `${profile.firstName} ${profile.lastName}`

  return (
    <div className="flex min-h-[calc(100vh-4.5rem)] flex-col">
      <div className="mx-auto w-full container flex-1 px-4 py-8 sm:px-6 sm:py-10">
        <header className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex size-16 shrink-0 items-center justify-center rounded-full bg-[#ebe8e1] text-lg font-semibold text-ink sm:size-[4.5rem] sm:text-xl">
              {profile.initials}
            </div>
            <div>
              <h1 className="font-serif text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                {fullName}
              </h1>
              <div className="mt-2 flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e8f0ea] px-2.5 py-1 text-xs font-medium text-forest">
                  <Check size={12} strokeWidth={2.5} />
                  Premium Member
                </span>
                <span className="text-sm text-muted">{profile.location}</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            className="inline-flex shrink-0 items-center gap-2 self-start rounded-lg border border-line bg-white px-3.5 py-2 text-sm font-medium text-ink transition hover:bg-cream"
          >
            <Pencil size={15} strokeWidth={1.75} />
            Edit Profile
          </button>
        </header>

        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={Flag}
            value={profile.handicap}
            label="Current Handicap"
          />
          <StatCard
            icon={Trophy}
            value={profile.roundsPlayed}
            label="Rounds Played"
          />
          <StatCard
            icon={Users}
            value={profile.roundsHosted}
            label="Rounds Hosted"
          />
          <StatCard
            icon={Calendar}
            value={profile.memberSince}
            label="Member Since"
          />
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-[1.4fr_1fr]">
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

          <div className="space-y-5">
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

            <section className="relative overflow-hidden rounded-xl bg-forest p-5 text-white shadow-[0_1px_3px_rgba(26,46,38,0.08)] sm:p-6">
              <div
                className="pointer-events-none absolute -right-8 -top-8 size-40 rounded-full border border-white/10"
                aria-hidden="true"
              />
              <div
                className="pointer-events-none absolute -right-2 top-6 size-28 rounded-full border border-white/10"
                aria-hidden="true"
              />

              <div className="relative flex items-center gap-2.5">
                <img
                  src="/logo.png"
                  alt=""
                  className="h-7 w-auto object-contain"
                />
                <span className="text-sm font-semibold tracking-wide">
                  Golf Links
                </span>
              </div>

              <div className="relative mt-8">
                <p className="text-[11px] font-medium uppercase tracking-wide text-white/55">
                  Member
                </p>
                <p className="mt-1 font-serif text-2xl font-semibold tracking-tight">
                  {fullName}
                </p>
              </div>

              <div className="relative mt-8 flex items-end justify-between gap-4">
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-wide text-white/55">
                    Member Since
                  </p>
                  <p className="mt-1 text-sm font-medium">{profile.memberSince}</p>
                </div>
                <div className="text-right">
                  <p className="text-[11px] font-medium uppercase tracking-wide text-white/55">
                    Tier
                  </p>
                  <p className="mt-1 text-sm font-medium">{profile.membership}</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      <footer className="py-8 text-center text-xs text-muted">
        © 2026 Golf Links · Premium Pairings
      </footer>
    </div>
  )
}

export default Profile
