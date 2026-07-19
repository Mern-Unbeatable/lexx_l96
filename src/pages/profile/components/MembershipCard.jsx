const MembershipCard = ({ profile, fullName }) => (
  <section
    className="relative overflow-hidden rounded-2xl p-6 text-white sm:p-7"
    style={{
      backgroundImage: 'linear-gradient(90deg, #122424 0%, #2D6A4F 100%)',
    }}
  >
    <div
      aria-hidden="true"
      className="pointer-events-none absolute right-[-52px] top-[-36px] size-[190px] rounded-full"
      style={{ background: 'rgba(155, 210, 180, 0.16)' }}
    />
    <div
      aria-hidden="true"
      className="pointer-events-none absolute right-[-78px] bottom-[-110px] size-[280px] rounded-full"
      style={{ background: 'rgba(155, 210, 180, 0.13)' }}
    />

    <div className="relative z-10 flex min-h-[200px] flex-col justify-between">
      <div className="flex items-center gap-2.5">
        <img
          src="/logoWhite.png"
          alt=""
          className="h-8 w-auto object-contain drop-shadow-sm"
        />
        <span className="font-serif text-base font-semibold tracking-wide">
          Golf Linking
        </span>
      </div>

      <div className="py-8">
        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-white/50">
          Member
        </p>
        <p className="mt-1 font-serif text-[28px] font-semibold leading-none tracking-tight">
          {fullName}
        </p>
      </div>

      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-white/50">
            Member Since
          </p>
          <p className="mt-1 text-[15px] font-semibold">{profile.memberSince}</p>
        </div>
        {/* <div className="text-right">
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-white/50">
            Tier
          </p>
          <p className="mt-1 text-[15px] font-semibold">{profile.membership}</p>
        </div> */}
      </div>
    </div>
  </section>
)

export default MembershipCard
