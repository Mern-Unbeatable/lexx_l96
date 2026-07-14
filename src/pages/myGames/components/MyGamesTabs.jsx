const MyGamesTabs = ({ tab, onTabChange }) => (
  <div className="mt-6 flex gap-6 border-b border-line">
    <button
      type="button"
      onClick={() => onTabChange('hosting')}
      className={`inline-flex items-center gap-2 border-b-2 pb-3 text-base transition ${
        tab === 'hosting'
          ? 'border-ink font-semibold text-ink'
          : 'border-transparent text-muted hover:text-ink'
      }`}
    >
      Hosting
      <span className="flex size-5 items-center justify-center rounded-full bg-forest text-[11px] font-semibold text-white">
        3
      </span>
    </button>
    <button
      type="button"
      onClick={() => onTabChange('past')}
      className={`inline-flex items-center gap-2 border-b-2 pb-3 text-base transition ${
        tab === 'past'
          ? 'border-ink font-semibold text-ink'
          : 'border-transparent text-muted hover:text-ink'
      }`}
    >
      Past Games
      <span className="rounded-full bg-[#F0A500] px-2 py-0.5 text-sm text-white">
        1 to review
      </span>
    </button>
  </div>
)

export default MyGamesTabs
