const GolfDetails = ({ profile }) => (
  <section className="rounded-2xl border border-line/80 bg-white p-6 shadow-[0_1px_2px_rgba(26,46,38,0.04)] sm:p-7">
    <h2 className="font-serif text-xl font-semibold text-ink sm:text-2xl">
      Golf Details
    </h2>
    <div className="mt-6 grid grid-cols-2 gap-6">
      <div>
        <p className="text-[11px] font-medium uppercase tracking-wide text-muted">
          Handicap Index
        </p>
        <p className="mt-1 text-3xl font-semibold tracking-tight text-forest">
          {profile.handicap}
        </p>
      </div>
      <div>
        <p className="text-[11px] font-medium uppercase tracking-wide text-muted">
          Membership
        </p>
        <p className="mt-1 text-[15px] font-medium text-ink">
          {profile.membership}
        </p>
      </div>
    </div>
  </section>
)

export default GolfDetails
