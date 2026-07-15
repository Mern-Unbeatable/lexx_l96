const tabBase =
  'inline-flex shrink-0 items-center gap-2 border-b-2 pb-3 text-base transition'

const MyGamesTabs = ({
  tab,
  onTabChange,
  hostingCount,
  joinedCount,
  reviewCount,
}) => (
  <div className="mt-6 flex gap-6 overflow-x-auto border-b border-line">
    <button
      type="button"
      onClick={() => onTabChange('hosting')}
      className={`${tabBase} ${
        tab === 'hosting'
          ? 'border-ink font-semibold text-ink'
          : 'border-transparent text-muted hover:text-ink'
      }`}
    >
      Hosting
      <span className="flex size-5 items-center justify-center rounded-full bg-forest text-[11px] font-semibold text-white">
        {hostingCount}
      </span>
    </button>

    <button
      type="button"
      onClick={() => onTabChange('joined')}
      className={`${tabBase} ${
        tab === 'joined'
          ? 'border-ink font-semibold text-ink'
          : 'border-transparent text-muted hover:text-ink'
      }`}
    >
      Joined
      <span className="flex size-5 items-center justify-center rounded-full bg-forest text-[11px] font-semibold text-white">
        {joinedCount}
      </span>
    </button>

    <button
      type="button"
      onClick={() => onTabChange('past')}
      className={`${tabBase} ${
        tab === 'past'
          ? 'border-ink font-semibold text-ink'
          : 'border-transparent text-muted hover:text-ink'
      }`}
    >
      Past Games
      {reviewCount > 0 && (
        <span className="rounded-full bg-[#F0A500] px-2 py-0.5 text-sm text-white">
          {reviewCount} to review
        </span>
      )}
    </button>
  </div>
)

export default MyGamesTabs
