import { useEffect, useId, useRef, useState } from 'react'
import { Check, ChevronDown, MapPin } from 'lucide-react'

const CourseLocationField = ({
  id,
  name,
  value = '',
  onChange,
  onBlur,
  error,
  locations = [],
  loading = false,
  placeholder = 'Select a course first',
}) => {
  const listId = useId()
  const rootRef = useRef(null)
  const [open, setOpen] = useState(false)
  const hasOptions = locations.length > 1

  useEffect(() => {
    setOpen(hasOptions)
  }, [hasOptions, locations])

  useEffect(() => {
    const handleOutside = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [])

  const pick = (displayName) => {
    onChange?.(displayName)
    setOpen(false)
  }

  return (
    <div ref={rootRef} className="relative w-full min-w-0">
      <div
        className={`flex w-full min-w-0 overflow-hidden rounded-lg border bg-white transition focus-within:ring-2 ${
          error
            ? 'border-red-400 focus-within:border-red-400 focus-within:ring-red-400/20'
            : 'border-line focus-within:border-forest focus-within:ring-forest/15'
        }`}
      >
        <input
          id={id}
          name={name}
          type="text"
          readOnly
          value={loading ? '' : value}
          placeholder={loading ? 'Loading course locations…' : placeholder}
          onBlur={onBlur}
          onFocus={() => {
            if (hasOptions) setOpen(true)
          }}
          onClick={() => {
            if (hasOptions) setOpen((v) => !v)
          }}
          className={`min-w-0 flex-1 border-0 bg-transparent px-4 py-3 text-sm outline-none placeholder:text-muted/70 ${
            value ? 'text-ink' : 'text-muted/70'
          } ${hasOptions ? 'cursor-pointer' : 'cursor-default'}`}
          aria-expanded={open}
          aria-controls={hasOptions ? listId : undefined}
          aria-haspopup={hasOptions ? 'listbox' : undefined}
        />

        {hasOptions && (
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex w-12 shrink-0 items-center justify-center border-l border-line bg-[#f3f4f6] text-muted transition hover:bg-[#e8eaed] hover:text-ink"
            aria-label="Show location options"
          >
            <ChevronDown
              size={18}
              strokeWidth={1.75}
              className={`transition ${open ? 'rotate-180' : ''}`}
            />
          </button>
        )}
      </div>

      {open && hasOptions && (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-20 mt-1.5 max-h-56 w-full overflow-auto rounded-lg border border-line bg-white py-1 shadow-[0_12px_28px_rgba(26,46,38,0.12)]"
        >
          {locations.map((location) => {
            const isActive = location.displayName === value
            return (
              <li key={location.placeId} role="option" aria-selected={isActive}>
                <button
                  type="button"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => pick(location.displayName)}
                  className={`flex w-full items-start gap-2.5 px-3.5 py-2.5 text-left text-sm transition hover:bg-[#e8f0ea] ${
                    isActive ? 'bg-[#e8f0ea] font-medium text-forest' : 'text-ink'
                  }`}
                >
                  <MapPin
                    size={15}
                    strokeWidth={1.75}
                    className="mt-0.5 shrink-0 text-muted"
                  />
                  <span className="min-w-0 flex-1 leading-relaxed">
                    {location.displayName}
                  </span>
                  {isActive && (
                    <Check
                      size={15}
                      strokeWidth={2}
                      className="mt-0.5 shrink-0 text-forest"
                    />
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

export default CourseLocationField
