import { ChevronLeft, ChevronRight } from 'lucide-react'

const getVisiblePages = (currentPage, totalPages) =>
  [...new Set([1, currentPage - 1, currentPage, currentPage + 1, totalPages])]
    .filter((page) => page >= 1 && page <= totalPages)
    .sort((a, b) => a - b)

const GamesPagination = ({
  currentPage,
  totalPages,
  hasPrevious,
  hasNext,
  disabled,
  onPageChange,
}) => {
  if (totalPages <= 1) return null

  const pages = getVisiblePages(currentPage, totalPages)

  return (
    <nav
      className="mt-8 flex flex-wrap items-center justify-center gap-2"
      aria-label="Games pagination"
    >
      <button
        type="button"
        disabled={!hasPrevious || disabled}
        onClick={() => onPageChange(currentPage - 1)}
        className="inline-flex size-10 items-center justify-center rounded-lg border border-line bg-white text-ink transition hover:bg-cream disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Previous page"
      >
        <ChevronLeft size={18} />
      </button>

      {pages.map((page, index) => {
        const previousPage = pages[index - 1]
        const hasGap = previousPage && page - previousPage > 1

        return (
          <span key={page} className="contents">
            {hasGap && <span className="px-1 text-muted">…</span>}
            <button
              type="button"
              disabled={disabled}
              onClick={() => onPageChange(page)}
              aria-current={page === currentPage ? 'page' : undefined}
              className={`size-10 rounded-lg border text-sm font-medium transition ${
                page === currentPage
                  ? 'border-forest bg-forest text-white'
                  : 'border-line bg-white text-ink hover:bg-cream'
              } disabled:cursor-not-allowed disabled:opacity-60`}
            >
              {page}
            </button>
          </span>
        )
      })}

      <button
        type="button"
        disabled={!hasNext || disabled}
        onClick={() => onPageChange(currentPage + 1)}
        className="inline-flex size-10 items-center justify-center rounded-lg border border-line bg-white text-ink transition hover:bg-cream disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Next page"
      >
        <ChevronRight size={18} />
      </button>
    </nav>
  )
}

export default GamesPagination
