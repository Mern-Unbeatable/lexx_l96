const JoinRequestCard = ({ request }) => (
  <article className="rounded-xl border border-line/80 bg-white p-4 shadow-[0_1px_2px_rgba(26,46,38,0.04)] sm:p-5">
    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:gap-8">
      <div className="flex min-w-[12rem] items-center gap-3">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#ebe8e1] text-sm font-semibold text-ink">
          {request.initials}
        </div>
        <div>
          <p className="font-semibold text-ink">{request.name}</p>
          <p className="mt-0.5 text-sm text-muted">
            Age {request.age} · Handicap {request.handicap}
          </p>
        </div>
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-medium uppercase tracking-wide text-muted">
          Message
        </p>
        <p className="mt-1 text-[15px] text-ink/80">
          &ldquo;{request.message}&rdquo;
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          className="rounded-lg border border-line bg-white px-4 py-2 text-sm font-medium text-ink transition hover:bg-[#f5f5f5]"
        >
          Decline
        </button>
        <button
          type="button"
          className="rounded-lg bg-forest px-4 py-2 text-sm font-medium text-white transition hover:bg-[#244a37]"
        >
          Accept
        </button>
      </div>
    </div>
  </article>
)

export default JoinRequestCard
