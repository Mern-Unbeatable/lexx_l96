import { useEffect, useRef, useState } from 'react'
import { Check, ChevronDown, SlidersHorizontal } from 'lucide-react'

export const FILTER_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'latest', label: 'Latest first' },
  { value: 'lowest_cost', label: 'Lowest cost' },
  { value: 'highest_cost', label: 'Highest cost' },
]

const FiltersDropdown = ({ value = 'all', onChange }) => {
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)

  useEffect(() => {
    const handleOutside = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [])

  const selected =
    FILTER_OPTIONS.find((option) => option.value === value) ?? FILTER_OPTIONS[0]

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 rounded-lg border border-line bg-white px-3.5 py-2 text-sm text-ink transition hover:bg-cream"
      >
        <SlidersHorizontal size={16} strokeWidth={1.75} className="text-muted" />
        Filters
        <ChevronDown
          size={16}
          strokeWidth={1.75}
          className={`text-muted transition ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="absolute right-0 z-30 mt-2 min-w-[12.5rem] overflow-hidden rounded-xl border border-line bg-white py-1 shadow-[0_16px_40px_rgba(26,46,38,0.14)]">
          {FILTER_OPTIONS.map((option) => {
            const isActive = option.value === selected.value
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange?.(option.value)
                  setOpen(false)
                }}
                className={`flex w-full items-center justify-between gap-3 px-3.5 py-2.5 text-left text-sm transition hover:bg-cream ${
                  isActive ? 'font-medium text-forest' : 'text-ink'
                }`}
              >
                {option.label}
                {isActive && <Check size={15} strokeWidth={2} />}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default FiltersDropdown
