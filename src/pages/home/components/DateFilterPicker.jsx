import { useEffect, useMemo, useRef, useState } from 'react'
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react'

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

const parseIsoDate = (isoDate) => {
  if (!isoDate) return null
  const [year, month, day] = isoDate.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  return Number.isNaN(date.getTime()) ? null : date
}

const toIsoDate = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const startOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1)

const DateFilterPicker = ({ value = '', onChange, minDate, hasActiveFilter = false }) => {
  const rootRef = useRef(null)
  const [open, setOpen] = useState(false)
  const min = useMemo(() => parseIsoDate(minDate) ?? new Date(), [minDate])
  const selected = useMemo(() => parseIsoDate(value), [value])
  const [viewMonth, setViewMonth] = useState(() =>
    startOfMonth(selected ?? min),
  )

  useEffect(() => {
    if (open) {
      setViewMonth(startOfMonth(selected ?? min))
    }
  }, [open, selected, min])

  useEffect(() => {
    const handleOutside = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false)
    }

    document.addEventListener('mousedown', handleOutside)
    document.addEventListener('touchstart', handleOutside)
    return () => {
      document.removeEventListener('mousedown', handleOutside)
      document.removeEventListener('touchstart', handleOutside)
    }
  }, [])

  const monthLabel = new Intl.DateTimeFormat('en-GB', {
    month: 'long',
    year: 'numeric',
  }).format(viewMonth)

  const minMonth = startOfMonth(min)
  const canGoPrev =
    viewMonth.getFullYear() > minMonth.getFullYear() ||
    viewMonth.getMonth() > minMonth.getMonth()

  const daysInMonth = new Date(
    viewMonth.getFullYear(),
    viewMonth.getMonth() + 1,
    0,
  ).getDate()
  const firstWeekday = new Date(
    viewMonth.getFullYear(),
    viewMonth.getMonth(),
    1,
  ).getDay()

  const handleSelect = (day) => {
    const next = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), day)
    if (next < new Date(min.getFullYear(), min.getMonth(), min.getDate())) return
    onChange?.(toIsoDate(next))
    setOpen(false)
  }

  const handleToday = () => {
    onChange?.(toIsoDate(min))
    setOpen(false)
  }

  const handleClear = () => {
    onChange?.('')
    setOpen(false)
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-label="Filter by date"
        aria-expanded={open}
        aria-haspopup="dialog"
        className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border bg-white transition hover:bg-cream sm:size-[38px] ${
          hasActiveFilter ? 'border-forest text-forest' : 'border-line text-muted'
        }`}
      >
        <Calendar
          size={16}
          strokeWidth={1.75}
          className="size-3.5 sm:size-4"
          aria-hidden="true"
        />
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Choose date"
          className="absolute right-0 top-full z-50 mt-2 w-[min(18rem,calc(100vw-2rem))] rounded-xl border border-line bg-white p-3 shadow-[0_16px_40px_rgba(26,46,38,0.14)]"
        >
          <div className="mb-3 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() =>
                setViewMonth(
                  (current) =>
                    new Date(current.getFullYear(), current.getMonth() - 1, 1),
                )
              }
              disabled={!canGoPrev}
              aria-label="Previous month"
              className="inline-flex size-8 items-center justify-center rounded-lg text-muted transition hover:bg-cream disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft size={16} strokeWidth={1.75} />
            </button>
            <p className="text-sm font-medium text-ink">{monthLabel}</p>
            <button
              type="button"
              onClick={() =>
                setViewMonth(
                  (current) =>
                    new Date(current.getFullYear(), current.getMonth() + 1, 1),
                )
              }
              aria-label="Next month"
              className="inline-flex size-8 items-center justify-center rounded-lg text-muted transition hover:bg-cream"
            >
              <ChevronRight size={16} strokeWidth={1.75} />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-medium text-muted">
            {WEEKDAYS.map((day) => (
              <span key={day} className="py-1">
                {day}
              </span>
            ))}
          </div>

          <div className="mt-1 grid grid-cols-7 gap-1">
            {Array.from({ length: firstWeekday }).map((_, index) => (
              <span key={`empty-${index}`} />
            ))}
            {Array.from({ length: daysInMonth }, (_, index) => index + 1).map(
              (day) => {
                const date = new Date(
                  viewMonth.getFullYear(),
                  viewMonth.getMonth(),
                  day,
                )
                const iso = toIsoDate(date)
                const isDisabled =
                  date <
                  new Date(min.getFullYear(), min.getMonth(), min.getDate())
                const isSelected = value === iso
                const isToday = iso === toIsoDate(min)

                return (
                  <button
                    key={day}
                    type="button"
                    disabled={isDisabled}
                    onClick={() => handleSelect(day)}
                    className={`inline-flex h-8 w-full items-center justify-center rounded-lg text-sm transition ${
                      isSelected
                        ? 'bg-forest text-white'
                        : isToday
                          ? 'bg-cream font-medium text-forest'
                          : 'text-ink hover:bg-cream'
                    } disabled:cursor-not-allowed disabled:opacity-35`}
                  >
                    {day}
                  </button>
                )
              },
            )}
          </div>

          <div className="mt-3 flex items-center justify-between border-t border-line pt-3 text-sm">
            <button
              type="button"
              onClick={handleClear}
              className="font-medium text-forest transition hover:text-ink"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={handleToday}
              className="font-medium text-forest transition hover:text-ink"
            >
              Today
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default DateFilterPicker
