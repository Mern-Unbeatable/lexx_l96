import { Pencil, Check } from 'lucide-react'

const ProfileHeader = ({ profile, fullName }) => (
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
)

export default ProfileHeader
