const MembershipCard = ({ profile, fullName }) => (
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
      <img src="/logo.png" alt="" className="h-7 w-auto object-contain" />
      <span className="text-sm font-semibold tracking-wide">Golf Links</span>
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
)

export default MembershipCard
