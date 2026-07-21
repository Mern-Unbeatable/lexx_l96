const tabBase =
  'inline-flex shrink-0 items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition'

const PastGamesSubTabs = ({
  tab,
  onTabChange,
  hostedCount,
  joinedCount,
  hostedReviewCount = 0,
  joinedReviewCount = 0,
}) => (
  <div className="mt-6 flex flex-wrap gap-2">
    <button
      type="button"
      onClick={() => onTabChange('hosted')}
      className={`${tabBase} ${
        tab === 'hosted'
          ? 'bg-forest text-white'
          : 'border border-line bg-white text-muted hover:text-ink'
      }`}
    >
      Hosted
      <span
        className={`flex size-5 items-center justify-center rounded-full text-[11px] font-semibold ${
          tab === 'hosted' ? 'bg-white/20 text-white' : 'bg-forest text-white'
        }`}
      >
        {hostedCount}
      </span>
      {hostedReviewCount > 0 && tab !== 'hosted' && (
        <span className="rounded-full bg-[#F0A500] px-2 py-0.5 text-xs text-white">
          {hostedReviewCount} to review
        </span>
      )}
    </button>

    <button
      type="button"
      onClick={() => onTabChange('joined')}
      className={`${tabBase} ${
        tab === 'joined'
          ? 'bg-forest text-white'
          : 'border border-line bg-white text-muted hover:text-ink'
      }`}
    >
      Joined
      <span
        className={`flex size-5 items-center justify-center rounded-full text-[11px] font-semibold ${
          tab === 'joined' ? 'bg-white/20 text-white' : 'bg-forest text-white'
        }`}
      >
        {joinedCount}
      </span>
      {joinedReviewCount > 0 && tab !== 'joined' && (
        <span className="rounded-full bg-[#F0A500] px-2 py-0.5 text-xs text-white">
          {joinedReviewCount} to review
        </span>
      )}
    </button>
  </div>
)

export default PastGamesSubTabs
